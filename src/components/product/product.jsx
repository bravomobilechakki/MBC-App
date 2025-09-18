import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
}
from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ProductDetails = () => {
  const navigation = useNavigation();
  const [quantities, setQuantities] = useState({});

  const products = [
    {
      id: '1', 
      name: 'Smartphone XYZ Pro',
      description:
        'Experience the next level of performance with the Smartphone XYZ Pro.',
      price: '₹49,999',
      rating: 4.5,
      image: require('../../images/flour.png'),
    },
    {
      id: '2',
      name: 'Wireless Headphones ABC',
      description:
        'Enjoy high-fidelity sound with the Wireless Headphones ABC.',
      price: '₹7,499',
      rating: 4.2, 
      image: require('../../images/flour.png'),
    },
    {
      id: '3',
      name: 'Smartwatch DEF',
      description:
        'Track your fitness and stay connected with the Smartwatch DEF.',
      price: '₹9,999',
      rating: 4.7,
      image: require('../../images/flour.png'),
    },
    {
      id: '4',
      name: 'Tablet GHI',
      description:
        'A versatile tablet for work and entertainment with vibrant display.',
      price: '₹15,999',
      rating: 4.3,
      image: require('../../images/flour.png'),
    },
    {
      id: '5',
      name: 'Speaker JKL',
      description:
        'Portable speaker with rich sound and deep bass for any occasion.',
      price: '₹3,499',
      rating: 4.1,
      image: require('../../images/flour.png'),
    },
    {
      id: '6',
      name: 'Camera MNO',
      description:
        'Capture your best moments with high-resolution and optical zoom.',
      price: '₹22,499',
      rating: 4.6,
      image: require('../../images/flour.png'),
    },
  ];

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

  const handleAddToCart = (product) => {
    console.log('Add to Cart:', product.name);
  };

  const handleBuyNow = (product) => {
    console.log('Buy Now:', product.name);
  };

  const renderItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
      <Text style={styles.price}>{item.price}</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.qtyBtn}>
          <Ionicons name="remove" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantities[item.id] || 1}</Text>
        <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.qtyBtn}>
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
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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
    justifyContent: 'center',
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

export default ProductDetails;
