import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getFeedbackStatus } from "../../services/feedbackService";

const STATUS_LABEL = {
  new: "Baru",
  reviewed: "Ditinjau",
  resolved: "Selesai",
};

const STATUS_COLOR = {
  new: "#FF9800",
  reviewed: "#2196F3",
  resolved: "#4CAF50",
};

const RATING_LABEL = { 1: "Kurang", 2: "Cukup", 3: "Baik", 4: "Sangat Baik" };

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function FeedbackStatus() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setErrorMsg(null);
      const { feedbacks: data } = await getFeedbackStatus(1, 20);
      setFeedbacks(data);
    } catch (error) {
      setErrorMsg(error?.message || "Gagal memuat status feedback.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={28} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Status Feedback</Text>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#2E7D32"
            style={{ marginTop: 40 }}
          />
        ) : errorMsg ? (
          <View style={styles.emptyBox}>
            <MaterialIcons name="error-outline" size={40} color="#D32F2F" />
            <Text style={styles.emptyText}>{errorMsg}</Text>
          </View>
        ) : feedbacks.length === 0 ? (
          <View style={styles.emptyBox}>
            <MaterialIcons name="chat-bubble-outline" size={40} color="#CCC" />
            <Text style={styles.emptyText}>
              Anda belum pernah mengirim feedback.
            </Text>
          </View>
        ) : (
          feedbacks.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.menuName} numberOfLines={1}>
                  {item.menu_id?.menu_name || "Menu"}
                </Text>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: STATUS_COLOR[item.status] + "22" },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: STATUS_COLOR[item.status] },
                    ]}
                  >
                    {STATUS_LABEL[item.status] || item.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.date}>
                {item.menu_id?.menu_date
                  ? formatDate(item.menu_id.menu_date)
                  : ""}
              </Text>

              <Text style={styles.rating}>
                Rating: {RATING_LABEL[item.rating] || item.rating}
              </Text>

              {item.comment ? (
                <Text style={styles.comment}>
                  &ldquo;{item.comment}&rdquo;
                </Text>
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  header: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 12,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  menuName: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  date: {
    color: "#777",
    fontSize: 12,
    marginBottom: 8,
  },

  rating: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },

  comment: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
  },

  emptyText: {
    color: "#999",
    marginTop: 10,
    textAlign: "center",
  },
});
