import React, { useState, useEffect } from 'react';
import CheckBox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import createCartService from '../(services)/api/CartService'; // Ensure the correct path

const CartScreen = () => {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [selectedProductIDs, setSelectedProductIDs] = useState(new Set());
  const CartService = createCartService(); // Create CartService instance

  // Format currency
  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // Fetch cart data
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartItems = await CartService.getCarts();
        setProducts(cartItems);
      } catch (error) {
        console.error('Error loading cart items:', error);
        Alert.alert('Error', 'Failed to load cart items');
      }
    };
    fetchCartItems();
  }, []);

  // Increment quantity
  const handleIncrement = (index) => {
    updateQuantity(index, products[index].quantity + 1);
  };

  // Decrement quantity
  const handleDecrement = (index) => {
    if (products[index].quantity > 1) {
      updateQuantity(index, products[index].quantity - 1);
    } else {
      Alert.alert('Thông báo', 'Số lượng tối thiểu là 1');
    }
  };

  // Update product quantity
  const updateQuantity = async (index, newQuantity) => {
    const product = { ...products[index], quantity: newQuantity };
    try {
      const updatedProducts = [...products];
      updatedProducts[index] = product;
      setProducts(updatedProducts);

      await CartService.updateCartQuantity(product);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity');
      // Revert changes if update fails
      setProducts((prevProducts) => {
        const revertedProducts = [...prevProducts];
        revertedProducts[index] = { ...prevProducts[index] };
        return revertedProducts;
      });
    }
  };

  // Remove product from cart
  const handleRemoveItem = async (productVersionID) => {
    try {
      await CartService.deleteCartItem(productVersionID);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productVersionID !== productVersionID)
      );
      setSelectedProductIDs((prevIDs) => {
        const updatedIDs = new Set(prevIDs);
        updatedIDs.delete(productVersionID);
        return updatedIDs;
      });
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  // Select or unselect product
  const handleSelectProduct = (productVersionID) => {
    setSelectedProductIDs((prevIDs) => {
      const updatedIDs = new Set(prevIDs);
      if (updatedIDs.has(productVersionID)) {
        updatedIDs.delete(productVersionID);
      } else {
        updatedIDs.add(productVersionID);
      }
      return updatedIDs;
    });
  };

  // Calculate total amount
  const totalAmount = () =>
    products.reduce(
      (total, product) =>
        selectedProductIDs.has(product.productVersionID)
          ? total + product.discountPrice * product.quantity
          : total,
      0
    );

  // Handle checkout process
  const handleCheckout = () => {
    const selectedItems = products.filter((product) =>
      selectedProductIDs.has(product.productVersionID)
    );
  
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Bạn cần chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
  
    console.log('Query to be sent:', { items: encodeURIComponent(JSON.stringify(selectedItems)) });

    router.push({
      pathname: '/pages/payment',
      query: { items: encodeURIComponent(JSON.stringify(selectedItems)) },
    });
  };  
  

  // Render each product in the cart
  const renderProduct = ({ item, index }) => (
    <View style={styles.productContainer}>
      <CheckBox
        value={selectedProductIDs.has(item.productVersionID)}
        onValueChange={() => handleSelectProduct(item.productVersionID)}
        style={styles.checkbox}
        color={selectedProductIDs.has(item.productVersionID) ? 'blue' : undefined}
      />
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>
          {item.productName} | {item.versionName}
        </Text>
        <Text>Giá: {formatCurrency(item.price)}</Text>
        <Text>Khuyến mãi: {formatCurrency(item.discountPrice)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity onPress={() => handleDecrement(index)}>
          <Text style={styles.quantityButton}>-</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.quantityInput}
          value={String(item.quantity)}
          editable={false}
        />
        <TouchableOpacity onPress={() => handleIncrement(index)}>
          <Text style={styles.quantityButton}>+</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => handleRemoveItem(item.productVersionID)}>
        <Text style={styles.removeButton}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {products.length === 0 ? (
        <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.productVersionID)}
          renderItem={renderProduct}
        />
      )}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Tổng tiền: {formatCurrency(totalAmount())}</Text>
        <Button
          title="Thanh toán"
          onPress={handleCheckout}
          disabled={selectedProductIDs.size === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  productContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderRadius: 3, marginRight: 10 },
  image: { width: 70, height: 70, borderRadius: 5 },
  infoContainer: { flex: 1, marginLeft: 10 },
  productName: { fontWeight: 'bold' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { fontSize: 20, marginHorizontal: 10 },
  quantityInput: { borderWidth: 1, borderRadius: 5, padding: 5, textAlign: 'center', width: 50 },
  removeButton: { fontSize: 20, color: 'red', marginLeft: 10 },
  footer: { borderTopWidth: 1, paddingTop: 10, alignItems: 'center', marginTop: 20 },
  totalText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  emptyText: { textAlign: 'center', fontSize: 18, color: '#555', marginTop: 20 },
});

export default CartScreen;
