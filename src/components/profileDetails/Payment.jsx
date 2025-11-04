import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

const Payment = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token, user } = useContext(UserContext);

  // ✅ Safe fallback for route params
  const { selectedItems = [], totalAmount = 0 } = route.params || {};

  const [selectedPayment, setSelectedPayment] = useState("COD");

  const handlePlaceOrder = async () => {
    try {
      if (!token || !user) {
        Alert.alert("Login Required", "Please login before placing an order.");
        return;
      }

      if (selectedItems.length === 0) {
        Alert.alert("No Items", "Your cart is empty.");
        return;
      }

      const tax = Math.round(totalAmount * 0.05);

      const orderPayload = {
        user: user._id,
        orderItems: selectedItems.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          image: item.product.images?.[0],
        })),
        shippingAddress: {
          street: user?.address?.street || "Default Street",
          city: user?.address?.city || "Your City",
          state: user?.address?.state || "Your State",
          zipCode: user?.address?.zipCode || "000000",
          country: "India",
          isDefault: true,
        },
        paymentMethod: selectedPayment,
        paymentInfo: {
          id: selectedPayment === "COD" ? "COD-PAYMENT" : "ONLINE-PAYMENT",
          status: selectedPayment === "COD" ? "Pending" : "Paid",
        },
        itemsPrice: totalAmount,
        taxPrice: tax,
        shippingPrice: 0,
        totalPrice: totalAmount + tax,
      };

      console.log("📦 Creating Order:", orderPayload);

      const response = await axios.post(SummaryApi.createOrder.url, orderPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        console.log("✅ Order successfully placed:", response.data);
        await axios.delete(SummaryApi.clearCart.url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigation.navigate("OrderDone", {
          order: response.data.data,
          paymentMethod: selectedPayment,
        });
      } else {
        Alert.alert("Order Failed", response.data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("❌ Error creating order:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to place order. Please try again later.");
    }
  };

  const PaymentOption = ({ title, subtitle, iconName, method }) => (
    <TouchableOpacity
      style={[
        styles.paymentOption,
        selectedPayment === method && {
          borderColor: "#047857",
          backgroundColor: "#FFF1F1",
        },
      ]}
      onPress={() => setSelectedPayment(method)}
    >
      <Ionicons
        name={iconName}
        size={28}
        color={selectedPayment === method ? "#047857" : "#555"}
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

  const grandTotal = totalAmount + Math.round(totalAmount * 0.05);

  return (
    <LinearGradient colors={["#fff", "#ffe6e6", "#fff0f0"]} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={26} color="#047857" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Options</Text>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
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
            <View style={styles.divider} />
            <View style={[styles.row, { marginTop: 6 }]}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal}</Text>
            </View>
          </View>

          {/* Payment Options */}
          <Text style={styles.sectionTitle}>💳 Select Payment Method</Text>

          <PaymentOption
            title="Cash on Delivery"
            subtitle="Pay when your order is delivered"
            iconName="cash-outline"
            method="COD"
          />
          <PaymentOption
            title="UPI / Google Pay / PhonePe"
            subtitle="Instant secure payment via UPI apps"
            iconName="wallet-outline"
            method="UPI"
          />
          <PaymentOption
            title="Credit / Debit Card"
            subtitle="Visa, Mastercard, Rupay supported"
            iconName="card-outline"
            method="CARD"
          />
          <PaymentOption
            title="Net Banking"
            subtitle="Pay directly from your bank"
            iconName="business-outline"
            method="NETBANKING"
          />
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <LinearGradient
            colors={["#047857", "#047857"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <TouchableOpacity style={styles.payBtn} onPress={handlePlaceOrder}>
              <Text style={styles.payText}>
                Place Order (₹{grandTotal})
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Payment;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#047857",
    textAlign: "center",
    marginRight: 24,
  },
  summary: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    elevation: 3,
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 16, fontWeight: "700", color: "#444", marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 14, color: "#555" },
  value: { fontSize: 14, color: "#222" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 6 },
  totalLabel: { fontSize: 15, fontWeight: "700", color: "#111" },
  totalValue: { fontSize: 16, fontWeight: "700", color: "#047857" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
    marginTop: 10,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
  },
  paymentTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  paymentSubtitle: { fontSize: 12, color: "#777", marginTop: 2 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  gradientBtn: {
    borderRadius: 10,
    overflow: "hidden",
  },
  payBtn: {
    paddingVertical: 14,
    alignItems: "center",
  },
  payText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
