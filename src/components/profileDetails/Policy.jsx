import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Policy = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* ✅ Header with Back Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          Welcome to our app! Your privacy is very important to us. This policy
          explains how we collect, use, and protect your personal information.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.text}>
          We may collect details such as your name, email address, phone number,
          shipping address, and payment information when you use our services.
        </Text>

        <Text style={styles.sectionTitle}>3. How We Use Information</Text>
        <Text style={styles.text}>
          • To process your orders and payments {"\n"}
          • To provide better customer support {"\n"}
          • To send promotional offers and updates {"\n"}
          • To improve our app experience
        </Text>

        <Text style={styles.sectionTitle}>4.Data Security</Text>
        <Text style={styles.text}>
          We use industry-standard security measures to protect your personal
          information. However, no system is 100% secure.
        </Text>

 <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.text}>
          You may request access, updates, or deletion of your personal data at
          any time by contacting our support team.
        </Text>

        <Text style={styles.sectionTitle}>6. Changes to Policy</Text>
        <Text style={styles.text}>
          We may update this policy from time to time. Please check this page
          regularly for updates.
        </Text>



        <Text style={styles.sectionTitle}>7. Contact Us</Text>
        <Text style={styles.text}>
          If you have any questions about this Privacy Policy, please contact us
          at support@myapp.com.
        </Text>
      </ScrollView>
    </View>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    includeFontPadding:8,

  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    marginLeft: 10,
  },
  scrollContent: { paddingBottom: 40 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 6,   
  },
  text: {
     fontSize: 14,
     color: "#555", 
     lineHeight: 20 ,
    
    },
});