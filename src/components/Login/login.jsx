import React, { useState, useContext } from 'react';
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

const Login = ({ navigation }) => {
  const { setUser, setToken } = useContext(UserContext);
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [stage, setStage] = useState('phone'); // 'phone' or 'otp'
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!mobile) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.logIn.url, {
        method: SummaryApi.logIn.method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
        }),
      });

      const result = await response.json();
      setIsLoading(false);

      if (result.success) {
        Alert.alert('Success', 'OTP sent to your mobile');
        setStage('otp');
      } else {
        Alert.alert('Error', result.message || 'Failed to send OTP');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Something went wrong');
      console.error(error);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(SummaryApi.verifyOTP.url, {
        method: SummaryApi.verifyOTP.method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mobile: mobile,
          otp: otp,
        }),
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
      console.error(error);
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
          <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Send OTP'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="#777"
              keyboardType="number-pad"
              secureTextEntry={true}
              value={otp}
              onChangeText={setOtp}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleVerifyOtp} disabled={isLoading}>
            <Text style={styles.buttonText}>{isLoading ? 'Verifying...' : 'Verify OTP'}</Text>
          </TouchableOpacity>
        </>
      )}

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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    marginTop: 8,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    text :"black",
    height: 50,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ff375f',
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    color: '#777',
    marginBottom: 20,
  },
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
  socialIcon: {
    width: 30,
    height: 30,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#777',
  },
  signupLink: {
    color: '#ff375f',
    fontWeight: 'bold',
  },
});
