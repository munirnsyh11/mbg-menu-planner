import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "../../components/BottomNav";
import { RATING_OPTIONS, submitFeedback } from "../../services/feedbackService";
import { getTodayMenu } from "../../services/menuService";

export default function Feedback() {
  const { menuId } = useLocalSearchParams();

  const [menu, setMenu] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  const [selected, setSelected] = useState(RATING_OPTIONS[1].value); // default "Baik"
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMenu();
  }, [menuId]);

  const loadMenu = async () => {
    try {
      setMenuLoading(true);
      setMenuError(null);

      if (menuId) {
        setMenu({ _id: menuId, menu_name: null });
      }

      // Selalu ambil menu hari ini untuk memastikan data terbaru & valid untuk feedback
      const today = await getTodayMenu();
      setMenu(today);
    } catch (error) {
      setMenuError(error?.message || "Menu hari ini belum tersedia.");
      setMenu(null);
    } finally {
      setMenuLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!menu?._id) {
      Alert.alert(
        "Tidak Bisa Mengirim",
        "Feedback hanya dapat dikirim untuk menu yang sudah dipublikasikan hari ini."
      );
      return;
    }

    try {
      setLoading(true);

      await submitFeedback({
        menu_id: menu._id,
        rating: selected,
        comment,
      });

      Alert.alert("Berhasil", "Feedback berhasil dikirim");

      setComment("");
      setSelected(RATING_OPTIONS[1].value);
    } catch (error) {
      Alert.alert(
        "Gagal Mengirim",
        error?.message || "Gagal mengirim feedback"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="chat-bubble-outline" size={28} color="#222" />
          <Text style={styles.title}>Kirim Feedback</Text>
        </View>

        <View style={styles.menuCard}>
          <View style={styles.thumbnail}>
            <MaterialIcons name="restaurant" size={26} color="#2E7D32" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.menuLabel}>MENU HARI INI</Text>

            {menuLoading ? (
              <ActivityIndicator size="small" color="#2E7D32" />
            ) : (
              <Text style={styles.menuTitle} numberOfLines={2}>
                {menu?.menu_name || menuError || "Menu belum tersedia"}
              </Text>
            )}
          </View>
        </View>

        <Text style={styles.question}>Bagaimana menu hari ini?</Text>

        {RATING_OPTIONS.map((item) => (
          <TouchableOpacity
            key={item.value}
            style={[
              styles.optionCard,
              selected === item.value && styles.selectedCard,
            ]}
            onPress={() => setSelected(item.value)}
          >
            <MaterialIcons
              name={
                selected === item.value
                  ? "radio-button-checked"
                  : "radio-button-unchecked"
              }
              size={24}
              color={selected === item.value ? "#212121" : "#CCCCCC"}
            />

            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.commentLabel}>Komentar (opsional)</Text>

        <TextInput
          multiline
          value={comment}
          onChangeText={setComment}
          placeholder="Tulis pendapat Anda di sini..."
          placeholderTextColor="#666"
          style={styles.input}
          maxLength={500}
        />

        <TouchableOpacity
          style={[
            styles.button,
            (loading || !menu?._id) && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !menu?._id}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Kirim Feedback</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },

  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 10,
  },

  menuCard: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },

  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  menuLabel: {
    color: "#777",
    fontSize: 12,
    marginBottom: 5,
  },

  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  question: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  optionCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: "#212121",
  },

  optionText: {
    marginLeft: 12,
    fontSize: 18,
  },

  commentLabel: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  input: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    height: 150,
    textAlignVertical: "top",
  },

  button: {
    backgroundColor: "#212121",
    borderRadius: 15,
    padding: 18,
    marginTop: 25,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
