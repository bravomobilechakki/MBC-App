import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

const Orders = () => {
  const navigation = useNavigation();
  const { token } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(SummaryApi.getOrders.url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          // ✅ Sort orders (latest first)
          const sortedOrders = response.data.data.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.orderDate || 0);
            const dateB = new Date(b.createdAt || b.orderDate || 0);
            return dateB - dateA;
          });
          setOrders(sortedOrders);
        } else {
          setError(response.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Something went wrong while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  // ✅ Status color helper
  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { color: "#2e7d32" };
      case "Processing":
        return { color: "#c4a314" };
      case "Cancelled":
        return { color: "#F44336" };
      default:
        return { color: "#777" };
    }
  };

  // ✅ Navigate based on status
  const handlePress = (item) => {
    if (item.status === "Delivered") {
      navigation.navigate("OrderDone", { order: item }); // ✅ fixed name + payload
    } else {
      navigation.navigate("OrderDetails", { order: item }); // ✅ passes data
    }
  };

  // ✅ Render each order card
  const renderItem = ({ item }) => {
    const totalAmount =
      item.totalAmount ||
      item.orderItems.reduce(
        (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
        0
      );

    return (
      <TouchableOpacity style={styles.card} onPress={() => handlePress(item)}>
        {/* Product Image */}
        <Image
          source={
            item.orderItems[0]?.image
              ? { uri: item.orderItems[0].image }
              : { uri: "https://via.placeholder.com/80?text=No+Image" }
          }
          style={styles.image}
        />

        {/* Order Info */}
        <View style={styles.info}>
          <Text style={styles.product} numberOfLines={1} ellipsizeMode="tail">
            {item.orderItems[0]?.name || "Order"}
          </Text>
          <Text style={styles.quantity}>
            📦 Quantity: {item.orderItems[0]?.quantity || 1}
          </Text>
          <Text style={styles.amount}>💰 Total: ₹{totalAmount}</Text>
    
        </View>

        <Ionicons name="chevron-forward" size={22} color="#333" />
      </TouchableOpacity>
    );
  };

  // ✅ Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ marginTop: 8 }}>Fetching your orders...</Text>
      </View>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={26} color="red" />
        <Text style={{ color: "red", marginTop: 6 }}>{error}</Text>
      </View>
    );
  }

  // ✅ Main UI
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>🛍️ My Orders</Text>
      </View>

      {/* Orders List */}
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <View style={styles.center}>
          <Ionicons name="cart-outline" size={48} color="#aaa" />
          <Text style={{ textAlign: "center", marginTop: 10 }}>
            You have no orders yet.
          </Text>
        </View>
      )}
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: "#333",
    textAlign: "center",
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
  product: { fontSize: 14, fontWeight: "600", color: "#222" },
  quantity: { fontSize: 13, color: "#777", marginTop: 2, fontWeight: "500" },
  amount: { fontSize: 15, fontWeight: "600", color: "#2e7d32", marginTop: 8 },
  status: { fontSize: 14, marginTop: 4, fontWeight: "500" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
