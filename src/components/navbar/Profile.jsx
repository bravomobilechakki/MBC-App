import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const navigation = useNavigation();
  const { user, setUser, setToken, fetchUserProfile } = useContext(UserContext);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const defaultAvatar =
    'https://cdn-icons-png.flaticon.com/512/3177/3177440.png';

  return (
    <LinearGradient
      colors={['#b9a54aff', '#e0d6a7ff', '#ffe3e3']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={{ width: 26 }} />
          </View>

          {/* Profile Card */}
          <Animatable.View
            animation="fadeInDown"
            duration={800}
            style={styles.profileCard}
          >
            <Image
              source={{
                uri: user?.avatar && user.avatar.trim() !== ''
                  ? user.avatar
                  : defaultAvatar,
              }}
              style={styles.avatar}
            />
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
              <Text style={styles.email}>
                {user?.mobile || 'No number available'}
              </Text>
            </View>
          </Animatable.View>

          {/* Account Section */}
          <Animatable.View animation="fadeInUp" delay={200} style={styles.section}>
            <Text style={styles.sectionTitle}>My Account</Text>

            <Option
              icon="cart-outline"
              label="My Orders"
              onPress={() => navigation.navigate('Orders')}
            />
            <Option
              icon="heart-outline"
              label="Wishlist"
              onPress={() => navigation.navigate('Wishlist')}
            />
            <Option
              icon="card-outline"
              label="Payment Methods"
              onPress={() => navigation.navigate('Payment')}
            />
            <Option
              icon="location-outline"
              label="Shipping Address"
              onPress={() => navigation.navigate('Address')}
            />
            <Option
              icon="person-circle-outline"
              label="Update Profile"
              onPress={() => navigation.navigate('UpdateProfile')}
            />
          </Animatable.View>

          {/* Settings Section */}
          <Animatable.View animation="fadeInUp" delay={300} style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>

            <Option
              icon="notifications-outline"
              label="Notifications"
              onPress={() => navigation.navigate('Notifications')}
            />
            <Option
              icon="shield-checkmark-outline"
              label="Privacy Policy"
             
              onPress={() => navigation.navigate('PrivacyPolicy')}
            />
            <Option
              icon="help-circle-outline"
              label="Help & Support"
              onPress={() => navigation.navigate('Support')}
            />
            <Option
              icon="call-outline"
              label="Contact Us"
              onPress={() => navigation.navigate('contectus')}
            />
          </Animatable.View>

          {/* Logout Button */}
          {user && (
            <Animatable.View animation="zoomIn" delay={400}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

// ✅ Reusable Option Component with color prop
const Option = ({ icon, label, onPress, labelColor = '#333' }) => (
  <TouchableOpacity style={styles.option} onPress={onPress}>
    <Ionicons name={icon} size={20} color="#fa3a3a" style={{ marginRight: 12 }} />
    <Text style={[styles.optionText, { color: labelColor }]}>{label}</Text>
    <Ionicons name="chevron-forward-outline" size={18} color="#ccc" style={{ marginLeft: 'auto' }} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 6,
    marginBottom: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 45,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#444',
    marginBottom: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#fa3a3a',
    paddingVertical: 14,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 6,
  },
});

export default Profile;
