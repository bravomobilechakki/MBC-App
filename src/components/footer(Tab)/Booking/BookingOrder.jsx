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

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startScreenAnimation = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Pulse animation for cancel button
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
        startScreenAnimation();
        startPulse();
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
        <ActivityIndicator size="large" color="#00C6A9" />
        <Text style={{ color: "#00796b", marginTop: 8 }}>Loading bookings...</Text>
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
          <Ionicons name="arrow-back" size={28} color="#004D40" />
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
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: Animated.multiply(slideAnim, 0.1 * index) },
                  { scale: fadeAnim },
                ],
              },
              booking.status === "cancelled" && { opacity: 0.6 },
            ]}
          >
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

            <View style={styles.dateTimeRow}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={20} color="#004D40" />
                <Text style={styles.dateValue}>{dateStr}</Text>
              </View>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={20} color="#004D40" />
                <Text style={styles.dateValue}>{timeStr}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>🚦 Status</Text>
              <Text
                style={[
                  styles.value,
                  booking.status === "cancelled" && { color: "#C62828" },
                ]}
              >
                {booking.status}
              </Text>
            </View>

            {booking.status !== "cancelled" && (
              <View style={styles.buttonRow}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    style={styles.smallCancelBtn}
                    onPress={() => handleCancel(booking._id)}
                    disabled={loadingCancelId === booking._id}
                  >
                    {loadingCancelId === booking._id ? (
                      <ActivityIndicator color="#C62828" size="small" />
                    ) : (
                      <Ionicons name="close-circle-outline" size={28} color="#C62828" />
                    )}
                  </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate("OrderDetails", { booking })}
                >
                  <Animated.Text style={styles.detailsBtnText}>💰  Coins</Animated.Text>
                </TouchableOpacity>
              </View>
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
  container: { flex: 1, backgroundColor: "#E0F2F1", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "800", marginLeft: 16, color: "#004D40" },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
  },
  label: { fontSize: 14, color: "#777", fontWeight: "500" },
  value: { fontSize: 16, color: "#222", fontWeight: "700" },

  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B2DFDB",
    padding: 12,
    borderRadius: 12,
    flex: 0.48,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#B2DFDB",
    padding: 12,
    borderRadius: 12,
    flex: 0.48,
    justifyContent: "flex-end",
  },
  dateValue: { fontSize: 16, fontWeight: "700", color: "#004D40", marginLeft: 6 },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  smallCancelBtn: {
    flex: 0.25,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsBtn: {
    flex: 0.7,
    backgroundColor: "#FFD54F",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },
  detailsBtnText: {
    color: "#4E342E",
    fontWeight: "700",
    fontSize: 16,
  },

  homeBtn: {
    backgroundColor: "#00796B",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
    elevation: 3,
  },
  homeBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
 