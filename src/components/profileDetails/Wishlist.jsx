import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Wishlist = () => {
  const navigation = useNavigation();

  const [wishlist, setWishlist] = useState([
    {
      id: "2",
      name: "Flour",
      price: "₹24,999",
      image:
        "https://cdn.shopify.com/s/files/1/0517/5391/0426/files/Whole_Wheat_Flour_Benefits.png?v=1750243817",
    },
    {
      id: "3",
      name: "Multi Grain",
      price: "₹2,499",
      image:
        "https://cdn.shopify.com/s/files/1/0517/5391/0426/files/Whole_Wheat_Flour_Benefits.png?v=1750243817",
    },
  ]);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const handleNavigate = (item) => {
    navigation.navigate("ProductDetails", { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleNavigate(item)}>
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cartBtn}>
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.cartText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemove(item.id)}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
      </View>

      {/* Wishlist Items */}
      {wishlist.length > 0 ? (
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.empty}>
          <Ionicons name="heart-dislike-outline" size={50} color="#aaa" />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        </View>
      )}
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginRight: 24, // Align center even with back button
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    alignItems: "center",
  },
  image: { width: 70, height: 70, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#222" },
  price: { fontSize: 14, fontWeight: "500", color: "#444", marginTop: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A98C43",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  cartText: { color: "#fff", marginLeft: 6, fontSize: 11, fontWeight: "600" },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: { fontSize: 16, color: "#777", marginTop: 10 },
});
