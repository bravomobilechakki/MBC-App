import React, { useRef, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Linking, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import Ionicons from "react-native-vector-icons/Ionicons"; 

const Navbar = () => {
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  const toggleMenu = () => {
    Animated.timing(menuAnimation, {
      toValue: menuAnimation._value === 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const openWhatsApp = () => {
    const phoneNumber = "989889988";
    const url = `whatsapp://send?phone=${phoneNumber}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert("WhatsApp not found", "Please install WhatsApp to send a message.");
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const menuIconRotation = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  return (
    <View style={styles.container}>
      {/* ✅ Menu Icon */}
      <TouchableOpacity onPress={toggleMenu}>
        <Animated.View style={{ transform: [{ rotate: menuIconRotation }] }}>
          <Image
            source={require("../../images/menu.png")}
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
        <TouchableOpacity onPress={() => navigation.navigate("Wallet")} style={styles.iconWithText}>
          <Image
            source={require("../../images/money-bag.png")}
            style={styles.cartIcon}
            resizeMode="contain"
          />
          <Text style={styles.coinText}>{user?.coins || 0}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={openWhatsApp}>
          <Image
            source={require("../../images/whatsapp.png")}
            style={styles.cartIcon}wd
            resizeMode="contain"
          />
        </TouchableOpacity> */}

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
    gap: 20,
    alignItems: "center",
  },
  iconWithText: {
    flexDirection: "row",
    alignItems: "center",
  },
  cartIcon: {
    width: 27,
    height: 27,
  },
  coinText: {
    marginLeft: 5,
    fontWeight: "bold",
  },
  menuIcon: {
    width: 28,
    height: 28,
  },
});

export default Navbar;
