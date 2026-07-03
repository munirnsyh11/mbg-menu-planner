import { MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/home")}
      >
        <MaterialIcons
          name="home"
          size={26}
          color={
            pathname === "/home"
              ? "#2E7D32"
              : "#B0B0B0"
          }
        />

        <Text
          style={[
            styles.label,
            pathname === "/home" &&
              styles.activeLabel,
          ]}
        >
          Beranda
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/history")}
      >
        <MaterialIcons
          name="history"
          size={26}
          color={
            pathname === "/history"
              ? "#2E7D32"
              : "#B0B0B0"
          }
        />

        <Text
          style={[
            styles.label,
            pathname === "/history" &&
              styles.activeLabel,
          ]}
        >
          Riwayat
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/feedback")}
      >
        <MaterialIcons
          name="chat-bubble-outline"
          size={26}
          color={
            pathname === "/feedback"
              ? "#2E7D32"
              : "#B0B0B0"
          }
        />

        <Text
          style={[
            styles.label,
            pathname === "/feedback" &&
              styles.activeLabel,
          ]}
        >
          Feedback
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/profile")}
      >
        <MaterialIcons
          name="person"
          size={26}
          color={
            pathname === "/profile"
              ? "#2E7D32"
              : "#B0B0B0"
          }
        />

        <Text
          style={[
            styles.label,
            pathname === "/profile" &&
              styles.activeLabel,
          ]}
        >
          Profil
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },

  navItem: {
    alignItems: "center",
  },

  label: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },

  activeLabel: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
});