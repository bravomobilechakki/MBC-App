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
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import SummaryApi from "../../../common";
import { UserContext } from "../../../context/UserContext";

const { width } = Dimensions.get("window");

const BookingOrder = () => {
  const navigation = useNavigation();
  const { token, user } = useContext(UserContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCancelId, setLoadingCancelId] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const marqueeAnim = useRef(new Animated.Value(0)).current;

  // Header fade-in
  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  };

  // Moving marquee text
  const startMarquee = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(marqueeAnim, {
          toValue: -width,
          duration: 6000,
          useNativeDriver: true,
          easing: Easing.linear,
        }),
        Animated.timing(marqueeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios({
        method: SummaryApi.getBookings(user._id).method,
        url: SummaryApi.getBookings(user._id).url,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        // Sort bookings: newest first, cancelled last
        const sorted = res.data.data.sort((a, b) => {
          if (a.status === "cancelled" && b.status !== "cancelled") return 1;
          if (b.status === "cancelled" && a.status !== "cancelled") return -1;
          return new Date(b.date) - new Date(a.date);
        });
        setBookings(sorted);
        startAnimations();
        startMarquee();
      } else {
        Alert.alert("Error", "Failed to fetch bookings.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Unable to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = (id) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No" },
      {
        text: "Yes",
        onPress: async () => {
          setLoadingCancelId(id);
          try {
            const res = await axios({
              method: SummaryApi.cancelBooking(id).method,
              url: SummaryApi.cancelBooking(id).url,
              headers: { Authorization: `Bearer ${token}` },
            });
            if (res.data.success) {
              setBookings((prev) =>
                prev.map((b) => (b._id === id ? res.data.data : b))
              );
            }
          } catch (err) {
            console.error(err);
            Alert.alert("Error", "Error cancelling booking.");
          } finally {
            setLoadingCancelId(null);
          }
        },
      },
    ]);
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#00897B" />
        <Text style={{ color: "#00695C", marginTop: 8 }}>Fetching your bookings...</Text>
      </View>
    );

  if (bookings.length === 0)
    return (
      <Animated.View
        style={[styles.center, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <Ionicons name="document-text-outline" size={60} color="#B0BEC5" />
        <Text style={{ fontSize: 18, fontWeight: "600", color: "#607D8B", marginTop: 10 }}>
          No bookings yet!
        </Text>
      </Animated.View>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#43A047";
      case "cancelled":
        return "#E53935";
      case "pending":
      default:
        return "#FB8C00";
    }
  };

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <Image
          source={require("../../../images/delivery-van.png")}
          style={styles.vanImage}
          resizeMode="contain"
        />
        <Text style={styles.bannerTitle}>My Bookings</Text>
        <Text style={styles.bannerSubtitle}>Track & manage  your service requests</Text>

        {/* Moving marquee text */}
        <View style={styles.marqueeContainer}>
          <Animated.Text
            style={[
              styles.marqueeText,
              { transform: [{ translateX: marqueeAnim }] },
            ]}
          >
            🚚 Your comfort is on the way 🚚
          </Animated.Text>
        </View>
      </View>

      {/* Booking Cards */}
      {bookings.map((booking) => {
        const bookingDate = new Date(booking.date);
        const date = bookingDate.toLocaleDateString();
        const time = bookingDate.toLocaleTimeString();
        const color = getStatusColor(booking.status);

        return (
          <Animated.View key={booking._id} style={[styles.card, { borderLeftColor: color }]}>
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.service}>{booking.serviceType}</Text>
                <Text style={styles.date}>{date} • {time}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: color + "20" }]}>
                <Text style={[styles.statusText, { color }]}>{booking.status}</Text>
              </View>
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.label}>👤 {booking.name}</Text>
              <Text style={styles.label}>📞 {booking.mobile}</Text>
            </View>

            <View style={styles.actions}>
              {booking.status !== "cancelled" && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => handleCancel(booking._id)}
                  disabled={loadingCancelId === booking._id}
                >
                  {loadingCancelId === booking._id ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.cancelText}>Cancel</Text>
                  )}
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.detailsBtn}
                onPress={() => navigation.navigate("OrderDetails", { booking })}
              >
                <Ionicons name="wallet-outline" size={18} color="#fff" />
                <Text style={styles.detailsText}> Coins</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        );
      })}

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.homeBtnText}>🏠 Back to Home</Text>
      </TouchableOpacity>
    </Animated.ScrollView>
  );
};

export default BookingOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    padding: 16,
  },
  headerBanner: {
    alignItems: "center",
    backgroundColor: "#00ACC1",
    padding: 24,
    borderRadius: 18,
    marginBottom: 20,
  },
  vanImage: {
    width: 80,
    height: 50,
    marginBottom: 8,
  },
  bannerTitle: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "800",
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#E0F2F1",
    marginBottom: 6,
  },
  marqueeContainer: {
    overflow: "hidden",
    height: 25,
    width: "100%",
    marginTop: 6,
  },
  marqueeText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    borderLeftWidth: 6,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  service: {
    fontSize: 18,
    fontWeight: "700",
    color: "#004D40",
  },
  date: {
    fontSize: 13,
    color: "#607D8B",
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 13,
    textTransform: "capitalize",
  },
  infoBlock: {
    marginTop: 14,
    backgroundColor: "#E0F2F1",
    padding: 12,
    borderRadius: 10,
  },
  label: {
    fontSize: 14,
    color: "#004D40",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelBtn: {
    flex: 0.45,
    backgroundColor: "#D32F2F",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  detailsBtn: {
    flex: 0.45,
    backgroundColor: "#FFC107",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  detailsText: {
    color: "#4E342E",
    fontWeight: "700",
    fontSize: 15,
  },
  homeBtn: {
    marginTop: 10,
    backgroundColor: "#00796B",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  homeBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
