import React from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Components



// Screens
import Profile from "../components/Profile";
import Cart from "../components/Cart";
import Search from "../components/Search";
import Navbar from "../components/Navbar";
import Dashboard from "../components/dashboard/Dashboard";
import { ScrollView } from "react-native";



const Stack = createNativeStackNavigator();

const Home = () => {
  return (
    <View style={styles.container}>
      <Navbar />
      {/* ✅ Everything scrolls together */}
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Search />
        <Dashboard />
      </ScrollView>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Cart" component={Cart} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
