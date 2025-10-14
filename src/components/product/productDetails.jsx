// ProductDetailsPro.js
import React, { useState, useContext, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
  Share,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import { useRoute, useNavigation } from "@react-navigation/native";
import { UserContext } from "../../context/UserContext";
import SummaryApi from "../../common";
import Review from "./review";

const { width } = Dimensions.get("window");

const ProductDetailsPro = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const { token } = useContext(UserContext);

  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0); // ← fixed

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const sellingPrice = useMemo(() => product.sellingPrice ?? 0, [product]);
  const originalPrice = useMemo(() => product.originalPrice ?? product.mrp ?? 0, [product]);
  const discountPercent = useMemo(() => {
    if (!originalPrice || originalPrice <= sellingPrice) return 0;
    return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
  }, [originalPrice, sellingPrice]);

  const toggleWishlist = () => setWishlisted((w) => !w);

  const handleAddToCart = async () => {
    if (!token) {
      Alert.alert("Login required", "Please login to add items to your cart.");
      return;
    }
    setAdding(true);
    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity }),
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert("Added", "Product added to cart successfully.");
      } else {
        Alert.alert("Error", result.message || "Failed to add to cart.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = () => {
    navigation.navigate("Address", { selectedItems: [{ product, quantity }], totalAmount: sellingPrice * quantity });
  };

  const handleShare = async () => {
    try {
      const message = `Check out this product: ${product.name}\nPrice: ₹${sellingPrice}\nLink: ${product.link ?? 'https://yourwebsite.com/product/' + product._id}`;
      await Share.share({
        message,
        title: product.name,
        url: product.link ?? 'https://yourwebsite.com/product/' + product._id,
      });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Unable to share product.");
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={22} color="#222" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
              <Ionicons name="share-social-outline" size={20} color="#222" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleWishlist} style={styles.iconBtn}>
              <Ionicons name={wishlisted ? "heart" : "heart-outline"} size={20} color={wishlisted ? "#E53935" : "#222"} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Slider */}
        <View style={styles.sliderContainer}>
          <Swiper
            autoplay={false}
            loop={false}
            index={selectedImageIndex}
            onIndexChanged={(i) => setSelectedImageIndex(i)}
            showsPagination={true}
            dotStyle={styles.dotStyle}
            activeDotStyle={styles.activeDotStyle}
            paginationStyle={styles.paginationStyle}
          >
            {product.images.map((img, i) => (
              <View key={i} style={styles.slide}>
                <Image source={{ uri: img }} style={styles.slideImage} />
              </View>
            ))}
          </Swiper>
        </View>

        {/* Small Thumbnails */}
        <View style={{ marginTop: 10, paddingHorizontal: 12 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {product.images.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedImageIndex(i)}
                style={{
                  borderWidth: selectedImageIndex === i ? 2 : 1,
                  borderColor: selectedImageIndex === i ? "#A98C43" : "#ddd",
                  marginRight: 8,
                  padding: 2,
                  borderRadius: 6,
                }}
              >
                <Image source={{ uri: img }} style={{ width: 60, height: 60, borderRadius: 5 }} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.title} numberOfLines={2}>{product.name}</Text>

          <View style={styles.rowBetween}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#fff" />
              <Text style={styles.ratingText}>{product.rating ?? "4.5"}</Text>
              <Text style={styles.reviewCount}> ({product.reviewsCount ?? 123})</Text>
            </View>
            <View style={styles.smallTags}>
              {discountPercent > 0 && (
                <View style={styles.discountTag}>
                  <Text style={styles.discountText}>{discountPercent}% off</Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.rowBetween, { marginTop: 10 }]}>
            <View>
              <View style={styles.priceRow}>
                <Text style={styles.sellingPrice}>₹{sellingPrice}</Text>
                {originalPrice > sellingPrice && <Text style={styles.originalPrice}>₹{originalPrice}</Text>}
              </View>
              {discountPercent > 0 && <Text style={styles.youSave}>You save ₹{originalPrice - sellingPrice} ({discountPercent}%)</Text>}
            </View>

            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <Ionicons name="shield-checkmark-outline" size={18} color="#2e7d32" />
                <Text style={styles.trustText}>100% Secure</Text>
              </View>
              <View style={[styles.trustItem, { marginLeft: 10 }]}>
                <Ionicons name="refresh-circle-outline" size={18} color="#666" />
                <Text style={styles.trustText}>No Return Policy</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.deliveryRow}>
            <Ionicons name="location-outline" size={18} color="#444" />
            <Text style={styles.deliveryText}>Deliver to: <Text style={{ fontWeight: "700" }}>Your city 302012</Text></Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </TouchableOpacity>

          <View style={styles.offersBox}>
            <Text style={styles.offersTitle}>Available offers</Text>
            <View style={styles.offerItem}>
              <Ionicons name="pricetag-outline" size={16} color="#A98C43" />
              <Text style={styles.offerText}>Bank Offer: 5% off on HDFC Bank cards</Text>
            </View>
            <View style={styles.offerItem}>
              <Ionicons name="pricetag-outline" size={16} color="#A98C43" />
              <Text style={styles.offerText}>Flat ₹50 off on orders above ₹1999</Text>
            </View>
          </View>

          {product.highlights && product.highlights.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Highlights</Text>
              <View style={styles.bullets}>
                {product.highlights.slice(0, 6).map((h, idx) => (
                  <View key={idx} style={styles.bulletRow}>
                    <View style={styles.dot} />
                    <Text style={styles.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Product details</Text>
          <Text style={styles.longDesc}>{product.longDescription ?? product.description}</Text>
        </View>

        <View style={styles.reviewsWrapper}>
          <Review productId={product._id} />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={styles.stickyBar}>
        <View style={styles.qtyWrapper}>
          <TouchableOpacity style={styles.qtyBtn} onPress={decrease}>
            <Ionicons name="remove" size={18} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={increase}>
            <Ionicons name="add" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} disabled={adding}>
          <Text style={styles.addBtnText}>{adding ? "Adding..." : "Add to Cart"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buyNowBtn} onPress={handleBuyNow}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsPro;

// ---- styles ----
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f4f6" },
  scrollContent: { paddingBottom: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "ios" ? 48 : 16,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconBtn: { padding: 8 },
  headerRight: { flexDirection: "row", alignItems: "center" },
  sliderContainer: {
    width: width,
    height: 400,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  slide: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  slideImage: { width: width, height: 380, resizeMode: "contain" },
  paginationStyle: { bottom: 8 },
  dotStyle: { width: 6, height: 6, borderRadius: 6, backgroundColor: "#ddd", marginHorizontal: 3 },
  activeDotStyle: { width: 8, height: 8, borderRadius: 8, backgroundColor: "#A98C43" },
  infoCard: { marginHorizontal: 12, marginTop: 12, backgroundColor: "#fff", padding: 14, borderRadius: 10, elevation: 2 },
  title: { fontSize: 20, fontWeight: "700", color: "#111", marginBottom: 6 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ratingBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#2e7d32", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  ratingText: { color: "#fff", marginLeft: 6, fontWeight: "700", fontSize: 13 },
  reviewCount: { color: "#fff", fontSize: 12, opacity: 0.9, marginLeft: 6 },
  smallTags: { flexDirection: "row", alignItems: "center" },
  discountTag: { backgroundColor: "#FFF4E5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: "#FFE8C0" },
  discountText: { color: "#A56A00", fontWeight: "700", fontSize: 12 },
  priceRow: { flexDirection: "row", alignItems: "baseline" },
  sellingPrice: { fontSize: 22, fontWeight: "800", color: "#111" },
  originalPrice: { fontSize: 14, color: "#888", textDecorationLine: "line-through", marginLeft: 8 },
  youSave: { color: "#2e7d32", marginTop: 6, fontWeight: "600" },
  trustRow: { flexDirection: "row", alignItems: "center" },
  trustItem: { flexDirection: "row", alignItems: "center" },
  trustText: { marginLeft: 6, color: "#666", fontSize: 12 },
  deliveryRow: { flexDirection: "row", alignItems: "center", marginTop: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  deliveryText: { marginLeft: 8, color: "#333", flex: 1 },
  offersBox: { marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  offersTitle: { fontWeight: "700", marginBottom: 6 },
  offerItem: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  offerText: { marginLeft: 8, color: "#444" },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginTop: 14, marginBottom: 8, color: "#111" },
  bullets: { paddingLeft: 4 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: "#000", marginTop: 8, marginRight: 10 },
  bulletText: { color: "#444", flex: 1 },
  detailsCard: { marginHorizontal: 12, marginTop: 12, backgroundColor: "#fff", padding: 14, borderRadius: 10, elevation: 2 },
  longDesc: { color: "#333", lineHeight: 20 },
  reviewsWrapper: { marginHorizontal: 12, marginTop: 12 },
  stickyBar: { position: "absolute", left: 0, right: 0, bottom: 0, backgroundColor: "#fff", paddingVertical: 10, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", borderTopColor: "#eee", borderTopWidth: 1, elevation: 10 },
  qtyWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#f3f4f6", padding: 6, borderRadius: 8 },
  qtyBtn: { backgroundColor: "#111", padding: 8, borderRadius: 6 },
  qtyText: { marginHorizontal: 10, fontWeight: "700" },
  addBtn: { marginLeft: 12, backgroundColor: "#A98C43", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  addBtnText: { color: "#fff", fontWeight: "700" },
  buyNowBtn: { marginLeft: 8, backgroundColor: "#FF6F61", paddingVertical: 12, paddingHorizontal: 14, borderRadius: 8 },
  buyNowText: { color: "#fff", fontWeight: "700"},
});
