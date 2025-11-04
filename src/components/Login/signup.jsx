import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SummaryApi from '../../common';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTP_LENGTH = 4;

const SignUp = ({ navigation }) => {
  const { setUser, setToken } = useContext(UserContext);
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const inputsRefs = useRef([]);

  // =========================
  // SEND OTP HANDLER
  // =========================
  const handleSendOtp = async () => {
    if (!mobile.trim()) return Alert.alert('Error', 'Please enter your mobile number.');
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.signUP.url, {
        method: SummaryApi.signUP.method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'OTP sent to your mobile.');
        setShowOTP(true);

        // 👇 Autofill OTP if backend sends it (for testing/dev)
        if (result.otp) {
          const otpString = String(result.otp).slice(0, OTP_LENGTH);
          const otpArray = otpString.split('');
          setOtpDigits(otpArray);

          // Delay to ensure input boxes render before auto-verification
          setTimeout(() => {
            handleAutoVerify(otpString);
          }, 500);
        } else {
          setTimeout(() => inputsRefs.current[0]?.focus(), 100);
        }
      } else Alert.alert('Error', result.message || 'Failed to send OTP.');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // OTP CHANGE HANDLER
  // =========================
  const handleOtpChange = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = text.slice(-1);
      setOtpDigits(newOtpDigits);
      if (text && index < OTP_LENGTH - 1) {
        inputsRefs.current[index + 1].focus();
      } else if (!text && index > 0) {
        inputsRefs.current[index - 1].focus();
      }
    }
  };

  // =========================
  // AUTO VERIFY WHEN OTP IS FILLED
  // =========================
  const handleAutoVerify = async (otp) => {
    if (!otp || otp.length !== OTP_LENGTH) return;
    handleVerifyOTP(otp);
  };

  // =========================
  // VERIFY OTP HANDLER
  // =========================
  const handleVerifyOTP = async (autoOtp = null) => {
    const otp = autoOtp || otpDigits.join('');
    if (otp.length !== OTP_LENGTH) return Alert.alert('Error', `Please enter ${OTP_LENGTH}-digit OTP.`);
    if (!name.trim() || !street.trim() || !city.trim() || !stateField.trim() || !postalCode.trim()) {
      return Alert.alert('Error', 'Please fill all profile fields.');
    }
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.verifyOTP.url, {
        method: SummaryApi.verifyOTP.method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile,
          otp,
          name,
          address: {
            mode: 'manual',
            manualAddress: {
              street,
              city,
              state: stateField,
              zipCode: postalCode,
              country: 'India',
              isDefault: true,
            },
          },
        }),
      });
      const result = await response.json();
      if (result.success) {
        setToken(result.data.token);
        setUser(result.data.user);
        await AsyncStorage.setItem('token', result.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
        Alert.alert('Success', 'Account created successfully!');
        setIsVerified(true);
        navigation.navigate('Profile');
      } else Alert.alert('Error', result.message || 'OTP verification failed.');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>Create an account</Text>

        {/* MOBILE INPUT */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#777" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Mobile number"
            placeholderTextColor="#777"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
          />
        </View>

        {/* OTP SECTION */}
        {showOTP && !isVerified && (
          <>
            <Text style={styles.agreeText}>Enter the OTP sent to your number</Text>
            <View style={styles.otpContainer}>
              {otpDigits.map((digit, index) => (
                <TextInput
                  key={index}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  ref={(ref) => (inputsRefs.current[index] = ref)}
                  textAlign="center"
                />
              ))}
            </View>

            {/* PROFILE FIELDS */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#777"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="home-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Street Address"
                placeholderTextColor="#777"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="location-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#777"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="map-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#777"
                value={stateField}
                onChangeText={setStateField}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#777" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                placeholderTextColor="#777"
                keyboardType="numeric"
                value={postalCode}
                onChangeText={setPostalCode}
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => handleVerifyOTP()} disabled={isLoading}>
              <Text style={styles.buttonText}>{isLoading ? 'Verifying...' : 'Verify OTP & Submit'}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* SEND OTP BUTTON */}
        {!showOTP && (
          <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Send OTP'}</Text>
          </TouchableOpacity>
        )}

        {/* SOCIAL LOGIN + LOGIN LINK */}
        {!showOTP && (
          <>
            <Text style={styles.orText}>- OR Continue with -</Text>
            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../images/google.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../images/apple-logo.png')} style={styles.socialIcon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Image source={require('../../images/facebook.png')} style={styles.socialIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>I Already Have an Account </Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  innerContainer: { padding: 20, alignItems: 'center' },
  title: { fontSize: 40, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16 },
  agreeText: { fontSize: 12, color: '#777', textAlign: 'center', marginBottom: 20 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '80%', marginBottom: 20 },
  otpInput: {
    width: 50,
    height: 50,
    borderColor: '#3b2d2dff',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
    color: '#777',
  },
  button: { backgroundColor: '#ff375f', padding: 15, borderRadius: 8, alignItems: 'center', width: '100%', marginBottom: 20 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  orText: { textAlign: 'center', color: '#777', marginBottom: 20 },
  socialContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 30 },
  socialButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 50, padding: 10 },
  socialIcon: { width: 30, height: 30 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#777' },
  loginLink: { color: '#ff375f', fontWeight: 'bold' },
});
