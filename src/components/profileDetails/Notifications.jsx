import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Notifications = () => {
  const navigation = useNavigation();

  const notifications = [
    {
      id: 1,
      title: "Order Shipped 🚚",
      message: "Your order #1234 has been shipped and is on the way.",
      time: "2h ago",
      icon: "cube-outline",
    },
    {
      id: 2,
      title: "Limited Time Offer 🎉",
      message: "Get 20% off on your next purchase. Use code SAVE20.",
      time: "6h ago",
      icon: "pricetag-outline",
    },
    {
      id: 3,
      title: "Order Delivered ✅",
      message: "Your order #1228 was delivered successfully.",
      time: "1d ago",
      icon: "checkmark-done-outline",
    },
    {
      id: 4,
      title: "New Product Launch 🔥",
      message: "Check out our latest arrivals in the electronics section.",
      time: "2d ago",
      icon: "flash-outline",
    },
  ];

  return (
    <View style={styles.container}>
      {/* ✅ Header with Back Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {notifications.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card}>
            <Ionicons
              name={item.icon}
              size={26}
              color="#007bff"
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.message}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginLeft: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    alignItems: "flex-start",
    elevation: 2,
  },
  title: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 2 },
  message: { fontSize: 13, color: "#555" },
  time: { fontSize: 12, color: "#888", marginTop: 4 },
});
