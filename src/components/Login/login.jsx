import React, { useState, useRef, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SummaryApi from '../../common';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTP_LENGTH = 4; // 4-digit OTP

const Login = ({ navigation }) => {
  const { setUser, setToken } = useContext(UserContext);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [stage, setStage] = useState('phone'); // 'phone' or 'otp'
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef([]);

  // ✅ Send OTP
  const handleSendOtp = async () => {
    if (!mobile) return Alert.alert('Error', 'Please enter your mobile number');
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.logIn.url, {
        method: SummaryApi.logIn.method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile }),
      });
      const result = await response.json();
      setIsLoading(false);

      if (result.success) {
        Alert.alert('Success', 'OTP sent to your mobile');
        setStage('otp');

        // ✅ Auto-fill OTP if backend returns it
        const otpValue = result.otp ? result.otp.toString().split('') : Array(OTP_LENGTH).fill('');
        setOtp(otpValue);

        // Focus first input only if OTP not auto-filled
        if (!result.otp) setTimeout(() => inputs.current[0]?.focus(), 100);
      } else {
        Alert.alert('Error', result.message || 'Failed to send OTP');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong');
      console.log(error);
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== OTP_LENGTH)
      return Alert.alert('Error', 'Enter complete OTP');

    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.verifyOTP.url, {
        method: SummaryApi.verifyOTP.method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile, otp: otpValue }),
      });
      const result = await response.json();
      setIsLoading(false);

      if (result.success) {
        setToken(result.data.token);
        setUser(result.data.user);
        await AsyncStorage.setItem('token', result.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(result.data.user));
        Alert.alert('Success', result.message);
        navigation.navigate('Profile');
      } else {
        Alert.alert('Error', result.message || 'Invalid OTP');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong');
      console.log(error);
    }
  };

  // ✅ Handle OTP input change
  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); // only last character
    setOtp(newOtp);

    // Move focus forward or backward
    if (text && index < OTP_LENGTH - 1) {
      inputs.current[index + 1].focus();
    } else if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      {stage === 'phone' ? (
        <>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#777" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mobile number"
              placeholderTextColor="#777"
              keyboardType="number-pad"
              value={mobile}
              onChangeText={setMobile}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOtp}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.otpLabel}>Enter OTP</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={el => (inputs.current[index] = el)}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={text => handleOtpChange(text, index)}
                placeholder="•"
                placeholderTextColor="#ccc"
                secureTextEntry={false}
                textAlign="center"
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleVerifyOtp}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.orText}>- OR Continue with -</Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../images/google.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../images/apple-logo.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Image
            source={require('../../images/facebook.png')}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Create An Account </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 48, fontWeight: 'bold', marginBottom: 40 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, color: 'black', height: 50, fontSize: 16 },
  button: {
    backgroundColor: '#ff375f',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  otpLabel: { fontSize: 16, marginBottom: 10, color: '#444' },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: 50,
    height: 50,
    fontSize: 20,
    color: '#ff375f',
  },
  orText: { textAlign: 'center', color: '#777', marginBottom: 20 },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    padding: 10,
  },
  socialIcon: { width: 30, height: 30 },
  signupContainer: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { color: '#777' },
  signupLink: { color: '#ff375f', fontWeight: 'bold' },
});
