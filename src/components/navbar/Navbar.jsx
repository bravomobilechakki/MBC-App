import React, { useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons"; 

const Navbar = () => {
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  const toggleMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: menuAnimation._value === 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const menuIconRotation = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.container}>
      {/* ✅ Menu Icon */}
      {/* ✅ Menu Icon (custom image instead of Ionicon) */}
<TouchableOpacity onPress={toggleMenu}>
  <Animated.View style={{ transform: [{ rotate: menuIconRotation }] }}>
    <Image
      source={require("../../images/menu.png")} // 👉 replace with your menu image
      style={styles.menuIcon}
      resizeMode="contain"
    />
  </Animated.View>
</TouchableOpacity>


      {/* ✅ Logo Image */}
      <Image
        source={require("../../images/logo1.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* ✅ Right Side Icons */}
      <View style={styles.iconsContainer}>
        {/* Custom cart image */}
        <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
          <Image
            source={require("../../images/notification.png")}
            style={styles.cartIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Profile using Ionicon */}
           <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image
            source={require("../../images/user.png")}
            style={styles.cartIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#eff7f2ff",
  },
  logo: {
    width: 120,
    height: 40,
  },
  iconsContainer: {
    flexDirection: "row",
    gap:20,
    alignItems: "center",
  },
  cartIcon: {
    width: 27,   // adjust size to match Ionicon
    height: 27,
  },
  menuIcon: {
  width: 28,   // same size as Ionicon for balance
  height: 28,

},

});

export default Navbar;
