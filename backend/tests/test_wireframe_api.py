"""Backend API tests for MBG Wireframe Studio."""
import io
import os
import zipfile
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://figma-auto-builder.preview.emergentagent.com").rstrip("/")

EXPECTED_SCREEN_IDS = [
    "web-login", "web-dashboard", "web-foods-list", "web-foods-form",
    "web-nutrition", "web-kmeans", "web-menu", "web-feedback",
    "mobile-login", "mobile-home", "mobile-detail", "mobile-history",
    "mobile-feedback", "mobile-feedback-status",
]


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    return s


# --- Root / metadata ---
def test_root_info(session):
    r = session.get(f"{BASE_URL}/api/")
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["screens"] == 14
    assert data["web_screens"] == 8
    assert data["mobile_screens"] == 6
    assert data["app"] == "MBG Wireframe Studio"


# --- Wireframes list ---
def test_list_wireframes_structure(session):
    r = session.get(f"{BASE_URL}/api/wireframes")
    assert r.status_code == 200
    data = r.json()
    assert "colors" in data and isinstance(data["colors"], dict)
    assert "screens" in data and isinstance(data["screens"], list)
    assert len(data["screens"]) == 14
    ids = [s["id"] for s in data["screens"]]
    for eid in EXPECTED_SCREEN_IDS:
        assert eid in ids, f"Missing screen id: {eid}"
    for s in data["screens"]:
        assert "id" in s and "name" in s and "frame" in s and "blocks" in s
        assert "w" in s["frame"] and "h" in s["frame"]
        assert isinstance(s["blocks"], list) and len(s["blocks"]) > 0


# --- All-html literal route (must not be shadowed) ---
def test_all_html_route(session):
    r = session.get(f"{BASE_URL}/api/wireframes/all/html")
    assert r.status_code == 200
    assert "text/html" in r.headers.get("content-type", "")
    body = r.text
    assert "Web Admin" in body
    assert "Mobile App" in body


# --- Per-screen HTML for each of 14 screens ---
@pytest.mark.parametrize("sid", EXPECTED_SCREEN_IDS)
def test_screen_html(session, sid):
    r = session.get(f"{BASE_URL}/api/wireframes/{sid}/html")
    assert r.status_code == 200, f"{sid} returned {r.status_code}"
    assert "text/html" in r.headers.get("content-type", "")
    assert "<html" in r.text.lower()


def test_invalid_screen_404(session):
    r = session.get(f"{BASE_URL}/api/wireframes/invalid-id/html")
    assert r.status_code == 404


# --- Figma plugin zip download ---
def test_figma_plugin_download(session):
    r = session.get(f"{BASE_URL}/api/figma-plugin/download")
    assert r.status_code == 200
    assert r.headers.get("content-type") == "application/zip"
    content = r.content
    assert len(content) > 5 * 1024, f"Zip too small: {len(content)} bytes"

    zf = zipfile.ZipFile(io.BytesIO(content))
    names = zf.namelist()
    expected = [
        "mbg-wireframe-plugin/manifest.json",
        "mbg-wireframe-plugin/code.js",
        "mbg-wireframe-plugin/ui.html",
        "mbg-wireframe-plugin/README.md",
    ]
    for e in expected:
        assert e in names, f"Missing {e} in zip. Found: {names}"

    code_js = zf.read("mbg-wireframe-plugin/code.js").decode("utf-8")
    assert "figma.showUI" in code_js
    assert "SPEC" in code_js


def test_figma_plugin_code_js_valid_syntax(session):
    """Validate code.js is parseable JavaScript using node --check."""
    import subprocess, tempfile
    r = session.get(f"{BASE_URL}/api/figma-plugin/download")
    assert r.status_code == 200
    zf = zipfile.ZipFile(io.BytesIO(r.content))
    code_js = zf.read("mbg-wireframe-plugin/code.js").decode("utf-8")
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as f:
        f.write(code_js)
        path = f.name
    proc = subprocess.run(["node", "--check", path], capture_output=True, text=True)
    assert proc.returncode == 0, f"code.js syntax error: {proc.stderr}"
