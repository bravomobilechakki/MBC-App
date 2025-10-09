import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { UserContext } from '../../context/UserContext';
import SummaryApi from '../../common';

// ✅ Import Review Component
import Review from './review';

const { width } = Dimensions.get('window');

const ProductDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { product } = route.params;
  const { token } = useContext(UserContext);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
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
          quantity: quantity,
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

  const renderThumbnail = ({ item }) => (
    <TouchableOpacity onPress={() => setSelectedImage(item)}>
      <Image
        source={{ uri: item }}
        style={[
          styles.thumbnail,
          item === selectedImage ? styles.activeThumbnail : null
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <View style={styles.backHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>




        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={{ width: 24 }} /> {/* Spacer */}
      </View>

      {/* Big Image */}
      <Image source={{ uri: selectedImage }} style={styles.bigImage} />

      {/* Thumbnails */}
      <FlatList
        data={product.images}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderThumbnail}
        style={styles.thumbnailList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>{`₹${product.sellingPrice}`}</Text>
        <Text style={styles.description}>{product.description}</Text>

        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={decreaseQuantity} style={styles.qtyBtn}>
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={increaseQuantity} style={styles.qtyBtn}>
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(product)}>
            <Ionicons name="cart-outline" size={20} color="#fff" />
            <Text style={styles.cartBtnText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buyBtn}>
            <Text style={styles.buyBtnText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ✅ Review Section */}
      <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
        <Review productId={product._id} />
      </View>
    </ScrollView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  bigImage: { width: width, height: 300, resizeMode: 'cover' },
  thumbnailList: { marginVertical: 10, paddingHorizontal: 10 },
  thumbnail: { width: 70, height: 70, borderRadius: 8, marginRight: 10, borderWidth: 1, borderColor: '#ccc' },
  activeThumbnail: { borderColor: '#A98C43', borderWidth: 2 },
  infoContainer: { padding: 20 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  price: { fontSize: 20, color: 'green', marginBottom: 10 },
  description: { fontSize: 16, color: '#555', marginBottom: 20 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  qtyBtn: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 5 },
  quantityText: { marginHorizontal: 20, fontSize: 16, fontWeight: 'bold' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  cartBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#A98C43', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flex: 1, marginRight: 10, justifyContent: 'center' },
  cartBtnText: { color: '#fff', marginLeft: 8, fontSize: 16, fontWeight: '600' },
  buyBtn: { backgroundColor: '#FF6F61', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flex: 1, justifyContent: 'center', alignItems: 'center' },
  buyBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
