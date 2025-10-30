import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  RefreshControl,
  Alert,
} from "react-native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/native";

// ----------------- Helpers -----------------
const truncate = (text, maxLength) =>
  text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

// ----------------- Animated Cart Item -----------------
const CartItem = ({
  item,
  selected,
  toggleSelect,
  increaseQty,
  decreaseQty,
  removeItem,
  index,
  navigation,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.item, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      <TouchableOpacity onPress={() => toggleSelect(item._id)}>
        <Ionicons
          name={selected ? "checkmark-circle" : "ellipse-outline"}
          size={26}
          color={selected ? "#047857" : "#999"}
          style={{ marginRight: 10 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("ProductDetails", { product: item.product })
        }
      >
        <Image
          source={
            item.product.images && item.product.images.length > 0
              ? { uri: item.product.images[0] }
              : { uri: "https://via.placeholder.com/80?text=No+Image" }
          }
          style={styles.image}
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.name}>{truncate(item.product.name, 14)}</Text>
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
        <MaterialCommunityIcons name="delete-outline" size={24} color="#ff4d4d" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ----------------- Main Cart Component -----------------
const Cart = () => {
  const { token } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showPriceDetails, setShowPriceDetails] = useState(true);
  const [animation] = useState(new Animated.Value(1));
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const navigation = useNavigation();

  // ----------------- API Calls -----------------
  const fetchCart = async () => {
    try {
      if (!token) return setLoading(false);
      const { data } = await axios.get(SummaryApi.getCart.url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCart(data.data.items);
        setSelectedItems(data.data.items.map((i) => i._id));
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch cart items.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const addItemToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await axios.post(
        SummaryApi.addToCart.url,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) fetchCart();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add item to cart.");
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(
        SummaryApi.updateCartItem(itemId).url,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) fetchCart();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update cart item.");
    }
  };

  const removeCartItem = async (itemId) => {
    try {
      const { data } = await axios.delete(
        SummaryApi.removeCartItem(itemId).url,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) fetchCart();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to remove item from cart.");
    }
  };

  const clearCart = async () => {
    Alert.alert("Clear Cart", "Are you sure you want to empty your cart?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const { data } = await axios.delete(SummaryApi.clearCart.url, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (data.success) fetchCart();
          } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to clear cart.");
          }
        },
      },
    ]);
  };

  useEffect(() => {
    fetchCart();
  }, [token]);

  // ----------------- Cart UI Actions -----------------
  const toggleSelect = (id) =>
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );

  const increaseQty = (id) => {
    const item = cart.find((i) => i._id === id);
    if (item) updateCartItem(id, item.quantity + 1);
  };

  const decreaseQty = (id) => {
    const item = cart.find((i) => i._id === id);
    if (item && item.quantity > 1) updateCartItem(id, item.quantity - 1);
  };

  const removeItem = (id) => removeCartItem(id);

  const getSubtotal = () =>
    cart
      .filter((item) => selectedItems.includes(item._id) && item.product)
      .reduce((total, item) => total + item.product.price * item.quantity, 0);

  const deliveryCharge = 0;
  const getTotal = () => Math.max(getSubtotal() + deliveryCharge - couponDiscount, 0);

  const applyCoupon = () => {
    Keyboard.dismiss();
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
    Animated.timing(animation, {
      toValue: showPriceDetails ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setShowPriceDetails(!showPriceDetails);
  };

  const animatedHeight = animation.interpolate({ inputRange: [0, 1], outputRange: [0, 200] });
  const animatedOpacity = animation.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  if (loading)
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchCart();
              }}
            />
          }
        >
          {cart.length === 0 ? (
            <Text style={styles.empty}>🛒 Your Cart is Empty</Text>
          ) : (
            <>
              {cart.map((item, index) => (
                item.product && (
                  <CartItem
                    key={item._id}
                    item={item}
                    selected={selectedItems.includes(item._id)}
                    toggleSelect={toggleSelect}
                    increaseQty={increaseQty}
                    decreaseQty={decreaseQty}
                    removeItem={removeItem}
                    index={index}
                    navigation={navigation}
                  />
                )
              ))}

              {/* Footer Section */}
              <View style={styles.footer}>
                <View style={styles.couponContainer}>
                  <Ionicons
                    name="gift-outline"
                    size={20}
                    color="#c5b25f"
                    style={{ marginRight: 6 }}
                  />
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
                  <Text
                    style={[
                      styles.couponMsg,
                      { color: couponMessage.startsWith("❌") ? "red" : "green" },
                    ]}
                  >
                    {couponMessage}
                  </Text>
                ) : null}

                <TouchableOpacity style={styles.priceHeader} onPress={togglePriceDetails}>
                  <Text style={styles.totalTitle}>💰 Price Details</Text>
                  <Ionicons
                    name={showPriceDetails ? "chevron-up" : "chevron-down"}
                    size={22}
                    color="#047857"
                  />
                </TouchableOpacity>

                <Animated.View
                  style={[
                    styles.priceDetailsContainer,
                    { height: animatedHeight, opacity: animatedOpacity, overflow: "hidden" },
                  ]}
                >
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
                  style={[
                    styles.checkoutBtn,
                    selectedItems.length === 0 && { backgroundColor: "#ccc" },
                  ]}
                  disabled={selectedItems.length === 0}
                  onPress={() =>
                    navigation.navigate("Address", {
                      selectedItems: cart.filter((i) => selectedItems.includes(i._id) && i.product),
                      totalAmount: getTotal(),
                    })
                  }
                >
                  <Ionicons
                    name="wallet-outline"
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.checkoutText}>Proceed to Address</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.clearCartBtn]} onPress={clearCart}>
                  <Text style={styles.clearCartText}>🗑️ Clear Cart</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingHorizontal: 8 },
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
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  empty: { fontSize: 16, fontWeight: "500", textAlign: "center", marginTop: 40, color: "#777" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 9,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: { width: 60, height: 60, borderRadius: 10, marginRight: 12, backgroundColor: "#f0f0f0" },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "600", color: "#222", marginBottom: 4 },
  price: { fontSize: 14, fontWeight: "700", color: "#2e7d32", marginBottom: 4 },
  quantityRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  qtyText: { fontSize: 14, fontWeight: "600", color: "#222", minWidth: 24, textAlign: "center" },
  footer: { padding: 14, borderTopWidth: 1, borderColor: "#eee", backgroundColor: "#fff", borderRadius: 12, marginTop: 10 },
  couponContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff8e1", borderRadius: 8, paddingHorizontal: 10, marginBottom: 10 },
  couponInput: { flex: 1, height: 40, fontSize: 14, color: "#333" },
  applyBtn: { backgroundColor: "#c5b25f", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  applyText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  couponMsg: { marginBottom: 8, fontSize: 13, fontWeight: "500" },
  priceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  totalTitle: { fontSize: 16, fontWeight: "700", color: "#222" },
  priceDetailsContainer: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 4 },
  grandTotalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#ddd" },
  grandTotalLabel: { fontSize: 16, fontWeight: "700", color: "#222" },
  grandTotalAmount: { fontSize: 16, fontWeight: "700", color: "#2e7d32" },
  label: { fontSize: 14, color: "#555", flex: 1 },
  value: { fontSize: 14, fontWeight: "600", color: "#222" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 6 },
  checkoutBtn: { flexDirection: "row", justifyContent: "center", alignItems: "center", backgroundColor: "#2e7d32", paddingVertical: 14, borderRadius: 12, marginTop: 8 },
  checkoutText: { color: "#fff", fontSize: 16, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  clearCartBtn: { marginTop: 10, backgroundColor: "#ff4d4d", padding: 12, borderRadius: 12, alignItems: "center" },
  clearCartText: { color: "#fff", fontWeight: "600", fontSize: 14 },
});

export default Cart;
