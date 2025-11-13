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
import Svg, { Path } from "react-native-svg";
import * as Animatable from "react-native-animatable";
import SummaryApi from "../../common";

const Dashboard = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const vanTranslateX = useRef(new Animated.Value(400)).current; // start from right

  // 🚐 Move van continuously right → left
  useEffect(() => {
    const animateVan = () => {
      vanTranslateX.setValue(400); // reset to right side
      Animated.timing(vanTranslateX, { 
        toValue: -200, // move across to left
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => animateVan()); // loop forever
    };
    animateVan();
  }, [vanTranslateX]);

  // ✅ Fetch categories
  const loadDashboard = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch(SummaryApi.getCategorys.url, {
        method: SummaryApi.getCategorys.method,
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch categories");

      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
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
    setCategories([]);
    loadDashboard();
  };

  // ✅ Improved WhatsApp function
  const openWhatsAppOrder = async () => {
    const phoneNumber = "7568207000";
    const message = "I'd like to place an order.";
    const appURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const webURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    try {
      const supported = await Linking.canOpenURL(appURL);
      if (supported) {
        await Linking.openURL(appURL);
      } else {
        await Linking.openURL(webURL);
      }
    } catch (error) {
      console.error("Error opening WhatsApp:", error);
      Alert.alert("WhatsApp Error", "Unable to open WhatsApp. Please try again.");
    }
  };

  // ✅ Navigate to Booking
  const handleBookVen = () => {
    navigation.navigate("Booking");
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#e0d6a7ff"]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🌟 All Featured</Text>
        <View style={styles.sortFilter}>
          <TouchableOpacity
            onPress={openWhatsAppOrder}
            activeOpacity={0.7}
            style={styles.whatsappButton}
          >
            <Image
              source={require("../../images/whatsapp.png")}
              style={styles.menuIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterBtn}>
            <Text>Filter ⏳</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
      >
        {loadingCategories ? (
          <ActivityIndicator size="small" color="#007bff" />
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
          <Text style={{ color: "#888" }}>No categories found</Text>
        )}
      </ScrollView>

      {/* Offer Banner */}
      <View style={styles.offerCard}>
        <Text style={styles.offerTitle}>10-20% OFF</Text>
        <Text style={styles.offerSub}>Now in (product)</Text>
        <Text style={styles.offerSub}>Multi Grain Flour</Text>
        <TouchableOpacity style={styles.shopNowBtn}>
          <Text style={styles.shopNowText}>🛍️ Shop Now →</Text>
        </TouchableOpacity>
      </View>

      {/* 🏛️ Deal of the Day Section */}
      <Animatable.View
        animation="fadeInUp"
        duration={800}
        delay={100}
        style={styles.dealCard}
      >
        <Animatable.View animation="fadeIn" delay={300} style={{ flex: 1 }}>
          <View style={styles.titleContainer}>
            <View style={styles.titleHighlight} />
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Animatable.Text
                animation="pulse"
                easing="ease-out"
                iterationCount="infinite"
                style={styles.dealTitle}
              >
                Book Your Van
              </Animatable.Text>

              {/* 🚐 Animated Van */}
              <Animated.View
                style={[
                  { transform: [{ translateX: vanTranslateX }, { scaleX: 1 }] },
                  { position: "absolute", zIndex: 10, top: -20, left: 0 },
                ]}
              >
                <Animatable.View
                  animation="swing"
                  iterationCount="infinite"
                  duration={15000}
                >
                  <Animated.Image
                    source={require("../../images/delivery-van.png")}
                    style={{ width: 30, height: 30, marginBottom: 3 }}
                    resizeMode="contain"
                  />
                </Animatable.View>
              </Animated.View>
            </View>

            <Text style={styles.dealSubText}>
              Premium grinding & delivery service
            </Text>
          </View>

          {/* Zigzag mini buttons */}
          <View style={styles.miniBtnContainer}>
            {[
              { text: "🌾 Free Grinding", color: "#a50d0dff" },
              { text: "🚚 Free Delivery", color: "#8b0000ff" },
            ].map((item, index) => (
              <Animatable.View
                key={index}
                animation="pulse"
                iterationCount="infinite"
                duration={1500 + index * 300}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.zigzagButton, { shadowColor: item.color }]}
                >
                  <Svg
                    height="35"
                    width="100"
                    viewBox="0 0 100 35"
                    style={styles.zigzagSvg}
                  >
                    <Path
                      d="M10,0 Q0,0 0,10 L0,25 Q0,35 10,35 L90,35 Q100,35 100,25 L100,10 Q100,0 90,0 Z"
                      fill={item.color}
                    />
                  </Svg>
                  <Text style={styles.zigzagText}>{item.text}</Text>
                </TouchableOpacity>
              </Animatable.View>
            ))}
          </View>
        </Animatable.View>

        {/* Book Van Button */}
        <View style={styles.actionsColumn}>
          <Animatable.View
            animation="bounceIn"
            delay={600}
            iterationCount="infinite"
            direction="alternate"
            duration={2500}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.venButton}
              onPress={handleBookVen}
            >
              <View style={styles.venContent}>
                <Text style={styles.venLabel}>Book Your Van →</Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </Animatable.View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  whatsappButton: {
    backgroundColor: "#25D36620",
    borderRadius: 50,
    padding: 6,
    marginRight: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
  },
  sortFilter: { flexDirection: "row", alignItems: "center" },
  filterBtn: {
    marginHorizontal: 5,
    padding: 6,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  categories: { marginVertical: 15 },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
    marginBottom: 25,
    marginTop: 15,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#ddd",
  },
  categoryText: { marginTop: 5, fontSize: 12 },
  offerCard: {
    backgroundColor: "#b8af9dff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  offerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  offerSub: { fontSize: 14, color: "#fff", marginTop: 2 },
  shopNowBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 8,
    borderRadius: 8,
  },
  shopNowText: { color: "#fff", fontWeight: "bold" },
  dealCard: {
    backgroundColor: "#f38c8cff",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  miniBtnContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  zigzagButton: {
    width: 95,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 8,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 3,
    elevation: 3,
  },
  zigzagSvg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  zigzagText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 10,
    zIndex: 1,
  },
  actionsColumn: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginLeft: 12,
  },
  venButton: {
    backgroundColor: "#0f1724",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 130,
    borderWidth: 1.5,
    borderColor: "#f6c84c",
    shadowColor: "#f6c84c",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    marginTop: 20,
    elevation: 6,
    marginBottom: 9,
  },
  venContent: { flexDirection: "row", alignItems: "center" },
  venLabel: {
    color: "#f6c84c",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  titleContainer: {
    marginBottom: 10,
    position: "relative",
    paddingVertical: 6,
    alignItems: "flex-start",
  },
  titleHighlight: {
    position: "absolute",
    top: 12,
    left: 0,
    right: 0,
    height: 14,
    borderRadius: 8,
  },
  dealTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#810d0dff",
    letterSpacing: 0.5,
    zIndex: 2,
  },
  dealSubText: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
    fontStyle: "italic",
  },
});
