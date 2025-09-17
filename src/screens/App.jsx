import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Components
import Profile from "../components/navbar/Profile";
import Cart from "../components/navbar/Cart";
import Search from "../components/navbar/Search";
import Navbar from "../components/navbar/Navbar";
import Dashboard from "../components/dashboard/Dashboard";
import Footer from "../components/footer(Tab)/Footer";

// Profile-related screens
import Orders from "../components/profileDetails/Orders";
import Policy from "../components/profileDetails/Policy";
import Wishlist from "../components/profileDetails/Wishlist";
import Payment from "../components/profileDetails/Payment";
import Address from "../components/profileDetails/Address";
import Notifications from "../components/profileDetails/Notifications";
import Support from "../components/profileDetails/Support";
import Login from "../components/Login/login";
import SignUp from "../components/Login/signup";
import Booking from "../components/footer(Tab)/Booking";
import ProductDetails from "../components/product/productDetails";
import Product from "../components/product/product";

// Dummy placeholder screens
const SearchScreen = () => (
  <View style={styles.center}>
    <Text>Search Screen</Text>
  </View>
);

const SettingScreen = () => (
  <View style={styles.center}>
    <Text>Setting Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator();

const Home = () => {
  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Search />
        <Dashboard />
      </ScrollView>
      <Footer />
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
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Setting" component={SettingScreen} />

        {/* Profile Details Screens */}
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="Wishlist" component={Wishlist} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Address" component={Address} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="PrivacyPolicy" component={Policy} />
        <Stack.Screen name="Support" component={Support} />
  <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="SignUp" component={SignUp} />
       <Stack.Screen name="Booking" component={Booking} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
         <Stack.Screen name="Product" component={Product} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
