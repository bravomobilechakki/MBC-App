import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import SummaryApi from '../../common';
import { UserContext } from '../../context/UserContext';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const IMAGE_HEIGHT = CARD_WIDTH * 0.75;

const Product = ({ selectedCategory }) => {
  const navigation = useNavigation();
  const route = useRoute();
  const fromFooter = route.params?.fromFooter;
  const { token } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------- Fetch Products & Wishlist -----------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = SummaryApi.getProducts.url;
        if (selectedCategory) {
          url += `?category=${selectedCategory}`;
        }
        const response = await fetch(url, {
          method: SummaryApi.getProducts.method.toUpperCase(),
        });
        const result = await response.json();
        if (result.success) setProducts(result.data.products);
        else setError(result.message || 'Failed to fetch products');
      } catch (err) {
        console.error(err);
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      if (!token) return;
      try {
        const response = await fetch(SummaryApi.getWishlist.url, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json();
        if (result.wishlist) setWishlist(result.wishlist.map(i => i.productId._id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
    fetchWishlist();
  }, [token, selectedCategory]);

  // ----------------- Toggle Wishlist (Silent) -----------------
  const toggleWishlist = async (productId) => {
    if (!token) {
      console.warn('Please login to manage wishlist.');
      return;
    }

    const isWishlisted = wishlist.includes(productId);

    try {
      const url = isWishlisted
        ? SummaryApi.removeFromWishlist.url
        : SummaryApi.addToWishlist.url;
      const method = isWishlisted ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const result = await response.json();
      if (result.message) {
        console.log(result.message);
        setWishlist((prev) =>
          isWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
      }
    } catch (err) {
      console.error('Wishlist update failed:', err);
    }
  };

  // ----------------- Cart & Product Details -----------------
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      Alert.alert('Login Required', 'Please login to add items to cart.');
      return;
    }
    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 }),
      });
      const result = await response.json();
      Alert.alert(result.success ? 'Success' : 'Error', result.message);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  // ----------------- Render Product Card -----------------
  const renderItem = ({ item }) => {
    const isWishlisted = wishlist.includes(item._id);
    return (
      <View style={styles.productCard}>
        <TouchableOpacity onPress={() => handleProductPress(item)} style={{ flexShrink: 1 }}>
          <Image source={{ uri: item.images[0] }} style={styles.image} />
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.price}>{`₹${item.sellingPrice}`}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => toggleWishlist(item._id)} style={styles.wishlistIcon}>
          <Ionicons
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={20}
            color={isWishlisted ? '#FF6F61' : '#555'}
          />
        </TouchableOpacity>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(item)}>
            <Ionicons name="cart-outline" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyBtn}>
            <Text style={styles.buyBtnText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading)
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center' }} />;
  if (error) return <Text style={{ textAlign: 'center', marginTop: 20 }}>{error}</Text>;

  return (
    <View style={{ flex: 1 }}>
      {fromFooter && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Products</Text>
        </View>
      )}

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  listContainer: { padding: CARD_MARGIN },
  row: { justifyContent: 'space-between', marginBottom: CARD_MARGIN },

  productCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    width: CARD_WIDTH,
    padding: 8,
    flexShrink: 1,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 0.2,
    borderColor: '#eee',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    borderRadius: 12,
    resizeMode: 'cover',
    backgroundColor: '#f7f7f7',
  },
  name: { fontSize: 13, fontWeight: '600', marginVertical: 4, color: '#333' },
  price: { fontSize: 13, fontWeight: 'bold', color: '#2e7d32' },

  wishlistIcon: { position: 'absolute', top: 10, right: 10 },

  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  cartBtn: {
    flex: 1,
    backgroundColor: '#A98C43',
    padding: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtn: {
    flex: 1,
    backgroundColor: '#FF6F61',
    marginLeft: 6,
    padding: 6,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});

export default Product;
