import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

const Payment = () => {
  const [selected, setSelected] = useState("UPI");
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = useContext(UserContext);
  const { selectedItems, totalAmount, address } = route.params;

  const methods = [
    { id: "UPI", label: "UPI / Wallets", icon: "logo-google" },
    { id: "CARD", label: "Credit / Debit Card", icon: "card-outline" },
    { id: "NETBANKING", label: "Netbanking", icon: "laptop-outline" },
    { id: "COD", label: "Cash on Delivery", icon: "cash-outline" },
  ];

  const handlePayment = async () => {
    try {
      const orderPayload = {
        address,
        items: selectedItems,
        totalAmount,
        paymentMethod: selected,
      };

      const response = await axios.post(SummaryApi.createOrder.url, orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        navigation.navigate("orderdone");
      } else {
        Alert.alert("Error", "Failed to create order.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Error", "Something went wrong while creating the order.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text style={[styles.label, { fontWeight: "600" }]}>Grand Total</Text>
            <Text style={[styles.value, { fontWeight: "600" }]}>₹{totalAmount}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.method,
              selected === method.id && {
                borderColor: "#d47e85ff",
                backgroundColor: "#eef5ff",
              },
            ]}
            onPress={() => setSelected(method.id)}
          >
            <View style={styles.methodRow}>
              <Ionicons
                name={method.icon}
                size={22}
                color="#333"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.methodText}>{method.label}</Text>
            </View>
            {selected === method.id && (
              <Ionicons name="checkmark-circle" size={22} color="#914747ff" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePayment}>
          <Text style={styles.payText}>Pay ₹{totalAmount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerTitle: { 
    flex: 1, 
    fontSize: 20, 
    fontWeight: "500", 
    color: "#333", 
    marginLeft: 10, 
    marginRight: 24 
  },
  summary: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#444" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontSize: 14, color: "#555" },
  value: { fontSize: 14, color: "#222" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#444" },
  method: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  methodRow: { flexDirection: "row", alignItems: "center" },
  methodText: { fontSize: 15, color: "#222" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  payBtn: { backgroundColor: "#860f33ff", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  payText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
