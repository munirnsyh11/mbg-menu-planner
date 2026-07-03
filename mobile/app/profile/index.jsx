import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "../../components/BottomNav";
import { getCachedUser, getMe, logout } from "../../services/authService";

const ROLE_LABEL = {
  admin: "Admin",
  school_officer: "Petugas Sekolah",
};

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const cached = await getCachedUser();
      if (cached) setProfile(cached);

      const data = await getMe();
      setProfile(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Yakin ingin logout?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            setLoggingOut(true);
            await logout();
          } finally {
            setLoggingOut(false);
            router.replace("/login");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 10 }}>Memuat profil...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Profil</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={70} color="#999" />
          </View>

          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Sekolah</Text>
            <Text style={styles.infoValue}>
              {profile?.school_name || "-"}
            </Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>
              {ROLE_LABEL[profile?.role] || profile?.role || "-"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/feedback-status")}
        >
          <View style={styles.menuLeft}>
            <MaterialIcons name="chat" size={24} color="#2E7D32" />
            <Text style={styles.menuText}>Status Feedback</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialIcons name="logout" size={22} color="#FFF" />
              <Text style={styles.logoutText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  centerScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  title: {
    marginTop: 50,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
  },

  profileCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  name: {
    fontSize: 22,
    fontWeight: "bold",
  },

  email: {
    color: "#777",
    marginTop: 5,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  infoCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
  },

  infoLabel: {
    color: "#777",
    marginBottom: 5,
  },

  infoValue: {
    fontWeight: "bold",
  },

  menuItem: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 12,
    fontSize: 16,
  },

  logoutButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 15,
    padding: 18,
    marginTop: 10,
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
    marginLeft: 10,
    fontSize: 16,
  },
});
