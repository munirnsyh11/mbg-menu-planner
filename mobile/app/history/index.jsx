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
import BottomNav from "../../components/BottomNav";
import { getHistoryMenu } from "../../services/menuService";

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

export default function History() {
  const [historyMenu, setHistoryMenu] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setErrorMsg(null);
      const { menus, pagination: pag } = await getHistoryMenu(2, 20);
      setHistoryMenu(menus);
      setPagination(pag);
    } catch (error) {
      setErrorMsg(error?.message || "Gagal memuat riwayat menu.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (!pagination?.hasNext || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = pagination.page + 1;
      const { menus, pagination: pag } = await getHistoryMenu(nextPage, 10);
      setHistoryMenu((prev) => [...prev, ...menus]);
      setPagination(pag);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 10 }}>Memuat riwayat...</Text>
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
        onScrollEndDrag={loadMore}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Riwayat Menu</Text>

          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => router.push("/profile")}
          >
            <MaterialIcons name="person" size={30} color="#999" />
          </TouchableOpacity>
        </View>

        {errorMsg && (
          <View style={styles.errorBox}>
            <MaterialIcons name="error-outline" size={20} color="#D32F2F" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}

        {!errorMsg && historyMenu.length === 0 && (
          <View style={styles.emptyBox}>
            <MaterialIcons name="inbox" size={40} color="#CCC" />
            <Text style={styles.emptyText}>Belum ada riwayat menu.</Text>
          </View>
        )}

        {/* Cards */}
        {historyMenu.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={styles.card}
            onPress={() => router.push(`/menu-detail?id=${item._id}`)}
          >
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: item.meets_akg ? "#E8F5E9" : "#FFEBEE",
                },
              ]}
            >
              <MaterialIcons
                name={item.meets_akg ? "check-circle" : "info"}
                size={26}
                color={item.meets_akg ? "#4CAF50" : "#E57373"}
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.date}>{formatDate(item.menu_date)}</Text>

              <Text style={styles.menu} numberOfLines={1}>
                {item.menu_name}
              </Text>

              <View style={styles.badges}>
                <Text style={styles.badgeText}>
                  {item.total_calories} kkal
                </Text>
                <Text style={styles.badgeText}>
                  {item.total_protein}g protein
                </Text>
              </View>
            </View>

            <MaterialIcons name="chevron-right" size={26} color="#999" />
          </TouchableOpacity>
        ))}

        {loadingMore && (
          <ActivityIndicator
            size="small"
            color="#2E7D32"
            style={{ marginVertical: 10 }}
          />
        )}
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

  header: {
    marginTop: 50,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  profileIcon: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  cardContent: {
    flex: 1,
  },

  date: {
    color: "#777",
    fontSize: 12,
    marginBottom: 5,
  },

  menu: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },

  badges: {
    flexDirection: "row",
  },

  badgeText: {
    fontSize: 12,
    color: "#2E7D32",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
  },

  errorBox: {
    backgroundColor: "#FFEBEE",
    borderRadius: 12,
    padding: 14,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  errorText: {
    color: "#D32F2F",
    marginLeft: 8,
    flex: 1,
  },

  emptyBox: {
    alignItems: "center",
    paddingVertical: 60,
  },

  emptyText: {
    color: "#999",
    marginTop: 10,
  },
});
