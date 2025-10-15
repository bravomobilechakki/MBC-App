import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import SummaryApi from "../../../common";
import { UserContext } from "../../../context/UserContext";

const BookingOrder = () => {
  const navigation = useNavigation();
  const { token, user } = useContext(UserContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCancelId, setLoadingCancelId] = useState(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchBookings = async () => {
    if (!user?._id) {
      Alert.alert("Error", "User not found!");
      return;
    }
    setLoading(true);
    try {
      const res = await axios({
        method: SummaryApi.getBookings(user._id).method,
        url: SummaryApi.getBookings(user._id).url,
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.data.success) {
        setBookings(res.data.data || []);
        startAnimation();
      } else {
        Alert.alert("Error", "Failed to fetch bookings.");
      }
    } catch (err) {
      console.error("Fetch bookings error:", err);
      Alert.alert("Error", "Unable to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = (bookingId) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No" },
      {
        text: "Yes, Cancel",
        onPress: async () => {
          setLoadingCancelId(bookingId);
          try {
            const res = await axios({
              method: SummaryApi.cancelBooking(bookingId).method,
              url: SummaryApi.cancelBooking(bookingId).url,
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data.success) {
              const updatedBooking = res.data.data;
              setBookings((prev) =>
                prev.map((b) => (b._id === bookingId ? updatedBooking : b))
              );
              Alert.alert("Cancelled", "Booking has been cancelled.");
            } else {
              Alert.alert("Error", "Failed to cancel booking. Try again.");
            }
          } catch (err) {
            console.error("Cancel booking error:", err);
            Alert.alert("Error", "Error cancelling booking.");
          } finally {
            setLoadingCancelId(null);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (bookings.length === 0) {
    return (
      <Animated.View
        style={[styles.center, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#555" }}>No bookings found.</Text>
      </Animated.View>
    );
  }

  const sortedBookings = [...bookings].sort((a, b) => {
    if (a.status === "cancelled" && b.status !== "cancelled") return 1;
    if (a.status !== "cancelled" && b.status === "cancelled") return -1;
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Orders</Text>
      </View>

      {sortedBookings.map((booking, index) => {
        const bookingDate = new Date(booking.date);
        const dateStr = bookingDate.toLocaleDateString();
        const timeStr = bookingDate.toLocaleTimeString();

        return (
          <Animated.View
            key={booking._id}
            style={[
              styles.card,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
              booking.status === "cancelled" && { opacity: 0.6 },
            ]}
          >
            {/* Label-Value Rows */}
            <View style={styles.infoRow}>
              <Text style={styles.label}>👤 Name</Text>
              <Text style={styles.value}>{booking.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>📞 Mobile</Text>
              <Text style={styles.value}>{booking.mobile}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>🛠 Service</Text>
              <Text style={styles.value}>{booking.serviceType}</Text>
            </View>

            {/* Date & Time Row */}
            <View style={styles.dateTimeRow}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={20} color="#00796b" />
                <Text style={styles.dateValue}>{dateStr}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={20} color="#00796b" />
                <Text style={styles.dateValue}>{timeStr}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>🚦 Status</Text>
              <Text style={[styles.value, booking.status === "cancelled" && { color: "#D32F2F" }]}>
                {booking.status}
              </Text>
            </View>

            {booking.status !== "cancelled" && (
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => handleCancel(booking._id)}
                disabled={loadingCancelId === booking._id}
              >
                {loadingCancelId === booking._id ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.cancelBtnText}>🚫 Cancel Booking</Text>
                )}
              </TouchableOpacity>
            )}
          </Animated.View>
        );
      })}

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.homeBtnText}>🏠 Go to Home</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
};

export default BookingOrder;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f7", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "700", marginLeft: 16, color: "#222" },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 18,
  },

  // Modern e-commerce style for info
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f0f0f5",
    borderRadius: 10,
  },
  label: { fontSize: 14, color: "#888", fontWeight: "500" },
  value: { fontSize: 16, color: "#111", fontWeight: "700" },

  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2f1",
    padding: 12,
    borderRadius: 12,
    flex: 0.48,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f2f1",
    padding: 12,
    borderRadius: 12,
    flex: 0.48,
    justifyContent: "flex-end",
  },
  dateValue: { fontSize: 16, fontWeight: "700", color: "#00796b", marginLeft: 6 },

  cancelBtn: {
    backgroundColor: "#D32F2F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
    elevation: 2,
  },
  cancelBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  homeBtn: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    elevation: 2,
  },
  homeBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
