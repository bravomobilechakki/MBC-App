import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Cart = () => {
  const { token } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const navigation = useNavigation();

  // Fetch cart and select all items by default
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

        // Select all items by default
        const allIds = response.data.data.items.map((item) => item._id);
        setSelectedItems(allIds);
      }
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
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
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const getSubtotal = () => {
    return cart
      .filter((item) => selectedItems.includes(item._id))
      .reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const deliveryCharge = 40;
  const discount = 50;

  const getTotal = () => {
    const subtotal = getSubtotal();
    return Math.max(subtotal + deliveryCharge - discount, 0);
  };

  const togglePriceDetails = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPriceDetails(!showPriceDetails);
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cart.length === 0 ? (
        <Text style={styles.empty}>🛒 Your Cart is Empty</Text>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                {/* Checkbox */}
                <TouchableOpacity onPress={() => toggleSelect(item._id)}>
                  <Ionicons
                    name={
                      selectedItems.includes(item._id)
                        ? "checkbox-outline"
                        : "square-outline"
                    }
                    size={24}
                    color="#c5b25fff"
                    style={{ marginRight: 8 }}
                  />
                </TouchableOpacity>

                {/* Product Image */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ProductDetails", { product: item.product })
                  }
                >
                  <Image
                    source={
                      item.product.image
                        ? { uri: item.product.image }
                        : { uri: "https://via.placeholder.com/80?text=No+Image" }
                    }
                    style={styles.image}
                  />
                </TouchableOpacity>

                {/* Product Info */}
                <View style={styles.info}>
                  <Text style={styles.name}>{item.product.name}</Text>
                  <Text style={styles.price}>₹{item.product.price}</Text>

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

                <TouchableOpacity onPress={() => removeItem(item._id)}>
                  <Ionicons name="trash" size={22} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Footer Section */}
          <View style={styles.footer}>
            {/* Expandable Price Details */}
            <TouchableOpacity style={styles.priceHeader} onPress={togglePriceDetails}>
              <Text style={styles.totalTitle}>Price Details</Text>
              <Ionicons
                name={showPriceDetails ? "chevron-up" : "chevron-down"}
                size={22}
                color="#444"
              />
            </TouchableOpacity>

            {showPriceDetails && (
              <View style={styles.priceDetailsContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.label}>Subtotal</Text>
                  <Text style={styles.value}>₹{getSubtotal()}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.label}>Delivery Charge</Text>
                  <Text style={styles.value}>₹{deliveryCharge}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.label}>Discount</Text>
                  <Text style={[styles.value, { color: "green" }]}>-₹{discount}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>Grand Total</Text>
                  <Text style={styles.grandTotalAmount}>₹{getTotal()}</Text>
                </View>
              </View>
            )}

            {/* Checkout Button */}
            <TouchableOpacity
              style={[
                styles.checkoutBtn,
                selectedItems.length === 0 && { backgroundColor: "#ccc" },
              ]}
              disabled={selectedItems.length === 0}
              onPress={() =>
                navigation.navigate("Address", {
                  selectedItems: cart.filter((i) => selectedItems.includes(i._id)),
                  totalAmount: getTotal(),
                })
              }
            >
              <Text style={styles.checkoutText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 12 },
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
  empty: { fontSize: 18, fontWeight: "600", textAlign: "center", marginTop: 50, color: "#666" },
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
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 12, backgroundColor: "#f0f0f0" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 4 },
  price: { fontSize: 15, fontWeight: "bold", color: "#2e7d32", marginBottom: 6 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  qtyBtn: { backgroundColor: "#c5b25fff", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginHorizontal: 5 },
  qtyText: { fontSize: 16, fontWeight: "600", color: "#333", minWidth: 24, textAlign: "center" },
  footer: { padding: 16, borderTopWidth: 1, borderColor: "#eee", backgroundColor: "#fff" },
  priceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  totalTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  priceDetailsContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  priceRow: 
  { flexDirection: "row",
     justifyContent: "space-between", 
     marginVertical: 4 },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  grandTotalLabel: { fontSize: 18, fontWeight: "700", color: "#333" },
  grandTotalAmount: { fontSize: 18, fontWeight: "700", color: "#ff4d4d" },
  label: { fontSize: 15, color: "#555" },
  value: { fontSize: 15, fontWeight: "600", color: "#222" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 6 },
  checkoutBtn: { backgroundColor: "#ff4d4d", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
});

export default Cart;
