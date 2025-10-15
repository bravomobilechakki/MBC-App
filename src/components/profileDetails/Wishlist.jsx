import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import SummaryApi from "../../common";
import axios from "axios";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const IMAGE_HEIGHT = CARD_WIDTH; // ✅ Square Image

const Wishlist = () => {
  const navigation = useNavigation();
  const { token } = useContext(UserContext);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // ----------------- Fetch Wishlist --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const fetchWishlist = async () => {
    if (!token) return setLoading(false);
    try {
      setLoading(true);
      const { data } = await axios.get(SummaryApi.getWishlist.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch wishlist items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [token]);

  // ----------------- Remove Item -----------------------------------------------------------------------------------------------------------------------------------------------------
  const handleRemove = async (productId) => {
    try {
      const { data } = await axios.delete(SummaryApi.removeFromWishlist.url, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
      });
      if (data.success !== false) {
        setWishlist((prev) => prev.filter((item) => item.productId._id !== productId));
        Alert.alert("Removed", data.message || "");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to remove item from wishlist.");
    }
  };

  // ----------------- Add to Cart ------------------------------------------------------------------------------------------------------------------------------------------------------
  const handleAddToCart = async (product) => {
    try {
      const { data } = await axios.post(
        SummaryApi.addToCart.url,
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        Alert.alert("Success", "Item added to cart!");
      } else {
        Alert.alert("Error", data.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong while adding to cart.");
    }
  };

  const handleNavigate = (item) => {
    navigation.navigate("ProductDetails", { product: item.productId });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleNavigate(item)}>
        <Image source={{ uri: item.productId.images[0] }} style={styles.image} />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.productId.name}
        </Text>
        <Text style={styles.price}>₹{item.productId.sellingPrice}</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => handleAddToCart(item.productId)}
          >
            <Ionicons name="cart-outline" size={16} color="#fff" />
            <Text style={styles.cartText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wishlistBtn}
            onPress={() => handleRemove(item.productId._id)}
          >
            <Ionicons name="heart" size={18} color="#FF6F61" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading)
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: "center" }} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
      </View>

      {wishlist.length > 0 ? (
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: CARD_MARGIN }}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: CARD_MARGIN }}
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
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },

  card: {
    backgroundColor: "#fff",
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 4,
    marginBottom: CARD_MARGIN,
  },
  image: {
    width: "100%",
    height: IMAGE_HEIGHT,
    resizeMode: "cover",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  info: { padding: 8 },
  name: { fontSize: 13, fontWeight: "600", color: "#333" },
  price: { fontSize: 13, fontWeight: "bold", color: "#2e7d32", marginVertical: 4 },
  actions: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cartBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#A98C43",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  cartText: { color: "#fff", fontSize: 11, marginLeft: 4, fontWeight: "600" },
  wishlistBtn: { padding: 6 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 16, color: "#777", marginTop: 10 },
});
