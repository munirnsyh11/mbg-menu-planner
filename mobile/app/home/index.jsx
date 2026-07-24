import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BottomNav from "../../components/BottomNav";
import { banners } from "../../data/banners";
import { getCachedUser, getMe } from "../../services/authService";
import { getTodayMenu } from "../../services/menuService";

const { width } = Dimensions.get("window");

const getCurrentDate = () => {
  const today = new Date();

  return today.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi,";
  if (hour < 15) return "Selamat Siang,";
  if (hour < 18) return "Selamat Sore,";
  return "Selamat Malam,";
};

export default function Home() {
  const [menuToday, setMenuToday] = useState(null);
  const [menuError, setMenuError] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeBanner, setActiveBanner] = useState(0);
  const bannerRef = useRef(null);
  const eventWidth = useRef(width - 64);

  const loadData = useCallback(async () => {
    // Tampilkan cache dulu agar terasa cepat, lalu refresh dari server
    const cached = await getCachedUser();
    if (cached) setUser(cached);

    const results = await Promise.allSettled([getMe(), getTodayMenu()]);

    const [meResult, menuResult] = results;

    if (meResult.status === "fulfilled") {
      setUser(meResult.value);
    }

    if (menuResult.status === "fulfilled") {
      setMenuToday(menuResult.value);
      setMenuError(null);
    } else {
      setMenuToday(null);
      setMenuError(
        menuResult.reason?.message || "Menu hari ini belum tersedia."
      );
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex =
        activeBanner === banners.length - 1 ? 0 : activeBanner + 1;

      bannerRef.current?.scrollTo({
        x: nextIndex * (eventWidth.current || width - 64),
        animated: true,
      });

      setActiveBanner(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [activeBanner]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 10 }}>Memuat data...</Text>
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
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>

            <Text style={styles.name}>{user?.name || "Petugas Sekolah"}</Text>

            <Text style={styles.school}>
              {(user?.school_name ? `${user.school_name} • ` : "") +
                getCurrentDate()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.avatar}
            onPress={() => router.push("/profile")}
          >
            <MaterialIcons name="person" size={40} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Banner Menu */}
        <View style={styles.bannerCard}>
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            snapToInterval={width - 64}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              eventWidth.current = event.nativeEvent.layoutMeasurement.width;
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  event.nativeEvent.layoutMeasurement.width
              );

              setActiveBanner(index);
            }}
          >
            {banners.map((banner, index) => (
              <Image
                key={index}
                source={banner}
                style={styles.bannerFull}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          <View style={styles.indicatorContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  activeBanner === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>

          <Text style={styles.menuLabel}>MENU HARI INI</Text>

          {menuToday ? (
            <>
              <Text style={styles.menuTitle} numberOfLines={2}>
                {menuToday.menu_name}
              </Text>

              <View style={styles.statusCard}>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status</Text>
                  <Text style={styles.statusValue}>
                    Sudah Dipublikasikan
                  </Text>
                </View>

                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Validasi AKG</Text>
                  <Text
                    style={[
                      styles.statusValue,
                      { color: menuToday.meets_akg ? "#2E7D32" : "#D32F2F" },
                    ]}
                  >
                    {menuToday.meets_akg ? "Memenuhi AKG" : "Belum Memenuhi"}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.emptyMenuBox}>
              <MaterialIcons name="info-outline" size={22} color="#999" />
              <Text style={styles.emptyMenuText}>
                {menuError || "Menu hari ini belum dipublikasikan."}
              </Text>
            </View>
          )}
        </View>

        {/* Nutrisi */}
        <Text style={styles.sectionTitle}>Ringkasan Nutrisi</Text>

        <View style={styles.grid}>
          <View style={[styles.nutritionCard, { backgroundColor: "#FFF3E0" }]}>
            <MaterialIcons
              name="local-fire-department"
              size={26}
              color="#FF9800"
            />
            <Text style={styles.nutritionLabel}>Kalori</Text>
            <Text style={styles.nutritionValue}>
              {menuToday ? menuToday.total_calories : "-"}
            </Text>
          </View>

          <View style={[styles.nutritionCard, { backgroundColor: "#E8F5E9" }]}>
            <MaterialIcons name="fitness-center" size={26} color="#4CAF50" />
            <Text style={styles.nutritionLabel}>Protein</Text>
            <Text style={styles.nutritionValue}>
              {menuToday ? `${menuToday.total_protein}g` : "-"}
            </Text>
          </View>

          <View style={[styles.nutritionCard, { backgroundColor: "#FCE4EC" }]}>
            <MaterialIcons name="eco" size={26} color="#E91E63" />
            <Text style={styles.nutritionLabel}>Lemak</Text>
            <Text style={styles.nutritionValue}>
              {menuToday ? `${menuToday.total_fat}g` : "-"}
            </Text>
          </View>

          <View style={[styles.nutritionCard, { backgroundColor: "#E3F2FD" }]}>
            <MaterialIcons name="restaurant" size={26} color="#2196F3" />
            <Text style={styles.nutritionLabel}>Karbo</Text>
            <Text style={styles.nutritionValue}>
              {menuToday ? `${menuToday.total_carbohydrate}g` : "-"}
            </Text>
          </View>
        </View>

        {/* Detail Nutrisi */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            menuToday
              ? router.push(`/menu-detail?id=${menuToday._id}`)
              : router.push("/menu-detail")
          }
        >
          <View style={styles.buttonLeft}>
            <MaterialIcons name="restaurant-menu" size={22} color="#555" />
            <Text style={styles.buttonText}>Lihat Detail Nutrisi</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
        </TouchableOpacity>

        {/* Feedback */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            menuToday
              ? router.push(`/feedback?menuId=${menuToday._id}`)
              : router.push("/feedback")
          }
        >
          <View style={styles.buttonLeft}>
            <MaterialIcons name="chat-bubble-outline" size={22} color="#555" />
            <Text style={styles.buttonText}>Kirim Feedback</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#888" />
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

  header: {
    marginTop: 50,
    marginBottom: 25,
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    color: "#777",
    fontSize: 18,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  school: {
    color: "#777",
    marginTop: 5,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#C8E6C9",
    justifyContent: "center",
    alignItems: "center",
  },

  bannerFull: {
    width: width - 64,
    height: 170,
    borderRadius: 16,
  },

  menuLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#757575",
    letterSpacing: 1,
    marginTop: 5,
  },

  menuTitle: {
    fontSize: 27,
    fontWeight: "700",
    lineHeight: 34,
    marginTop: 10,
    marginBottom: 8,
    color: "#212121",
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  nutritionCard: {
    width: "48%",
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  nutritionLabel: {
    color: "#777",
    marginTop: 8,
    marginBottom: 8,
    fontSize: 13,
  },

  nutritionValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#212121",
  },

  menuButton: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#2E7D32",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonText: {
    marginLeft: 10,
    fontSize: 17,
  },

  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
    marginTop: 10,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CCC",
    marginHorizontal: 4,
  },

  activeIndicator: {
    backgroundColor: "#2E7D32",
    width: 20,
  },

  bannerCard: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
  },

  statusCard: {
    backgroundColor: "#F9FCF9",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E3F2E6",
    padding: 16,
    marginTop: 6,
    marginBottom: 10,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  statusLabel: {
    fontSize: 15,
    color: "#757575",
  },

  statusValue: {
    fontSize: 15,
    color: "#2E7D32",
    fontWeight: "700",
  },

  emptyMenuBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F5F5F5",
    flexDirection: "row",
    alignItems: "center",
  },

  emptyMenuText: {
    marginLeft: 10,
    color: "#777",
    flex: 1,
  },
});
