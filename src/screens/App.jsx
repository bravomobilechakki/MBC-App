
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Navbar from '../components/Navbar';

const App = () => {
  return (
    <View style={styles.container}>
      <Navbar />
      <View style={styles.content}>
        <Text>Hello World</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
