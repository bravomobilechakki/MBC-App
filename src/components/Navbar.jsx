
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const Navbar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>MyApp</Text>
      <TextInput style={styles.searchBar} placeholder="Search" />
      <View style={styles.iconsContainer}>
        <Text style={styles.icon}>Cart</Text>
        <Text style={styles.icon}>User</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
});

export default Navbar;
