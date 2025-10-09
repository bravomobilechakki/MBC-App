import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const VenueBooking = () => {
  const navigation = useNavigation();

  // State variables
  const [name, setName] = useState('');
  const [email, setNumber] = useState('');
  const [venue, setVenue] = useState('hall');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Address fields
  const [showAddress, setShowAddress] = useState(false);
  const [building, setBuilding] = useState('');
  const [floor, setFloor] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  // Handle booking
  const handleBooking = () => {
    if (!name || !email || !building || !floor || !street || !city || !pincode) {
      Alert.alert("Missing Info", "Please fill all fields including address details.");
      return;
    }

    const bookingDetails = {
      name,
      email,
      venue,
      date: date.toDateString(),
      address: { building, floor, street, city, pincode },
    };

    console.log("Booking Details:", bookingDetails);

    Alert.alert(
      "Booking Confirmed ✅",
      `Your booking for ${venue} on ${date.toDateString()} has been confirmed!\n\n📍 Address: ${building}, Floor ${floor}, ${street}, ${city} - ${pincode}`,
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#200b0bff" />
      </TouchableOpacity>

      <Text style={styles.title}>Venue Booking</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      {/* Email */}
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your number"
        placeholderTextColor="#999"
        keyboardType="number"
        value={email}
        onChangeText={setNumber}
      />

      {/* Date Picker */}
      <Text style={styles.label}>Select Date</Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
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

      {/* Address Toggle */}


      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setShowAddress(!showAddress)}
      >
        <Text style={styles.toggleText}>
          {showAddress ? "Hide Address Details" : "Add Address Details"}
        </Text>
      </TouchableOpacity>

      {/* Address Fields */}
      {showAddress && (
        <>
          <Text style={styles.label}>Building No / Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter building number/name"
            value={building}
            onChangeText={setBuilding}
          />

          <Text style={styles.label}>Floor</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter floor"
            value={floor}
            onChangeText={setFloor}
          />


          <Text style={styles.label}>LandMark</Text>
          <TextInput
            style={styles.input}
            placeholder="LandMark"
            value={floor}
            onChangeText={setFloor}
          />


          <Text style={styles.label}>Street / Area</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter street / area"
            value={street}
            onChangeText={setStreet}
          />

          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter city"
            value={city}
            onChangeText={setCity}
          />

          <Text style={styles.label}>Pincode</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pincode"
            keyboardType="numeric"
            value={pincode}
            onChangeText={setPincode}
          />
        </>
      )}

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBooking}>
          <Text style={styles.buttonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default VenueBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#200b0bff',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 500,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    color: '#585050ff',
    backgroundColor: '#fff',
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  toggleBtn: {
    marginTop: 15,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  toggleText: {
    color: '#D32F2F',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonContainer: {
    marginTop: 30,
  },
  button: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
