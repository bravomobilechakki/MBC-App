import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const Footer = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={24} color="#a72626ff" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Wishlist')}>
        <Ionicons name="heart-outline" size={24} color="#d82020ff" />
        <Text style={styles.label}>Wishlist</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab, styles.cartTab]} onPress={() => navigation.navigate('Cart')}>
        <Ionicons name="cart-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Booking')}>
        <Ionicons name="car-sport-outline" size={24} color="#c03e3eff" />
        <Text style={styles.label}>Booking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Product')}>
        <Ionicons name="grid-outline" size={24} color="#d82020ff" />
        <Text style={styles.label}>Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
  cartTab: {
    backgroundColor: '#ff4d4d',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
});







