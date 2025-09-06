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

const Orders = () => {
  const navigation = useNavigation();

  const [orders] = useState([
    {
      id: "1",
      product: "Haldi",
      image: require("../../images/flour.png"), // ✅ local
      status: "Delivered",
      date: "02 Sep 2025",
      amount: "₹2,499",
    },
    {
      id: "2",
      product: "Haldi",
      image: require("../../images/flour.png"),
      status: "Processing",
      date: "02 Sep 2025",
      amount: "₹2,499",
    },
    {
      id: "3",
      product: "Haldi",
      image: require("../../images/flour.png"),
      status: "Cancelled",
      date: "02 Sep 2025",
      amount: "₹2,499",
    },
  ]);

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
          typeof item.image === "string" ? { uri: item.image } : item.image
        }
        style={styles.image}
      />

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.product}>{item.product}</Text>
        <Text style={styles.date}>Ordered on {item.date}</Text>
        <Text style={styles.amount}>{item.amount}</Text>

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
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
