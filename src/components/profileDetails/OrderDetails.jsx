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
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OrderDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { order } = route.params || {};
  const { token } = useContext(UserContext);

  const [orderDetails, setOrderDetails] = useState(order);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, []);

  // Fetch order details if needed
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
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [order, route.params?.orderId, token]);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6A1B9A" />
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );

  // SAFE DESTRUCTURE (prevents map undefined)
  const {
    _id = "",
    orderItems = [],
    shippingAddress = {},
    paymentMethod = "",
    createdAt = "",
    status = "",
  } = orderDetails || {};

  // Calculate totals
  const totalAmount = orderItems.reduce(
    (sum, item) =>
      sum + (item.sellingPrice || item.price || 0) * (item.quantity || 1),
    0
  );

  const statusSteps = ["Processing", "Shipped", "Delivered"];
  const activeStep = statusSteps.indexOf(status);

  const getStatusColor = (s) =>
    s === "Processing"
      ? "#F57C00"
      : s === "Shipped"
      ? "#1976D2"
      : s === "Delivered"
      ? "#388E3C"
      : "#757575";

  const truncate = (str, n) =>
    str?.length > n ? str.substr(0, n - 1) + "..." : str;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#251f1fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Order Summary</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(status) },
              ]}
            >
              <Text style={styles.statusText}>{status}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>#{_id.slice(-8)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {createdAt
                ? new Date(createdAt).toLocaleDateString()
                : "Not available"}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Progress</Text>
          <View style={styles.progressContainer}>
            {statusSteps.map((step, index) => (
              <React.Fragment key={step}>
                <View style={styles.stepContainer}>
                  <View
                    style={[
                      styles.circle,
                      index <= activeStep && styles.circleActive,
                    ]}
                  >
                    {index < activeStep && (
                      <Ionicons name="checkmark" size={18} color="#fff" />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      index <= activeStep && styles.stepLabelActive,
                    ]}
                  >
                    {step}
                  </Text>
                </View>

                {index < statusSteps.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      index < activeStep && styles.lineActive,
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* -------- Items (Clickable) -------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items ({orderItems.length})</Text>

          {orderItems.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.productCard}
              onPress={() =>
                navigation.navigate("ProductDetails", {
                  productId: item.productId || item._id,
                  product: item,
                })
              }
            >
              <Image source={{ uri: item.image }} style={styles.productImage} />

              <View style={styles.productInfo}>
                <Text style={styles.productName}>
                  {truncate(item.name, 20)}
                </Text>
                <Text style={styles.productQtyPrice}>
                  Qty: {item.quantity}
                </Text>
              </View>

              <Text style={styles.productTotal}>
                ₹{(
                  item.quantity * (item.sellingPrice || item.price)
                ).toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Shipping */}
        {shippingAddress?.street && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Shipping Address</Text>
            <View style={styles.addressContainer}>
              <Ionicons name="location-outline" size={18} color="#6A1B9A" />
              <Text style={styles.addressText}>
                {shippingAddress.street}, {shippingAddress.city},{" "}
                {shippingAddress.state} - {shippingAddress.zipCode},{" "}
                {shippingAddress.country}
              </Text>
            </View>
          </View>
        )}

        {/* Payment */}
        {paymentMethod && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Payment Method</Text>
            <View style={styles.paymentRow}>
              <Ionicons name="card-outline" size={24} color="#6A1B9A" />
              <Text style={styles.paymentText}>{paymentMethod}</Text>
            </View>
          </View>
        )}

        {/* Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => Alert.alert("🚚 Track Order", "Coming soon!")}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>
              Track Order
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate("Support")}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Get Help
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetails;

/* ----------- Styles ----------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3E5F5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f1b1bff",
    marginLeft: 16,
  },
  scrollContent: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 11,
    marginBottom: 16,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#121414ff" },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: { color: "#FFF", fontSize: 9, fontWeight: "bold" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: { color: "#616161", fontSize: 14 },
  value: { color: "#212121", fontSize: 14, fontWeight: "600" },
  totalValue: { color: "#4A148C", fontSize: 16, fontWeight: "bold" },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },
  stepContainer: { alignItems: "center", flex: 1 },
  circle: {
    width: 15,
    height: 15,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  circleActive: { backgroundColor: "#047857", borderColor: "#047857" },
  stepLabel: { fontSize: 12, color: "#757575", marginTop: 8 },
  stepLabelActive: { color: "#047857", fontWeight: "bold" },
  line: {
    flex: 1,
    height: 3,
    backgroundColor: "#E0E0E0",
  },
  lineActive: { backgroundColor: "#047857" },
  productCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3E5F5",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: { flex: 1 },
  productName: { color: "#212121", fontWeight: "600", fontSize: 14 },
  productQtyPrice: { color: "#757575", fontSize: 13 },
  productTotal: { color: "#047857", fontWeight: "bold", fontSize: 15 },
  addressContainer: { flexDirection: "row", marginTop: 8 },
  addressText: {
    color: "#424242",
    fontSize: 14,
    marginLeft: 8,
    lineHeight: 22,
  },
  paymentRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  paymentText: { color: "#424242", fontWeight: "600", fontSize: 15 },
  actions: { marginTop: 16, gap: 12 },
  button: {
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButton: { backgroundColor: "#047857" },
  secondaryButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonText: { fontSize: 16, fontWeight: "bold" },
  primaryButtonText: { color: "#FFF" },
  secondaryButtonText: { color: "#cf2525ff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#D32F2F", fontSize: 16 },
});
