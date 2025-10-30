import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

const Payment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token, user } = useContext(UserContext);
  const { selectedItems, totalAmount, address } = route.params;

  const [selectedPayment, setSelectedPayment] = useState("COD"); // Default COD

  const handlePlaceOrder = async () => {
    try {
      if (!token || !user) {
        console.log("⚠️ Login Required: Please login before placing an order.");
        return;
      }

      const orderPayload = {
        user: user._id,
        orderItems: selectedItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images[0],
        })),
        shippingAddress: {
          street: address?.street,
          city: address?.city,
          state: address?.state,
          zipCode: address?.zipCode,
          country: "India",
          isDefault: true,
        },
        paymentMethod: selectedPayment,
        paymentInfo: {
          id: selectedPayment === "COD" ? "COD-PAYMENT" : "ONLINE-PAYMENT",
          status: selectedPayment === "COD" ? "Pending" : "Paid",
        },
        itemsPrice: totalAmount,
        taxPrice: Math.round(totalAmount * 0.05),
        shippingPrice: 0,
        totalPrice: totalAmount + Math.round(totalAmount * 0.05),
      };

      console.log("📦 Creating Order:", orderPayload);

      const response = await axios.post(SummaryApi.createOrder.url, orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        console.log("✅ Order successfully placed:", response.data);
        // ✅ Navigate directly to OrderDoneAnimated with order details
        navigation.navigate("OrderDone", {
          order: response.data.data, // pass created order data
          paymentMethod: selectedPayment,
        });
      } else {
        console.log("❌ Order placement failed:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Error creating order:", error.response?.data || error.message);
    }
  };

  const PaymentOption = ({ title, subtitle, iconName, method }) => (
    <TouchableOpacity
      style={[
        styles.paymentOption,
        selectedPayment === method && {
          borderColor: "#047857",
          backgroundColor: "#ECFDF5",
        },
      ]}
      onPress={() => setSelectedPayment(method)}
    >
      <Ionicons
        name={iconName}
        size={28}
        color={selectedPayment === method ? "#047857" : "#333"}
      />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text
          style={[
            styles.paymentTitle,
            selectedPayment === method && { color: "#047857" },
          ]}
        >
          {title}
        </Text>
        {subtitle && <Text style={styles.paymentSubtitle}>{subtitle}</Text>}
      </View>
      {selectedPayment === method && (
        <Ionicons name="checkmark-circle" size={24} color="#047857" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>💳 Payment Options</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Order Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>🧾 Order Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Items Total</Text>
            <Text style={styles.value}>₹{totalAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax (5%)</Text>
            <Text style={styles.value}>₹{Math.round(totalAmount * 0.05)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, styles.totalLabel]}>Grand Total</Text>
            <Text style={[styles.value, styles.totalValue]}>
              ₹{totalAmount + Math.round(totalAmount * 0.05)}
            </Text>
          </View>
        </View>

        {/* Payment Options */}
        <PaymentOption
          title="Cash on Delivery"
          subtitle="Pay when your order is delivered"
          iconName="cash-outline"
          method="COD"
        />
        <PaymentOption
          title="UPI / PhonePe / Google Pay"
          subtitle="Secure payment via UPI apps"
          iconName="wallet-outline"
          method="UPI"
        />
        <PaymentOption
          title="Credit / Debit Card"
          subtitle="Visa, Mastercard, Rupay accepted"
          iconName="card-outline"
          method="CARD"
        />
        <PaymentOption
          title="Net Banking"
          subtitle="Pay using your bank account"
          iconName="business-outline"
          method="NETBANKING"
        />
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payBtn} onPress={handlePlaceOrder}>
          <Text style={styles.payText}>
            Place Order (₹{totalAmount + Math.round(totalAmount * 0.05)})
          </Text>
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
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
    marginRight: 24,
    textAlign: "center",
  },
  summary: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#444",
  },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  label: { fontSize: 14, color: "#555" },
  value: { fontSize: 14, color: "#222" },
  totalLabel: { fontWeight: "700" },
  totalValue: { fontWeight: "700", fontSize: 16, color: "#000" },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  paymentTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  paymentSubtitle: { fontSize: 13, color: "#555", marginTop: 2 },
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
  payBtn: {
    backgroundColor: "#047857",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
