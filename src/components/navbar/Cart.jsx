import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  TextInput,
  Platform,
  UIManager,
} from "react-native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Cart = () => {
  const { token } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showPriceDetails, setShowPriceDetails] = useState(true);
  const [animation] = useState(new Animated.Value(1));
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const navigation = useNavigation();

  // Fetch Cart Items
  const fetchCart = async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get(SummaryApi.getCart.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCart(response.data.data.items);
        setSelectedItems(response.data.data.items.map(item => item._id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(item => item._id === id ? { ...item, quantity: item.quantity + 1 } : item)
    );
  };

  const decreaseQty = (id) => {
    setCart(prev =>
      prev.map(item => item._id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item._id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
  };

  const getSubtotal = () => {
    return cart
      .filter(item => selectedItems.includes(item._id))
      .reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const deliveryCharge = 0; // Free delivery

  const getTotal = () => {
    const subtotal = getSubtotal();
    return Math.max(subtotal + deliveryCharge - couponDiscount, 0);
  };

  // Coupon Apply Logic
  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponMessage("Please enter a coupon code.");
      setCouponDiscount(0);
      return;
    }
    if (code === "SAVE50") {
      setCouponDiscount(50);
      setCouponMessage("🎉 Coupon applied! You saved ₹50.");
    } else if (code === "DISCOUNT10") {
      const tenPercent = Math.min(Math.round(getSubtotal() * 0.1), 100);
      setCouponDiscount(tenPercent);
      setCouponMessage(`🎉 10% off applied! You saved ₹${tenPercent}.`);
    } else {
      setCouponDiscount(0);
      setCouponMessage("❌ Invalid coupon code.");
    }
  };

  const togglePriceDetails = () => {
    const toValue = showPriceDetails ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
    setShowPriceDetails(!showPriceDetails);
  };

  const animatedHeight = animation.interpolate({ inputRange: [0,1], outputRange: [0,200] });
  const animatedOpacity = animation.interpolate({ inputRange: [0,1], outputRange: [0,1] });

  useEffect(() => {
    fetchCart();
  }, [token]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
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
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <TouchableOpacity onPress={() => toggleSelect(item._id)}>
                  <Ionicons
                    name={selectedItems.includes(item._id) ? "checkmark-circle" : "ellipse-outline"}
                    size={26} color={selectedItems.includes(item._id) ? "#047857" : "#999"}
                    style={{ marginRight: 10 }}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate("ProductDetails", { product: item.product })}
                >
                  <Image
                    source={item.product.image ? { uri: item.product.image } : { uri: "https://via.placeholder.com/80?text=No+Image" }}
                    style={styles.image}
                  />
                </TouchableOpacity>

                <View style={styles.info}>
                  <Text style={styles.name}>{item.product.name}</Text>
                  <Text style={styles.price}>₹{item.product.price}</Text>

                  <View style={styles.quantityRow}>
                    <TouchableOpacity onPress={() => decreaseQty(item._id)}>
                      <Ionicons name="remove-circle-outline" size={22} color="#ff4d4d" />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => increaseQty(item._id)}>
                      <Ionicons name="add-circle-outline" size={22} color="#047857" />
                    </TouchableOpacity>
                  </View>
                </View>

              <TouchableOpacity onPress={() => removeItem(item._id)}>
              <MaterialCommunityIcons name="delete-outline" size={24} color="#ff4d4d"/>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Footer */}
          <View style={styles.footer}>
            {/* Coupon Section */}
            <View style={styles.couponContainer}>
              <Ionicons name="gift-outline" size={20} color="#c5b25f" style={{ marginRight: 6 }} />
              <TextInput
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChangeText={setCouponCode}
                style={styles.couponInput}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.applyBtn} onPress={applyCoupon}>
                <Text style={styles.applyText}>Apply</Text>
              </TouchableOpacity>
            </View>
            {couponMessage ? (
              <Text style={[styles.couponMsg, { color: couponMessage.startsWith("❌") ? "red" : "green" }]}>
                {couponMessage}
              </Text>
            ) : null}

            {/* Price Details */}
            <TouchableOpacity style={styles.priceHeader} onPress={togglePriceDetails}>
              <Text style={styles.totalTitle}>💰Price Details</Text>
              <Ionicons name={showPriceDetails ? "chevron-up" : "chevron-down"} size={22} color="#047857" />
            </TouchableOpacity>

            <Animated.View style={[styles.priceDetailsContainer, { height: animatedHeight, opacity: animatedOpacity, overflow: "hidden" }]}>
              <View style={{ paddingHorizontal: 5 }}>
                <View style={styles.priceRow}>
                  <Text style={styles.label}>Subtotal</Text>
                  <Text style={styles.value}>₹{getSubtotal()}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.label}>Delivery</Text>
                  <Text style={[styles.value, { color: "green" }]}>Free</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.label}>Coupon Discount</Text>
                  <Text style={[styles.value, { color: "green" }]}>-₹{couponDiscount}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.grandTotalRow}>
                  <Text style={styles.grandTotalLabel}>Grand Total</Text>
                  <Text style={styles.grandTotalAmount}>₹{getTotal()}</Text>
                </View>
              </View>
            </Animated.View>

            <TouchableOpacity
              style={[styles.checkoutBtn, selectedItems.length === 0 && { backgroundColor: "#ccc" }]}
              disabled={selectedItems.length === 0}
              onPress={() =>
                navigation.navigate("Address", { selectedItems: cart.filter(i => selectedItems.includes(i._id)), totalAmount: getTotal() })
              }
            >
              <Ionicons name="wallet-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
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
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#fff", paddingVertical: 14, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: "#eee", marginBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111", fontFamily: "Poppins-SemiBold" },
  empty: { fontSize: 18, fontWeight: "500", textAlign: "center", marginTop: 50, color: "#777", fontFamily: "Poppins-Regular" },
  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 14, marginVertical: 6, borderRadius: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  image: { width: 80, height: 80, borderRadius: 10, marginRight: 12, backgroundColor: "#f0f0f0" },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#222", marginBottom: 4, fontFamily: "Poppins-Medium" },
  price: { fontSize: 15, fontWeight: "700", color: "#2e7d32", marginBottom: 6, fontFamily: "Poppins-SemiBold" },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  qtyBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginHorizontal: 5 },
  qtyText: { fontSize: 16, fontWeight: "600", color: "#222", minWidth: 24, textAlign: "center", fontFamily: "Poppins-Medium" },
  footer: { padding: 16, borderTopWidth: 1, borderColor: "#eee", backgroundColor: "#fff" },
  couponContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff8e1", borderRadius: 8, paddingHorizontal: 10, marginBottom: 8 },
  couponInput: { flex: 1, height: 42, fontSize: 15, color: "#333", fontFamily: "Poppins-Regular" },
  applyBtn: { backgroundColor: "#c5b25fff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  applyText: { color: "#fff", fontWeight: "600", fontFamily: "Poppins-SemiBold" },
  couponMsg: { marginBottom: 8, fontSize: 14, fontWeight: "500", fontFamily: "Poppins-Regular" },
  priceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  totalTitle: { fontSize: 18, fontWeight: "700", color: "#222", fontFamily: "Poppins-SemiBold" },
  priceDetailsContainer: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#ddd" },
  grandTotalLabel: { fontSize: 18, fontWeight: "700", color: "#222", fontFamily: "Poppins-SemiBold" },
  grandTotalAmount: { fontSize: 18, fontWeight: "700", color: "#2e7d32", fontFamily: "Poppins-Bold" },
  label: { fontSize: 15, color: "#555", flex: 1, fontFamily: "Poppins-Regular" },
  value: { fontSize: 15, fontWeight: "600", color: "#222", fontFamily: "Poppins-Medium" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 6 },
  checkoutBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#2e7d32", paddingVertical: 14, borderRadius: 10 },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5, fontFamily: "Poppins-SemiBold" },
});


export default Cart;
