  import React, { useContext } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const navigation = useNavigation();
  const { user, setUser, setToken } = useContext(UserContext);

  const handleLogout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    navigation.replace('Login');
  };

  const goToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* ✅ Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} /> {/* Spacer */}
        </View>

        {/* ✅ User Info Section */}
        <TouchableOpacity
          style={styles.profileHeader}
          onPress={user ? () => {} : goToLogin}
        >
          <Image
            source={{ uri: user?.avatar || 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.email}>{user?.mobile || 'Number'}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* ✅ Account Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.optionText}>My Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Text style={styles.optionText}>Wishlist</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Payment')}
          >
            <Text style={styles.optionText}>Payment Methods</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Address')}
          >
            <Text style={styles.optionText}>Shipping Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ✅ Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Text style={styles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('Support')}
          >
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* ✅ Logout */}
        {user && (
          <TouchableOpacity
            style={[
              styles.option,
              { backgroundColor: '#FF4D4D', borderBottomWidth: 0 },
            ]}
            onPress={handleLogout}
          >
            <Text
              style={[{ color: '#fff', textAlign: 'center' }, styles.optionText]}
            >
              Logout
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 12,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
});

export default Profile;
