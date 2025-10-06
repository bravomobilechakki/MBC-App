import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Support = () => {
  const navigation = useNavigation();

  const openWhatsApp = () => {
    const url = "https://wa.me/919529899999";
    Linking.openURL(url).catch(err =>
      console.error("Couldn't open WhatsApp", err)
    );
  };

  const openEmail = () => {
    const email = "aatachakki807@gmail.com";
    const subject = "Support Request";
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailto).catch(err =>
      console.error("Couldn't open email client", err)
    );
  };

  const openPhone = () => {
    const phoneNumber = "+919529899999";
    const tel = `tel:${phoneNumber}`;
    Linking.openURL(tel).catch(err =>
      console.error("Couldn't open phone dialer", err)
    );
  };

  // State to manage expanded FAQ items
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = index => {
    setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "You can track your order by logging into your account and navigating to 'My Orders'. There you'll find real-time updates on your delivery status.",
    },
    {
      question: "What is the return policy?",
      answer:
        "We offer a 30-day return policy for unused and unopened items. Please contact support with your order details for assistance.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit and debit cards, UPI, and wallets like Paytm, Google Pay, and PhonePe for seamless transactions.",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.header}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* FAQs Section */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => toggleExpand(index)}
            >
              <Ionicons name="help-circle-outline" size={22} color="#007bff" />
              <Text style={styles.cardText}>{faq.question}</Text>
              <Ionicons
                name={
                  expandedIndex === index
                    ? "chevron-up-outline"
                    : "chevron-down-outline"
                }
                size={22}
                color="#007bff"
              />
            </TouchableOpacity>
            {expandedIndex === index && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Contact Section */}
        <Text style={styles.sectionTitle}>Contact Us</Text>

        <TouchableOpacity style={styles.card} onPress={openEmail}>
          <Ionicons name="mail-outline" size={22} color="#28a745" />
          <Text style={styles.cardText}>Email: aatachakki807@gmail.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={openPhone}>
          <Ionicons name="call-outline" size={22} color="#28a745" />
          <Text style={styles.cardText}>Phone: +91 95298 99999</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
          <Text style={styles.cardText}>Chat on WhatsApp</Text>
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
    marginBottom: 5,
    elevation: 2,
  },
  cardText: { marginLeft: 10, fontSize: 14, color: "#333", flex: 1 },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 16,
  },
  faqContainer: { marginBottom: 10 },
  answerContainer: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
  },
  answerText: { fontSize: 14, color: "#555" },
});
