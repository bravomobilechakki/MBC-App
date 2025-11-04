import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  Easing
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";
import SummaryApi from "../../../common";
import { UserContext } from "../../../context/UserContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const VenueBooking = () => {
  const navigation = useNavigation();
  const { user, token } = useContext(UserContext);

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.mobile || "");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Animation modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const scales = useRef({}).current;

  const venueItems = [
    { name: "Spices", color: ["#FF6F61", "#FF8A65"], image: require("../../../images/spice.png") },
    { name: "Aata", color: ["#e7c040ff", "#bea866ff"], image: require("../../../images/aata.png") },
    { name: "Grinding", color: ["#4DB6AC", "#2e7d32"], image: require("../../../images/mortar.png") },
  ];

  venueItems.forEach((v) => {
    if (!scales[v.name]) scales[v.name] = new Animated.Value(1);
  });

  const handleSelectVenue = (item) => {
    setVenue(item.name);
    Animated.sequence([
      Animated.timing(scales[item.name], { toValue: 1.15, duration: 150, useNativeDriver: true }),
      Animated.timing(scales[item.name], { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const buildManualAddress = () => ({
    street: street.trim(),
    city: city.trim(),
    state: stateName.trim(),
    zipCode: pincode.trim(),
    country: "India",
    isDefault: true,
  });

  const validate = () => {
    if (!name || !phone || !venue) {
      Alert.alert("Missing Info", "Please enter name, mobile and select service type.");
      return false;
    }
    if (!street || !city || !stateName || !pincode) {
      Alert.alert("Missing Address", "Please fill street, city, state and pincode.");
      return false;
    }
    if (!token || !user?._id) {
      Alert.alert("Authentication required", "Please login to continue.");
      return false;
    }
    return true;
  };

  const showSuccessAnimation = () => {
    setShowSuccessModal(true);
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();

    setTimeout(() => {
      setShowSuccessModal(false);
      navigation.navigate("BookingOrder");
    }, 2000);
  };

  const handleBooking = async () => {
    if (!validate()) return;

    const payload = {
      name,
      mobile: phone,
      serviceType: venue,
      address: { mode: "manual", manualAddress: buildManualAddress() },
      user: user._id,
    };

    setIsLoading(true);
    try {
      const res = await axios({
        method: SummaryApi.createBooking.method,
        url: SummaryApi.createBooking.url,
        data: payload,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (res.data?.success) {
        showSuccessAnimation();
      } else {
        Alert.alert("Error", res.data?.message || "Unexpected server response.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      const errorMsg = err?.response?.data?.message || "Something went wrong! Please try again.";
      Alert.alert("Booking Failed ❌", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Your Service</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your Name" placeholderTextColor="#aaa" />
        <Text style={styles.label}>Mobile</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Mobile Number" keyboardType="phone-pad" placeholderTextColor="#aaa" />
      </View>

      <Text style={[styles.label, { marginTop: 16 }]}>Select Service</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
        {venueItems.map((item) => (
          <Animated.View key={item.name} style={[styles.card, { transform: [{ scale: scales[item.name] }] }]}>
            <LinearGradient
              colors={venue === item.name ? item.color : ["#fff", "#fff"]}
              style={styles.cardContent}
            >
              <TouchableOpacity onPress={() => handleSelectVenue(item)} style={{ alignItems: "center" }}>
                <Image source={item.image} style={styles.cardImage} resizeMode="contain" />
                <Text style={[styles.cardText, venue === item.name && { color: "#fff" }]}>{item.name}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        ))}
      </ScrollView>

      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker((s) => !s)}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(e, selected) => {
            setShowDatePicker(false);
            if (selected) setDate(selected);
          }}
        />
      )}

      <View style={{ marginTop: 16 }}>
        <Text style={styles.label}>Address</Text>
        <TextInput style={styles.input} value={street} onChangeText={setStreet} placeholder="Street" placeholderTextColor="#aaa" />
        <TextInput style={styles.input} value={city} onChangeText={setCity} placeholder="City" placeholderTextColor="#aaa" />
        <TextInput style={styles.input} value={stateName} onChangeText={setStateName} placeholder="State" placeholderTextColor="#aaa" />
        <TextInput style={styles.input} value={pincode} onChangeText={setPincode} placeholder="Pincode" keyboardType="numeric" placeholderTextColor="#aaa" />
      </View>

      <TouchableOpacity onPress={handleBooking} disabled={isLoading} style={{ marginTop: 24 }}>
        <LinearGradient colors={["#2e7d32", "#72c975ff"]} style={styles.bookButton}>
          {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bookText}>Confirm Booking</Text>}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("BookingOrder")} style={[styles.bookButton, { marginTop: 12, backgroundColor: "#be5c3fff" }]}>
        <Text style={styles.bookText}>View My Bookings</Text>
      </TouchableOpacity>

      {/* ✅ Success Modal */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
            <Ionicons name="checkmark-circle" size={80} color="#4BB543" />
            <Text style={styles.modalText}>Booking Confirmed!</Text>
            <Text style={styles.modalSubText}>Thank you for your booking ✅</Text>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default VenueBooking;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 12 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: "700", marginLeft: 16, color: "#333" },
  inputContainer: { backgroundColor: "#fff", padding: 12, borderRadius: 16, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8 },
  label: { marginTop: 12, fontWeight: "600", color: "#444" },
  input: { marginTop: 8, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fdfdfd" },
  card: { width: 80, height: 100, borderRadius: 16, marginHorizontal: 8, justifyContent: "center", elevation: 4, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4 },
  cardContent: { flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 16 },
  cardImage: { width: 30, height: 30 },
  cardText: { marginTop: 8, fontWeight: "700", color: "#222", textAlign: "center" },
  dateButton: { marginTop: 8, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", alignItems: "center" },
  bookButton: { paddingVertical: 14, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  bookText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: 250, height: 250, backgroundColor: "#fff", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  modalText: { fontSize: 20, fontWeight: "700", marginTop: 16 },
  modalSubText: { fontSize: 16, marginTop: 8, color: "#555", textAlign: "center"},
  
});


