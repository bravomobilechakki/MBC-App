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

const Product = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const fromFooter = route.params?.fromFooter;
  const { token } = useContext(UserContext);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(SummaryApi.getProducts.url, {
          method: SummaryApi.getProducts.method.toUpperCase(),
        });
        const result = await response.json();
        if (result.success) {
          setProducts(result.data.products);
        } else {
          setError(result.message || 'Failed to fetch products');
        }
      } catch (error) {
        setError('Something went wrong');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { product });
  };

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      Alert.alert('Error', 'Please login to add items to your cart.');
      return;
    }
    try {
      const response = await fetch(SummaryApi.addToCart.url, {
        method: SummaryApi.addToCart.method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: quantities[product._id] || 1,
        }),
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert('Success', 'Product added to cart successfully!');
      } else {
        Alert.alert('Error', result.message || 'Failed to add product to cart.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
      console.error(error);
    }
  };

  const handleBuyNow = (product) => {
    console.log('Buy Now:', product.name);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <TouchableOpacity onPress={() => handleProductPress(item)} style={{ flexShrink: 1 }}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
          {item.name}
        </Text>
        <Text style={styles.price}>{`₹${item.sellingPrice}`}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || 'N/A'}</Text>
        </View>
      </TouchableOpacity>

      {/* Quantity Selector */}
      {/* <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(item._id)} style={styles.qtyBtn}>
          <Ionicons name="remove" size={16} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantities[item._id] || 1}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item._id)} style={styles.qtyBtn}>
          <Ionicons name="add" size={16} color="#fff" />
        </TouchableOpacity>
      </View> */}

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(item)}>
          <Ionicons name="cart-outline" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuyNow(item)}>
          <Text style={styles.buyBtnText}>Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
    // Subtle gradient shadow effect
    backgroundColor: '#fefefe',
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

  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { marginLeft: 4, fontSize: 10, color: '#555' },

  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    alignItems: 'center',
  },
  qtyBtn: {
    width: 26,
    height: 26,
    backgroundColor: '#A98C43',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 6,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 22,
  },

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
