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
        <Text style={{ color: "#00695C", marginTop: 8 }}>
          Fetching your bookings...
        </Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>
      <Animated.ScrollView
        style={[{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
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
          <Text style={styles.bannerSubtitle}>Track & manage your service requests</Text>

          <View style={styles.marqueeContainer}>
            <Animated.Text
              style={[styles.marqueeText, { transform: [{ translateX: marqueeAnim }] }]}
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
          const isCancelled = booking.status === "cancelled";

          return (
            <Animated.View
              key={booking._id}
              style={[
                styles.card,
                {
                  borderLeftColor: color,
                  backgroundColor: isCancelled ? "#f5f5f5" : "#FFFFFF",
                  opacity: isCancelled ? 0.6 : 1,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <Text style={styles.service}>{booking.serviceType}</Text>
                <View style={[styles.statusBadge, { backgroundColor: color + "20" }]}>
                  <Text style={[styles.statusText, { color }]}>{booking.status}</Text>
                </View>
              </View>

              <Text style={styles.date}>
                {date} • {time}
              </Text>

              <View style={styles.infoBlock}>
                <Text style={styles.label}>{booking.name}</Text>
                <Text style={styles.label}>{booking.mobile}</Text>
              </View>

              <View style={styles.actions}>
                {!isCancelled ? (
                  <>
                    <TouchableOpacity
                      style={styles.iconBtn}
                      onPress={() => handleCancel(booking._id)}
                      disabled={loadingCancelId === booking._id}
                    >
                      {loadingCancelId === booking._id ? (
                        <ActivityIndicator color="#d32626ff" size="small" />
                      ) : (
                        <Ionicons name="close-circle-outline" size={26} color="#d32626ff" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.coinsBtn}
                      onPress={() => navigation.navigate("Wallet", { booking })}
                    >
                      <Text style={styles.coinsText}>💰 Coins</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text style={styles.cancelNote}>✖️ Booking Cancelled</Text>
                )}
              </View>
            </Animated.View>
          );
        })}

        {/* Back to Dashboard Button */}
        <TouchableOpacity
          style={styles.dashboardBtn}
          onPress={() => navigation.navigate("Dashboard")}
        >
          <Ionicons name="home-outline" size={22} color="#fff" />
          <Text style={styles.dashboardBtnText}> Back to Dashboard</Text>
        </TouchableOpacity>
      </Animated.ScrollView>
    </View>
  );
};

export default BookingOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F7FA",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#E0F7FA",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },
  headerBanner: {
    alignItems: "center",
    backgroundColor: "#047857",
    padding: 6,
    borderRadius: 16,
    marginBottom: 14,
  },
  vanImage: {
    width: 50,
    height: 35,
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "800",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "#E0F2F1",
  },
  marqueeContainer: {
    overflow: "hidden",
    height: 20,
    width: "100%",
    marginTop: 4,
  },
  marqueeText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  service: {
    fontSize: 15,
    fontWeight: "700",
    color: "#004D40",
  },
  date: {
    fontSize: 12,
    color: "#283338ff",
    marginBottom: 6,
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  statusText: {
    fontWeight: "700",
    fontSize: 12,
    textTransform: "capitalize",
  },
  infoBlock: {
    backgroundColor: "#E0F2F1",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: "#040808ff",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  iconBtn: {
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  coinsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dd9716ff",
    paddingVertical: 6,
    width: 220,
    borderRadius: 25,
    justifyContent: "center",
  },
  coinsText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  cancelNote: {
    fontSize: 14,
    color: "#d32626ff",
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  dashboardBtn: {
    marginTop: 12,
    backgroundColor: "#00796B",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "85%",
  },
  dashboardBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
