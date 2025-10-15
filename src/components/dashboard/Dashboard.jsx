import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  RefreshControl 
} from "react-native";
import React, { useEffect, useState } from "react";
import SummaryApi from "../../common";

const Dashboard = () => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch all dashboard data
  const loadDashboard = async () => {
    setLoadingCategories(true);

    try {
      const response = await fetch(SummaryApi.getCategorys.url, {
        method: SummaryApi.getCategorys.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoadingCategories(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    // Reset state if needed
    setCategories([]);
    loadDashboard();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          colors={['#007bff']} 
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>All Featured</Text>
        <View style={styles.sortFilter}>
          <TouchableOpacity style={styles.sortBtn}>
            <Text>Sort ⬍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn}>
            <Text>Filter ⏳</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories}>
        {loadingCategories ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : categories.length > 0 ? (
          categories.map((cat) => (
            <View key={cat._id} style={styles.categoryItem}>
              <Image
                source={{ uri: cat.image }}
                style={styles.categoryImage}
              />
              <Text style={styles.categoryText}>{cat.title || cat.name}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "#888" }}>No categories found</Text>
        )}
      </ScrollView>

      {/* Offer Banner */}
      <View style={styles.offerCard}>
        <Text style={styles.offerTitle}>10-20% OFF</Text>
        <Text style={styles.offerSub}>Now in (product)</Text>
        <Text style={styles.offerSub}>Multi Grain Flour</Text>
        <TouchableOpacity style={styles.shopNowBtn}>
          <Text style={styles.shopNowText}>Shop Now →</Text>
        </TouchableOpacity>
      </View>

      {/* Deal of the Day */}
      <View style={styles.dealCard}>
        <View>
          <Text style={styles.dealTitle}>Deal of the Day</Text>
          <Text style={styles.dealTimer}>22h 55m 20s remaining</Text>
        </View>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View all →</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerText: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 15 },
  sortFilter: { flexDirection: "row" },
  sortBtn: { marginHorizontal: 5, padding: 6, backgroundColor: "#eee", borderRadius: 8 },
  filterBtn: { marginHorizontal: 5, padding: 6, backgroundColor: "#eee", borderRadius: 8 },
  categories: { marginVertical: 15 },
  categoryItem: { alignItems: "center", marginRight: 15, marginBottom: 25, marginTop: 15 },
  categoryImage: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#ddd" },
  categoryText: { marginTop: 5, fontSize: 12 },
  offerCard: {
    backgroundColor: "#b8af9dff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  offerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  offerSub: { fontSize: 14, color: "#fff", marginTop: 2 },
  shopNowBtn: { marginTop: 10, borderWidth: 1, borderColor: "#fff", padding: 8, borderRadius: 8 },
  shopNowText: { color: "#fff", fontWeight: "bold" },
  dealCard: {
    backgroundColor: "#e7a7a7ff",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dealTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  dealTimer: { fontSize: 14, color: "#fff", marginTop: 5 },
  viewAllBtn: { backgroundColor: "#fff", padding: 8, borderRadius: 8 },
  viewAllText: { color: "#4da6ff", fontWeight: "bold" },
});
