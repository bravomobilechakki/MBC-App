import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import SummaryApi from "../../common";
import { UserContext } from "../../context/UserContext";

const Footer = () => {
  const navigation = useNavigation();
  const { token } = useContext(UserContext); // ✅ get token
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      if (!token) return;
      const response = await axios.get(SummaryApi.getCart.url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const items = response.data.data.items;
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQty);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, [token]);

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("Home")}>
        <Ionicons name="home-outline" size={24} color="#a72626ff" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("Wishlist")}>
        <Ionicons name="heart-outline" size={24} color="#d82020ff" />
        <Text style={styles.label}>Wishlist</Text>
      </TouchableOpacity>

      {/* Cart with badge */}
      <TouchableOpacity
        style={[styles.tab, styles.cartTab]}
        onPress={() => {
          if (token) {
            navigation.navigate("Cart");
          } else {
            navigation.navigate("Login");
          }
        }}
      >
        <Ionicons name="cart-outline" size={20} color="#fff"  />

        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("Booking")}>
        <Ionicons name="car-sport-outline" size={24} color="#c03e3eff" />
        <Text style={styles.label}>Booking</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate("Product", { fromFooter: true })}>
        <Ionicons name="grid-outline" size={24} color="#d82020ff" />
        <Text style={styles.label}>Product</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#333",
  },
  cartTab: {
    backgroundColor: "#ff4d4d",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    position: "relative",
  },
 badge: {
  position: "absolute",
  top: -2,       // move a little upward
  right: -2,     // stick to right edge
  backgroundColor: "#fff",
  borderRadius: 10,
  paddingHorizontal: 5,
  paddingVertical: 1,
  minWidth: 18,
  height: 18,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "#ff4d4d",
},
badgeText: {
  fontSize: 10,
  fontWeight: "bold",
  color: "#ff4d4d",
},

});
