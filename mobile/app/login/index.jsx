import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { login } from "../../services/authService";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("Peringatan", "Email wajib diisi");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Peringatan", "Password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim(), password);

      router.replace("/home");
    } catch (error) {
      Alert.alert(
        "Login Gagal",
        error?.message || "Email atau password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/logo-mbg.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>
        Makan Bergizi Gratis
      </Text>

      <Text style={styles.subtitle}>
        Silakan login untuk melanjutkan
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          placeholder="Masukkan email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          placeholder="Masukkan password"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          editable={!loading}
        />
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.loginText}>
            LOGIN
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 25,
  },

  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },

  title: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E7D32",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 5,
    marginBottom: 30,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    marginBottom: 8,
    fontWeight: "600",
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFFFFF",
  },

  loginButton: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },

  loginText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "bold",
  },
});
