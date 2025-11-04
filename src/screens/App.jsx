   import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Context
import { UserProvider, UserContext } from "../context/UserContext";

// Navbar + Footer Components
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer(Tab)/Footer";

// Screens
import Profile from "../components/navbar/Profile";
import Cart from "../components/navbar/Cart";
import Search from "../components/navbar/Search";
import Dashboard from "../components/dashboard/Dashboard";
import BookingOrder from "../components/footer(Tab)/Booking/BookingOrder";

// Profile-related Screens
import Orders from "../components/profileDetails/Orders";
import Policy from "../components/profileDetails/Policy";
import Wishlist from "../components/profileDetails/Wishlist";
import Payment from "../components/profileDetails/Payment";
import Address from "../components/profileDetails/Address";
import Notifications from "../components/profileDetails/Notifications";
import Support from "../components/profileDetails/Support";
import Contectus from "../components/profileDetails/Contectus";
import UpdateProfile from "../components/profileDetails/UpdateProfile";
import Login from "../components/Login/login";
import SignUp from "../components/Login/signup";

// Product Screens
import ProductDetails from "../components/product/productDetails";
import Product from "../components/product/product";
import Review from "../components/product/review";

// Booking and Order Screens
import VenueBooking from "../components/footer(Tab)/Booking/Booking";
import OrderDoneAnimated from "../components/profileDetails/OrderDone";
import OrderDetails from "../components/profileDetails/OrderDetails";

const Stack = createNativeStackNavigator();

// ✅ Dummy placeholder screens
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

// ✅ Home Screen (Dashboard + Product + Footer)
const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <View style={styles.container}>
      <Navbar />
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Search />
        <Dashboard onCategorySelect={handleCategorySelect} />
        <Product selectedCategory={selectedCategory} />
      </ScrollView>
      <Footer />
    </View>
  );
};

// ✅ Stack Navigator (Handles routing)
const AppNavigator = () => {
  const { user, setUser, setToken } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  // ✅ Load token and user data from AsyncStorage on app start
  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from storage", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserFromStorage();
  }, []);

  // ✅ Show loading spinner while loading user data
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  // ✅ Define all routes
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Layout */}
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />

      {/* Profile Detail Screens */}
      <Stack.Screen name="Orders" component={Orders} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Address" component={Address} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="PrivacyPolicy" component={Policy} />
      <Stack.Screen name="Support" component={Support} />
       <Stack.Screen name="contectus" component={Contectus} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />

      {/* Auth Screens */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />

      {/* Product & Booking */}
      <Stack.Screen name="Booking" component={VenueBooking} />
      <Stack.Screen name="BookingOrder" component={BookingOrder} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="Review" component={Review} />

      {/* Orders Flow */}
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
   <Stack.Screen name="OrderDone" component={OrderDoneAnimated} />
    </Stack.Navigator>
  );
};

// ✅ Main App Component (with Provider + Navigation)
export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}

// ✅ Styles
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
