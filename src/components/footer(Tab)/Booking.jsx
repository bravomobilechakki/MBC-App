import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // <-- Added
import axios from 'axios';

// Import images
const spicesImg = require('../../images/spice.png'); // Spices image
const flourImg = require('../../images/aata.png');   // Flour image
const grindingImg = require('../../images/mortar.png'); // Grinding image

const VenueBooking = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBooking = async () => {
    if (!name || !phone || !venue || !building || !floor || !landmark || !city || !pincode) {
      Alert.alert("Missing Info", "Please fill all fields including venue and address details.");
      return;
    }

    const bookingData = {
        name,
        mobile: phone,
        date: date.toISOString(),
        serviceType: venue,
        address: {
            mode: "manual",
            manualAddress: {
              name: name,
              mobile: phone,
              addressLine1: building,
              addressLine2: floor,
              landmark: landmark,
              city: city,
              pincode: pincode,
              state: "", // Left empty as it's not in the form
              country: "India",
            }
        }
    };

    setIsLoading(true);

    try {
      // IMPORTANT: Replace with your actual API endpoint
      const response = await axios.post('https://your-api-endpoint.com/bookings', bookingData);

      if (response.status === 201 || response.status === 200) {
        Alert.alert(
          "Booking Confirmed ✅",
          `Your booking for ${venue} on ${date.toDateString()} has been confirmed!`,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert("Booking Failed", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert("Booking Error", "An error occurred while making the booking. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getVenueImage = (item) => {
    switch (item) {
      case "Spices": return spicesImg;
      case "Flour": return flourImg;
      case "Grinding": return grindingImg;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#333"/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Venue Booking</Text>
        <View style={{ width: 28 }} /> {/* Placeholder for alignment */}
      </View>

      <ScrollView contentContainerStyle={{ padding: 12, paddingBottom: 20 }}>

        {/* Name Field */}
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#555" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Mobile Field */}
        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={20} color="#555" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Venue Selection */}
        <Text style={styles.label}>Service Type</Text>
        <View style={styles.venueContainer}>
          {["Spices", "Flour", "Grinding"].map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.venueOption, venue === item && styles.venueSelected]}
              onPress={() => setVenue(item)}
            >
              <Image
                source={getVenueImage(item)}
                style={styles.venueImage}
                resizeMode="contain"
              />
              <Text style={[styles.venueText, venue === item && { color: "#fff" }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Picker */}
        <Text style={styles.label}>Select Date</Text>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={20} color="#555" style={{ marginRight: 8 }} />
          <Text style={styles.dateText}>{date.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        {/* Toggle Address */}
        <TouchableOpacity style={styles.toggleBtn} onPress={() => setShowAddress(!showAddress)}>
          <Text style={styles.toggleText}>
            {showAddress ? "Hide Address Details" : "Add Address Details"}
          </Text>
        </TouchableOpacity>

        {/* Address Fields */}
        {showAddress && (
          <>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={20} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Building No / Name"
                placeholderTextColor="#666"
                value={building}
                onChangeText={setBuilding}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="layers-outline" size={20} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Floor"
                placeholderTextColor="#666"
                value={floor}
                onChangeText={setFloor}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="location-outline" size={20} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Landmark"
                placeholderTextColor="#666"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="location-sharp" size={20} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#666"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={20} color="#555" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="Pincode"
                placeholderTextColor="#666"
                keyboardType="numeric"
                value={pincode}
                onChangeText={setPincode}
              />
            </View>
          </>
        )}


        {/* Submit Button */}
        <TouchableOpacity style={[styles.button, isLoading && styles.buttonDisabled]} onPress={handleBooking} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Booking...' : 'Book Now'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default VenueBooking;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111" },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 15,
    backgroundColor: '#fff',
  },
  input: { flex: 1, padding: 10, color: '#585050ff' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 20, color: '#444' },
  venueContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  venueOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#fff',
  },
  venueSelected: { backgroundColor: '#2e7d32', borderColor: '#2e7d32' },
  venueText: { fontSize: 14, color: '#555' },
  venueImage: { width: 20, height: 20, marginRight: 8 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginTop: 10,
  },
  dateText: { fontSize: 16 },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  toggleText: { fontWeight: '600', fontSize: 15, color: '#D32F2F' },
  button: { backgroundColor: '#2e7d32', paddingVertical: 14, borderRadius: 8, marginTop: 30 },
  buttonDisabled: { backgroundColor: '#a5d6a7' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});