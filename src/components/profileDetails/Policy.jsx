import React, { useState } from "react";
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

  // 🔹 Initialize all sections open by default
  const [openSections, setOpenSections] = useState({
    intro: true,
    authenticity: true,
    noReturn: true,
    infoCollect: true,
    useInfo: true,
    security: true,
    updates: true,
    contact: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sections = [
    {
      key: "intro",
      title: "1. Introduction",
      content:
        "Welcome to our app! We truly care about your health and well-being. Our mission is to deliver 100% natural, safe, and secure food products that you can trust.",
    },
    {
      key: "authenticity",
      title: "2. Product Authenticity",
      content:
        "All our products are made from pure, natural ingredients. We ensure every batch meets the highest standards of quality, safety, and freshness. No artificial colors, preservatives, or chemicals are used.",
    },
    {
      key: "noReturn",
      title: "3. No Return Policy",
      content:
        "Due to the perishable and consumable nature of our products, we follow a strict No Return, No Exchange Policy. Please ensure your order details are correct before confirming your purchase.",
    },
    {
      key: "infoCollect",
      title: "4. Information We Collect",
      content:
        "We may collect limited personal details such as your name, phone number, address, and email to process your orders and deliver products efficiently.",
    },
    {
      key: "useInfo",
      title: "5. How We Use Your Information",
      content:
        "• To confirm and deliver your orders\n• To provide customer support\n• To share updates about our latest natural food offerings\n• To improve our services and app experience",
    },
    {
      key: "security",
      title: "6. Data Security",
      content:
        "We use secure technology and industry-standard encryption to protect your data. However, please note that no system is completely immune from risks.",
    },
    {
      key: "updates",
      title: "7. Policy Updates",
      content:
        "We may revise this policy periodically to ensure transparency and compliance. Please revisit this page for the latest updates.",
    },
  
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={26} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.header}>Privacy & Product Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sections.map((section) => (
          <View key={section.key} style={styles.card}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.key)}
            >
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons
                name={openSections[section.key] ? "chevron-up" : "chevron-down"}
                size={20}
                color="#444"
              />
            </TouchableOpacity>

            {openSections[section.key] && (
              <Text style={styles.text}>{section.content}</Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginLeft: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    flex: 1,
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginTop: 8,
  },
});
