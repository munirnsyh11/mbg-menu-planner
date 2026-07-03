import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getMenuDetail, getTodayMenu } from "../../services/menuService";

const formatDate = (dateStr) => {
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const NutrientRow = ({ label, value, unit, percent }) => {
  const clampedPercent = Math.min(Math.max(percent ?? 0, 0), 100);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.nutriLabel}>{label}</Text>
          <Text style={styles.nutriValue}>
            {value} {unit}
          </Text>
        </View>

        <View style={styles.progressBox}>
          <View style={styles.progressBg}>
            <View
              style={[styles.progressFill, { width: `${clampedPercent}%` }]}
            />
          </View>
          <Text style={styles.percent}>{percent ?? 0}% AKG</Text>
        </View>
      </View>
    </View>
  );
};

export default function MenuDetail() {
  const { id } = useLocalSearchParams();

  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    loadMenu();
  }, [id]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const data = id ? await getMenuDetail(id) : await getTodayMenu();
      setMenu(data);
    } catch (error) {
      setErrorMsg(error?.message || "Gagal memuat detail menu.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerScreen}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{ marginTop: 10 }}>Memuat detail menu...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={28} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Detail Nutrisi</Text>
      </View>

      {errorMsg || !menu ? (
        <View style={styles.emptyBox}>
          <MaterialIcons name="info-outline" size={40} color="#CCC" />
          <Text style={styles.emptyText}>
            {errorMsg || "Menu tidak ditemukan."}
          </Text>
        </View>
      ) : (
        <>
          {/* Menu */}
          <Text style={styles.label}>MENU</Text>

          <Text style={styles.menuTitle}>{menu.menu_name}</Text>

          <Text style={styles.portion}>{formatDate(menu.menu_date)}</Text>

          <View style={styles.divider} />

          {/* Nutrisi */}
          <Text style={styles.sectionTitle}>Komposisi Nutrisi</Text>

          <NutrientRow
            label="Kalori"
            value={menu.total_calories}
            unit="kcal"
            percent={menu.akg_percentage?.calories}
          />

          <NutrientRow
            label="Protein"
            value={menu.total_protein}
            unit="g"
            percent={menu.akg_percentage?.protein}
          />

          <NutrientRow
            label="Lemak"
            value={menu.total_fat}
            unit="g"
            percent={menu.akg_percentage?.fat}
          />

          <NutrientRow
            label="Karbohidrat"
            value={menu.total_carbohydrate}
            unit="g"
            percent={menu.akg_percentage?.carbohydrate}
          />

          {/* Daftar bahan makanan */}
          {menu.items?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Bahan Makanan</Text>

              {menu.items.map((item, index) => (
                <View key={item._id || index} style={styles.foodCard}>
                  <View style={styles.foodIcon}>
                    <MaterialIcons
                      name="restaurant"
                      size={20}
                      color="#2E7D32"
                    />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.foodName}>
                      {item.food_id?.name || "Bahan makanan"}
                    </Text>
                    <Text style={styles.foodPortion}>
                      {item.portion_gram}g •{" "}
                      {Math.round(item.calories_contrib)} kkal
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push(`/feedback?menuId=${menu._id}`)}
          >
            <Text style={styles.buttonText}>Beri Feedback Menu</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 12,
  },

  label: {
    color: "#777",
    fontSize: 12,
    marginBottom: 8,
  },

  menuTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  portion: {
    color: "#777",
    marginBottom: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nutriLabel: {
    color: "#777",
    marginBottom: 5,
  },

  nutriValue: {
    fontSize: 26,
    fontWeight: "bold",
  },

  progressBox: {
    width: 180,
  },

  progressBg: {
    height: 8,
    backgroundColor: "#E5E5E5",
    borderRadius: 10,
  },

  progressFill: {
    height: 8,
    backgroundColor: "#2E7D32",
    borderRadius: 10,
  },

  percent: {
    textAlign: "right",
    color: "#777",
    marginTop: 6,
    fontSize: 12,
  },

  foodCard: {
    backgroundColor: "#FFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  foodName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  foodPortion: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },

  button: {
    backgroundColor: "#2E7D32",
    borderRadius: 16,
    padding: 18,
    marginTop: 15,
    marginBottom: 30,
  },

  buttonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
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
