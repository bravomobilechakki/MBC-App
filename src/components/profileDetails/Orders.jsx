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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(SummaryApi.getOrders.url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Something went wrong while fetching orders.");
        console.error(err);
      } finally {
        setLoading(false);
      }
      
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { backgroundColor: "#6f9b1f" };
      case "Processing":
        return { backgroundColor: "#c4a314" };
      case "Cancelled":
        return { backgroundColor: "#F44336" };
      default:
        return { backgroundColor: "#d3cdcd" };
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Product Image */}
      <Image
        source={
          item.items[0]?.product.images[0]
            ? { uri: item.items[0].product.images[0] }
            : require("../../images/facebook.png")
        }
        style={styles.image}
      />

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.product}>{item.items[0]?.product.name || 'Order'}</Text>
        <Text style={styles.date}>Ordered on {new Date(item.createdAt).toLocaleDateString()}</Text>
        <Text style={styles.amount}>₹{item.totalAmount}</Text>

        {/* Status */}
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      {/* Action */}
      <TouchableOpacity style={styles.iconBtn}>
        <Ionicons name="chevron-forward" size={22} color="#333" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
  }

  if (error) {
    return <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
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
        <Text style={{ textAlign: 'center', marginTop: 20 }}>You have no orders yet.</Text>
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
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  info: { flex: 1 },
  product: { fontSize: 16, fontWeight: "600", color: "#222" },
  date: { fontSize: 13, color: "#777", marginTop: 2 },
  amount: { fontSize: 14, fontWeight: "600", color: "#444", marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  iconBtn: { padding: 6 },
});
