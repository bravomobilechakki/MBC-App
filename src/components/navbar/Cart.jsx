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

const Cart = () => {
  const { token } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
  }

  return (
    <View style={styles.container}>
      {cart.length === 0 ? (
        <Text style={styles.empty}>🛒 Your Cart is Empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.item}>
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
              </View>
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
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  empty: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginTop: 50 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 2,
  },
  image: { width: 70, height: 70, borderRadius: 10, marginRight: 10 },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 14, color: "green", marginVertical: 4 },
  quantityRow: { flexDirection: "row", alignItems: "center" },
  qtyBtn: {
    backgroundColor: "#007bff",
    padding: 6,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  qtyText: { fontSize: 16, fontWeight: "bold" },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  total: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  checkoutBtn: {
    backgroundColor: "#28a745",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default Cart;
