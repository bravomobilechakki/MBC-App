import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Components
import Profile from "../components/Profile";
import Cart from "../components/Cart";
import Search from "../components/Search";
import Navbar from "../components/Navbar";
import Dashboard from "../components/dashboard/Dashboard";

// Profile-related screens
import Orders from "../components/Profiledetails.jsx/Orders";
import Policy from "../components/Profiledetails.jsx/Policy";
import Wishlist from "../components/Profiledetails.jsx/Wishlist";
import Payment from "../components/Profiledetails.jsx/Payment";
import Address from "../components/Profiledetails.jsx/Address";
import Notifications from "../components/Profiledetails.jsx/Notifications";
import Support from "../components/Profiledetails.jsx/Support";


const Stack = createNativeStackNavigator();

const Home = () => {
  return (
    <View style={styles.container}>
      <Navbar />
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
        {/* Main Screens */}
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Cart" component={Cart} />

        {/* Profile Details Screens */}
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Address" component={Address} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="PrivacyPolicy" component={Policy} />
        <Stack.Screen name="Support" component={Support} />

        {/* Auth */}
        {/* <Stack.Screen name="Login" component={Login} /> */}
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
