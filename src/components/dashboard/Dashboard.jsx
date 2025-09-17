import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

// Categories Data
const categories = [
  { id: 1, title: "Flour", image: require("../../images/flour.png") },
  { id: 2, title: "Grains", image: require("../../images/flour.png") },
  { id: 3, title: "Spices", image: require("../../images/flour.png") },
  { id: 4, title: "Oil", image: require("../../images/flour.png") },
  { id: 5, title: "Multi Grain Flour", image: require("../../images/flour.png") },
];

// Products Data
const products = [
  { id: 1, name: "Organic Wheat Flour", price: "5.99", image: require("../../images/flour.png") },
  { id: 2, name: "Brown Rice", price: "3.49", image: require("../../images/flour.png") },
  { id: 3, name: "Cumin Seeds", price: "2.99", image: require("../../images/flour.png") },
  { id: 4, name: "Olive Oil", price: "8.99", image: require("../../images/flour.png") },
];

const Dashboard = () => {
  const navigation = useNavigation();

  const handleProductPress = (product) => {
    navigation.navigate("ProductDetails", { product });
  };

  return (
    <ScrollView style={styles.container}>
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
        {categories.map((cat) => (
          <View key={cat.id} style={styles.categoryItem}>
            <Image source={cat.image} style={styles.categoryImage} />
            <Text style={styles.categoryText}>{cat.title}</Text>
          </View>
        ))}
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

      {/* Products List */}
      <View style={styles.productsSection}>
        <Text style={styles.productsTitle}>Products</Text>
        {products.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productItem} onPress={() => handleProductPress(product)}>
            <Image source={product.image} style={styles.productImage} />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productPrice}>${product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
  productsSection: { marginTop: 20 },
  productsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  productImage: { width: 60, height: 60, borderRadius: 10, backgroundColor: "#ddd" },
  productDetails: { marginLeft: 10 },
  productName: { fontSize: 16, fontWeight: "bold" },
  productPrice: { fontSize: 14, color: "#888", marginTop: 4 },
});