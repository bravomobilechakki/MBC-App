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

const Support = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* ✅ Header with Back Arrow */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* FAQs Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="help-circle-outline" size={22} color="#007bff" />
          <Text style={styles.cardText}>How can I track my order?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="return-down-back-outline" size={22} color="#007bff" />
          <Text style={styles.cardText}>What is the return policy?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="card-outline" size={22} color="#007bff" />
          <Text style={styles.cardText}>What payment methods do you accept?</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Contact Section */}
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="mail-outline" size={22} color="#28a745" />
          <Text style={styles.cardText}>Email: support@myapp.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="call-outline" size={22} color="#28a745" />
          <Text style={styles.cardText}>Phone: +91 98765 43210</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={22}
            color="#28a745"
          />
          <Text style={styles.cardText}>Live Chat</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9", padding: 16 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
    marginBottom: 8,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardText: { marginLeft: 10, fontSize: 14, color: "#333", flexShrink: 1 },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
});
