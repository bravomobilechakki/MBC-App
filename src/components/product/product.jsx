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
import { useNavigation } from '@react-navigation/native';
import SummaryApi from '../../common';
import { UserContext } from '../../context/UserContext';

const Product = () => {
  const navigation = useNavigation();
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
    <TouchableOpacity onPress={() => handleProductPress(item)}>
      <View style={styles.productCard}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating || 'N/A'}</Text>
        </View>
        <Text style={styles.price}>{`₹${item.sellingPrice}`}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => decreaseQuantity(item._id)} style={styles.qtyBtn}>
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantities[item._id] || 1}</Text>
          <TouchableOpacity onPress={() => increaseQuantity(item._id)} style={styles.qtyBtn}>
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(item)}>
            <Ionicons name="cart-outline" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuyNow(item)}>
            <Text style={styles.buyBtnText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        numColumns={2} // Display 2 products per row
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 30) / 2; // Adjust for padding and margin

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    width: CARD_WIDTH,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#555',
  },
  price: {
    fontSize: 14,
    color: '#000',
    marginVertical: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    padding: 6,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cartBtn: {
    backgroundColor: '#28a745',
    padding: 8,
    borderRadius: 5,
  },
  buyBtn: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Product;