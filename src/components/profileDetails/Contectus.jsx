import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Linking, // ✅ FIX: Added
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import SummaryApi from "../../common"; // ✅ ensure correct path

const ContactUs = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Open email client
  const openEmail = () => {
    const email = "aatachakki807@gmail.com";
    const subject = "Support Request";
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    Linking.openURL(mailto).catch((err) =>
      console.error("Couldn't open email client", err)
    );
  };

  // ✅ Open phone dialer
  const openPhone = () => {
    const phoneNumber = "+919529899999";
    const tel = `tel:${phoneNumber}`;
    Linking.openURL(tel).catch((err) =>
      console.error("Couldn't open phone dialer", err)
    );
  };

  // ✅ Handle sending message to backend
  const handleSend = async () => {
    if (!name || !phone || !message) {
      Alert.alert("Incomplete", "Please fill in all fields.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      Alert.alert("Invalid Phone", "Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);
      const payload = { name, mobile: phone, message };
      console.log("📤 Sending contact message:", payload);

      const response = await axios.post(SummaryApi.createContact.url, payload);

      if (response.data.success) {
        Alert.alert("✅ Message Sent", response.data.message);
        setName("");
        setPhone("");
        setMessage("");
      } else {
        Alert.alert("❌ Failed", response.data.message || "Please try again later.");
      }
    } catch (error) {
      console.error("❌ Contact API error:", error.response?.data || error.message);
      Alert.alert("Error", "Unable to send your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#fff", "#ffe6e6", "#fff0f0"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={26} color="#fa3a3a" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Contact Us</Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.title}>We’d love to hear from you!</Text>
            <Text style={styles.subtitle}>
              Please fill out the form below and we’ll get back to you soon.
            </Text>

            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#fa3a3a" />
              <TextInput
                placeholder="Your Name"
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholderTextColor="#999"
              />
            </View>

            {/* Phone Input */}
            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#fa3a3a" />
              <TextInput
                placeholder="Phone Number"
                style={styles.input}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                placeholderTextColor="#999"
                maxLength={10}
              />
            </View>

            {/* Message Input */}
            <View style={[styles.inputContainer, { alignItems: "flex-start" }]}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={20}
                color="#fa3a3a"
                style={{ marginTop: 10 }}
              />
              <TextInput
                placeholder="Type your message..."
                style={[styles.input, { height: 100, textAlignVertical: "top" }]}
                multiline
                value={message}
                onChangeText={setMessage}
                placeholderTextColor="#999"
              />
            </View>

            {/* Send Button */}
            <LinearGradient
              colors={["#fa3a3a", "#ff6868"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBtn}
            >
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSend}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Ionicons name="send-outline" size={18} color="#fff" />
                    <Text style={styles.sendText}>Send Message</Text>
                  </>
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Support Info */}
          <View style={styles.supportInfo}>
            <Text style={styles.infoTitle}>Or Reach Us At</Text>

            <TouchableOpacity style={styles.contactCard} onPress={openEmail}>
              <Ionicons name="mail-outline" size={22} color="#fa3a3a" />
              <Text style={styles.cardText}>aatachakki807@gmail.com</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={openPhone}>
              <Ionicons name="call-outline" size={22} color="#fa3a3a" />
              <Text style={styles.cardText}>+91 95298 99999</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#fa3a3a",
    textAlign: "center",
    marginRight: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 14,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#333",
  },
  gradientBtn: {
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 10,
  },
  sendBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 14,
  },
  sendText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  supportInfo: {
    marginTop: 30,
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 10,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginTop: 10,
  },
  cardText: {
    fontSize: 15,
    color: "#444",
    marginLeft: 10,
  },
});
