import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getMe } from "../../services/authService";
import { getToken, clearSession } from "../../utils/storage";

const MIN_SPLASH_MS = 1500;

export default function Splash() {
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const start = Date.now();

    try {
      const token = await getToken();

      if (!token) {
        return finish("/login", start);
      }

      // Validasi token ke backend (GET /api/auth/me)
      await getMe();
      finish("/home", start);
    } catch (error) {
      // Token tidak valid / kadaluarsa
      await clearSession();
      finish("/login", start);
    }
  };

  const finish = (destination, start) => {
    const elapsed = Date.now() - start;
    const wait = Math.max(MIN_SPLASH_MS - elapsed, 0);

    setTimeout(() => {
      router.replace(destination);
    }, wait);
  };

  return (
    <View style={styles.container}>
      {/* Background Shape */}
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      {/* Logo MBG */}
      <Image
        source={require("../../assets/logo-mbg.png")}
        style={styles.logo}
      />

      {/* Judul */}
      <Text style={styles.title}>
        MBG Menu Planner
      </Text>

      <Text style={styles.subtitle}>
        Auto-Nutrient Balancing System
      </Text>

      {/* Deskripsi */}
      <Text style={styles.description}>
        Membantu penyusunan menu bergizi
        seimbang untuk generasi sehat
        Indonesia.
      </Text>

      {/* Loading */}
      <ActivityIndicator
        size="large"
        color="#2E7D32"
        style={{ marginTop: 40 }}
      />

      <Text style={styles.loadingText}>
        Memuat...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  topCircle: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor:
      "rgba(46,125,50,0.08)",
  },

  bottomCircle: {
    position: "absolute",
    bottom: -120,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor:
      "rgba(46,125,50,0.08)",
  },

  logo: {
    width: 180,
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },

  description: {
    marginTop: 25,
    textAlign: "center",
    color: "#777",
    lineHeight: 24,
    fontSize: 15,
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
    fontSize: 14,
  },
});
