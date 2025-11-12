import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

const RewardsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Rewards & Coins</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Earn Coins</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>- Complete an order to earn 10 coins.</Text>
          <Text style={styles.infoText}>- Refer a friend and earn 50 coins when they place their first order.</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Refer & Earn</Text>
        <View style={styles.referCard}>
          <Text style={styles.referText}>Share your referral code with friends!</Text>
          <View style={styles.referralCodeContainer}>
            <Text style={styles.referralCode}>YOUR_REF_CODE</Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2e7d32",
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  section: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  referCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 2,
  },
  referText: {
    fontSize: 16,
    marginBottom: 15,
  },
  referralCodeContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  referralCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  shareButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default RewardsScreen;
