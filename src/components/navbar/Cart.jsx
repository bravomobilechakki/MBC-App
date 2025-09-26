import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Cart = () => {
  const { token } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchCart = async () => {
    try {
      if (!token) {
        console.warn("⚠️ No token found. Please login.");
        setLoading(false);
        return;
      }

      const response = await axios.get(SummaryApi.getCart.url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCart(response.data.data.items);
      }
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const getTotal = () => {
    return cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, justifyContent: "center" }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* 🔙 Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 24 }} /> {/* Spacer for alignment */}
      </View>

      {cart.length === 0 ? (
        <Text style={styles.empty}>🛒 Your Cart is Empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  navigation.navigate("ProductDetails", {
                    product: item.product,
                  })
                }
              >
                {/* Product Image */}
                <Image
                  source={{ uri: item.product.image }}
                  style={styles.image}
                />

                {/* Product Info */}
                <View style={styles.info}>
                  <Text style={styles.name}>{item.product.name}</Text>
                  <Text style={styles.price}>₹{item.product.price}</Text>

                  {/* Quantity Controls */}
                  <View style={styles.quantityRow}>
                    <TouchableOpacity
                      onPress={() => decreaseQty(item._id)}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="remove" size={18} color="#fff" />
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => increaseQty(item._id)}
                      style={styles.qtyBtn}
                    >
                      <Ionicons name="add" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Remove Button */}
                <TouchableOpacity onPress={() => removeItem(item._id)}>
                  <Ionicons name="trash" size={22} color="red" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />

          {/* Cart Total */}
          <View style={styles.footer}>
            <Text style={styles.total}>Total: ₹{getTotal()}</Text>
            <TouchableOpacity style={styles.checkoutBtn}>
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingTop: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },

  empty: { 
    fontSize: 18, 
    fontWeight: "600", 
    textAlign: "center", 
    marginTop: 50, 
    color: "#666" 
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },

  image: { 
    width: 80, 
    height: 80, 
    borderRadius: 10, 
    marginRight: 12, 
    backgroundColor: "#f0f0f0" 
  },

  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "bold", color: "#2e7d32", marginBottom: 6 },

  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  qtyBtn: {
    backgroundColor: "#c5b25fff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  qtyText: { fontSize: 16, fontWeight: "600", color: "#333", minWidth: 24, textAlign: "center" },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  total: { fontSize: 18, fontWeight: "700", color: "#222", marginBottom: 12 },
  checkoutBtn: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
});

export default Cart;
