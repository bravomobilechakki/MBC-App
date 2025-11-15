import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Animated,
  Easing,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import SummaryApi from "../../common";

const Dashboard = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const vanTranslateX = useRef(new Animated.Value(400)).current;

  // Run animations
  useEffect(() => {
    const runVan = () => {
      vanTranslateX.setValue(400);
      Animated.timing(vanTranslateX, {
        toValue: -200,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => runVan());
    };
    runVan();

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Load categories
  const loadDashboard = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch(SummaryApi.getCategorys.url, {
        method: SummaryApi.getCategorys.method,
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data?.success && Array.isArray(data?.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch {
      setCategories([]);
    } finally {
      setLoadingCategories(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  // WhatsApp Order
  const openWhatsAppOrder = async () => {
    const phone = "7568207000";
    const msg = "I'd like to place an order.";

    const appURL = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
      msg
    )}`;
    const webURL = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

    try {
      const supported = await Linking.canOpenURL(appURL);
      await Linking.openURL(supported ? appURL : webURL);
    } catch {
      Alert.alert("Error", "Unable to open WhatsApp");
    }
  };

  const goToBooking = () => navigation.navigate("Booking");

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <View style={styles.header}>
          <Text style={styles.headerText}>🌟 All Featured</Text>

          <View style={styles.sortFilter}>
            <TouchableOpacity onPress={openWhatsAppOrder} style={styles.whatsappButton}>
              <Image
                source={require("../../images/whatsapp.png")}
                style={styles.menuIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterBtn}>
              <Text>Filter ⏳</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* CATEGORIES */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
        >
          {loadingCategories ? (
            <ActivityIndicator />
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <TouchableOpacity
                key={cat._id}
                style={styles.categoryItem}
                onPress={() =>
                  navigation.navigate("ProductsPage", { categoryId: cat._id })
                }
              >
                <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No categories found</Text>
          )}
        </ScrollView>
      </Animated.View>

      {/* OFFER CARD */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <View style={styles.offerCard}>
          <Text style={styles.offerTitle}>10–20% OFF</Text>
          <Text style={styles.offerSub}>Now in Multi-Grain Flour</Text>

          <TouchableOpacity style={styles.shopNowBtn}>
            <Text style={styles.shopNowText}>🛍️ Shop Now →</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* DEAL CARD - NAVIGATES TO BOOKING PAGE */}
      <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
        <TouchableOpacity activeOpacity={0.8} onPress={goToBooking}>
          <View style={styles.dealCard}>
            {/* Van Animation */}
            <Animated.View
              style={[
                styles.vanAnim,
                { transform: [{ translateX: vanTranslateX }] },
              ]}
            >
              <Image
                source={require("../../images/delivery-van.png")}
                style={{ width: 40, height: 40 }}
              />
            </Animated.View>

            <Text style={styles.dealTitle}>Premium Grain Services</Text>
            <Text style={styles.dealSubText}>
              Finest grinding with doorstep delivery
            </Text>

            {/* Features */}
            <View style={styles.featureRow}>
              {[
                "🌾 Cool Grinding",
                "🚚 Free Delivery",
                "⚙️ Ultra-Fine Grinding",
              ].map((label, i) => (
                <View key={i} style={styles.featureChip}>
                  <Text style={styles.featureChipText}>{label}</Text>
                </View>
              ))}
            </View>

            {/* Book Button */}
            <View style={styles.bookBtn}>
              <Text style={styles.bookBtnText}>Book Your Service →</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },

  menuIcon: { width: 30, height: 30 },

  whatsappButton: {
    padding: 6,
    backgroundColor: "#25D36620",
    borderRadius: 50,
    marginRight: 8,
  },

  sortFilter: { flexDirection: "row" },

  filterBtn: {
    padding: 6,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  categories: { marginTop: 20 },

  categoryItem: {
    alignItems: "center",
    marginRight: 15,
  },

  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#ddd",
  },

  categoryText: { marginTop: 5, fontSize: 12 },

  /* OFFER CARD */
  offerCard: {
    backgroundColor: "#b8af9d",
    padding: 20,
    borderRadius: 12,
    marginVertical: 15,
  },

  offerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },

  offerSub: { color: "#fff", marginTop: 4 },

  shopNowBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 8,
    borderRadius: 8,
  },

  shopNowText: { color: "#fff", fontWeight: "bold" },

  /* DEAL CARD */
  dealCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    overflow: "hidden",
  },

  vanAnim: {
    position: "absolute",
    top: 10,
    left: -70,
    zIndex: 2,
  },

  dealTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
    marginTop: 30,
  },

  dealSubText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginBottom: 15,
  },

  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  featureChip: {
    flex: 1,
    backgroundColor: "#fff7e6",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ffd88c",
    marginRight: 8,
  },

  featureChipText: {
    fontSize: 11,
    textAlign: "center",
    fontWeight: "700",
    color: "#7c4a00",
  },

  bookBtn: {
    marginTop: 20,
    backgroundColor: "#ffcc66",
    paddingVertical: 12,
    borderRadius: 10,
  },

  bookBtnText: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    color: "#663c00",
  },
});
