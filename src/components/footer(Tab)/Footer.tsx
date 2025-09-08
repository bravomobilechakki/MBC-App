import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Search: undefined;
  Setting: undefined;
};

const Footer = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home-outline" size={24} color="#a72626ff" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Wishlist')}>
        <Ionicons name="heart-outline" size={24} color="#8b2828ff" />
        <Text style={styles.label}>Wishlist</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.tab, styles.cartTab]} onPress={() => navigation.navigate('Cart')}>
        <Ionicons name="cart-outline" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Search')}>
        <Ionicons name="search-outline" size={24} color="#c03e3eff" />
        <Text style={styles.label}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate('Setting')}>
        <Ionicons name="settings-outline" size={24} color="#d8a720ff" />
        <Text style={styles.label}>Setting</Text>
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
    marginBottom: 30, // makes it float above others
  },
});
