import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

const OrderDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params || {};
  const { token } = useContext(UserContext);

  const [orderDetails, setOrderDetails] = useState(order);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch order details if only orderId is passed
  useEffect(() => {
    if (!order && route.params?.orderId) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `${SummaryApi.getOrderDetails.url}/${route.params.orderId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (response.data.success) {
            setOrderDetails(response.data.data);
          } else {
            setError(response.data.message || "Failed to fetch order details");
          }
        } catch (err) {
          setError("Something went wrong while fetching order details.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [order, route.params?.orderId, token]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Order details not found.</Text>
      </View>
    );
  }

  const {
    _id,
    orderItems = [],
    totalAmount: apiTotal,
    shippingAddress,
    paymentMethod,
    createdAt,
    status,
  } = orderDetails;

  // ✅ Compute total from items if API didn't provide it
  const totalAmount =
    apiTotal ||
    orderItems.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );

  const statusSteps = ["Processing", "Shipped", "Delivered"];
  const activeStep = statusSteps.indexOf(status);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.value}>{_id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>
              {new Date(createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, { color: "#2e7d32" }]}>{status}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>₹{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Order Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Progress</Text>
          <View style={styles.progressContainer}>
            {statusSteps.map((step, index) => (
              <View key={step} style={styles.stepContainer}>
                <View
                  style={[
                    styles.circle,
                    index <= activeStep && styles.circleActive,
                  ]}
                >
                  <Ionicons
                    name={
                      index < activeStep
                        ? "checkmark"
                        : index === activeStep
                        ? "ellipse"
                        : "ellipse-outline"
                    }
                    size={16}
                    color="#fff"
                  />
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    index <= activeStep && styles.stepLabelActive,
                  ]}
                >
                  {step}
                </Text>
                {index < statusSteps.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      index < activeStep && styles.lineActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Ordered Products */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ordered Products</Text>
          {orderItems.map((item) => (
            <View key={item._id} style={styles.productCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text
                  style={styles.productName}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <Text style={styles.productQtyPrice}>
                  Qty: {item.quantity} × ₹{item.price}
                </Text>
                <Text style={styles.productTotal}>
                  ₹{(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        {shippingAddress && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shipping Address</Text>
            <Text style={styles.addressText}>{shippingAddress.street}</Text>
            <Text style={styles.addressText}>
              {shippingAddress.city}, {shippingAddress.state} -{" "}
              {shippingAddress.zipCode}
            </Text>
            <Text style={styles.addressText}>{shippingAddress.country}</Text>
          </View>
        )}

     {/* Payment Info */}
{paymentMethod && (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Payment Method</Text>

    <View style={styles.paymentRow}>
      <Ionicons
        name={
          paymentMethod.toLowerCase().includes("upi")
            ? "logo-google"
            : paymentMethod.toLowerCase().includes("card")
            ? "card-outline"
            : paymentMethod.toLowerCase().includes("cash")
            ? "cash-outline"
            : "wallet-outline"
        }
        size={22}
        color="#2e7d32"
        style={{ marginRight: 8 }}
      />

      <Text style={styles.paymentText}>
        {paymentMethod.toLowerCase().includes("upi")
          ? "💸 UPI Payment"
          : paymentMethod.toLowerCase().includes("card")
          ? "💳 Card Payment"
          : paymentMethod.toLowerCase().includes("cash")
          ? "💵 Cash on Delivery"
          : "💰 Other Method"}
      </Text>
    </View>
  </View>
)}


        {/* Action Buttons */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              Alert.alert("Track Order", "Tracking feature coming soon!")
            }
          >
            <Text style={styles.actionButtonText}>Track Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 16,
    color: "#333",
  },
  scrollContent: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 16, color: "red" },

  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: { fontSize: 15, color: "#555" },
  value: { fontSize: 15, fontWeight: "600", color: "#333" },

  productCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productImage: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  productInfo: { flex: 1 },
  productName: { fontSize: 15, fontWeight: "600", color: "#333" },
  productQtyPrice: { fontSize: 13, color: "#777", marginTop: 2 },
  productTotal: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2e7d32",
    marginTop: 5,
  },

  addressText: { fontSize: 15, color: "#555", lineHeight: 22 },
  paymentText: { fontSize: 15, color: "#555" },

  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  stepContainer: { alignItems: "center", flex: 1, position: "relative" },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  circleActive: { backgroundColor: "#2e7d32" },
  stepLabel: { fontSize: 12, color: "#777", marginTop: 5 },
  stepLabelActive: { color: "#2e7d32", fontWeight: "bold" },
  line: {
    position: "absolute",
    height: 3,
    width: "100%",
    backgroundColor: "#ccc",
    top: 12,
    zIndex: -1,
  },
  lineActive: { backgroundColor: "#2e7d32" },

  actionButton: {
    backgroundColor: "#2e7d32",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  paymentRow: {
  flexDirection: "row",
  alignItems: "center",
},
paymentText: {
  fontSize: 15,
  color: "#555",
  fontWeight: "600",
},

});
