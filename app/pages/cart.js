import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TextInput, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import CartService from '../(services)/api/CartService'; // Đảm bảo đúng đường dẫn
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const cartItems = await CartService.getCarts();
        setProducts(cartItems);
      } catch (error) {
        Alert.alert('Error', 'Failed to load cart items');
      }
    };

    fetchCartItems();
  }, []);

  const handleIncrement = async (index) => {
    const updatedProduct = { ...products[index] };
    const originalQuantity = updatedProduct.quantity;

    if (updatedProduct.quantity + 1 > updatedProduct.stock) {
      Alert.alert('Thông báo', 'Số lượng vượt quá số lượng tồn kho');
      return;
    }

    updatedProduct.quantity += 1;
    updateProductQuantity(index, updatedProduct, originalQuantity);
  };

  const handleDecrement = async (index) => {
    const updatedProduct = { ...products[index] };
    const originalQuantity = updatedProduct.quantity;

    if (updatedProduct.quantity > 1) {
      updatedProduct.quantity -= 1;
      updateProductQuantity(index, updatedProduct, originalQuantity);
    } else {
      Alert.alert('Thông báo', 'Số lượng tối thiểu là 1');
    }
  };

  const updateProductQuantity = async (index, updatedProduct, originalQuantity) => {
    try {
      const updatedProducts = [...products];
      updatedProducts[index] = updatedProduct;
      setProducts(updatedProducts);
      await CartService.updateCartQuantity(updatedProduct);
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
      updatedProduct.quantity = originalQuantity;
      const updatedProducts = [...products];
      updatedProducts[index] = updatedProduct;
      setProducts(updatedProducts);
    }
  };

  const handleRemoveItem = async (productVersionID) => {
    try {
      await CartService.deleteCartItem(productVersionID);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productVersionID !== productVersionID)
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProducts((prevSelected) => ({
      ...prevSelected,
      [product.productVersionID]: !prevSelected[product.productVersionID] ? product : undefined,
    }));
  };

  const totalAmount = () => {
    return products.reduce((total, product) => {
      return selectedProducts[product.productVersionID]
        ? total + product.discountPrice * product.quantity
        : total;
    }, 0);
  };

  const handleCheckout = () => {
    const selectedItems = Object.values(selectedProducts).filter(Boolean);
    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Bạn cần chọn ít nhất một sản phẩm để thanh toán');
      return;
    }
    navigation.navigate('Checkout', { selectedItems });
  };

  const renderProduct = ({ item, index }) => (
    <View style={styles.productContainer}>
      <TouchableOpacity onPress={() => handleSelectProduct(item)}>
        <Text style={[styles.checkbox, selectedProducts[item.productVersionID] && styles.checked]}>
          ✓
        </Text>
      </TouchableOpacity>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.productName}>{item.productName} | {item.versionName}</Text>
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
      <FlatList
        data={products}
        keyExtractor={(item) => item.productVersionID}
        renderItem={renderProduct}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Tổng tiền: {formatCurrency(totalAmount())}</Text>
        <Button
          title="Thanh toán"
          onPress={handleCheckout}
          disabled={Object.keys(selectedProducts).length === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  productContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderRadius: 3, marginRight: 10 },
  checked: { backgroundColor: 'blue', color: 'white', textAlign: 'center' },
  image: { width: 50, height: 50, borderRadius: 5 },
  infoContainer: { flex: 1, marginLeft: 10 },
  productName: { fontWeight: 'bold' },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { fontSize: 20, marginHorizontal: 10 },
  quantityInput: { borderWidth: 1, borderRadius: 5, padding: 5, textAlign: 'center', width: 50 },
  removeButton: { fontSize: 20, color: 'red', marginLeft: 10 },
  footer: { borderTopWidth: 1, paddingTop: 10, alignItems: 'center' },
  totalText: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
});

export default CartScreen;
