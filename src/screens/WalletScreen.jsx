import React, { useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import * as Animatable from "react-native-animatable";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

const WalletScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(UserContext);

  const walletBalance = user?.walletBalance || 25;

  const transactions = [
    { id: "1", title: "Order #1256", date: "2025-11-02", amount: -40 },
    { id: "2", title: "Cashback Reward", date: "2025-10-30", amount: 1 },
    { id: "3", title: "Order #1248", date: "2025-10-28", amount: -3 },
    { id: "4", title: "Referral Bonus", date: "2025-10-20", amount: 3 },
  ];

  // Animated rotating coin
  const rotateAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderItem = ({ item }) => (
    <Animatable.View animation="fadeInUp" duration={700} style={styles.transactionItem}>
      <View style={styles.transactionIconWrapper}>
        <LinearGradient
          colors={item.amount < 0 ? ["#4B5563", "#6B7280"] : ["#FACC15", "#FBBF24"]}
          style={styles.transactionIconCircle}
        >
          <Ionicons
            name={item.amount < 0 ? "arrow-up-circle" : "arrow-down-circle"}
            size={22}
            color={item.amount < 0 ? "#F87171" : "#fff"}
          />
        </LinearGradient>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.amount < 0 ? "#F87171" : "#FACC15" },
        ]}
      >
        {item.amount < 0 ? `- $${Math.abs(item.amount)}` : `+ $${item.amount}`}
      </Text>
    </Animatable.View>
  );

  return (
    <LinearGradient
      colors={["#1E1B4B", "#111827", "#000"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Ionicons name="arrow-back" size={22} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.headerText}>My Coin Wallet</Text>
        </View>

        {/* Balance Section */}
        <Animatable.View animation="fadeInDown" duration={800} style={styles.balanceCard}>
          <LinearGradient
            colors={["#FBBF24", "#FACC15", "#FDE68A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.balanceInner}
          >
            <View style={styles.coinContainer}>
              <Animated.View
                style={[
                  styles.coinWrapper,
                  { transform: [{ rotateY: rotateInterpolate }] },
                ]}
              >
                <FontAwesome5 name="coins" size={46} color="#fff" />
              </Animated.View>
            </View>

            <Text style={styles.balanceLabel}>Coin Balance</Text>
            <Text style={styles.balanceAmount}>{walletBalance} Coins</Text>

            <TouchableOpacity
              style={styles.addMoneyButton}
              onPress={() => alert("Earn More Coins coming soon!")}
            >
              <Ionicons name="sparkles-outline" size={18} color="#111" />
              <Text style={styles.addMoneyText}>Earn More</Text>
            </TouchableOpacity>
          </LinearGradient>
        </Animatable.View>

        {/* Transaction History */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.transactionContainer}>
          <Text style={styles.sectionTitle}>Recent Coin Activity</Text>
          <FlatList
            data={transactions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </Animatable.View>
      </ScrollView>
    </LinearGradient>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  header: {
    height: 110,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 25,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: 45,
    backgroundColor: "rgba(255,215,0,0.1)",
    borderRadius: 20,
    padding: 8,
  },
  headerText: {
    color: "#FACC15",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 25,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#FFD700",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  balanceInner: {
    paddingVertical: 15,
    alignItems: "center",
  },
  coinContainer: {
    marginBottom: 10,
  },
  coinWrapper: {
    width: 65,
    height: 65,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight:700,
    opacity: 0.9,
  },
  balanceAmount: {
    color: "#111",
    fontSize: 23,
    fontWeight: "900",
    marginVertical: 10,
  },
  addMoneyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingVertical: 5,
    borderRadius: 25,
    marginTop: 10,
  },
  addMoneyText: {
    color: "#111",
    fontWeight: "700",
    marginLeft: 6,
    fontSize: 15,
  },
  transactionContainer: {
    marginHorizontal: 20,
    marginTop: 25,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FDE68A",
    marginBottom: 14,
  },
  transactionItem: {
    backgroundColor: "#1F2937",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.15)",
  },
  transactionIconWrapper: {
    marginRight: 10,
  },
  transactionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  transactionDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
});
