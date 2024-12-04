import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const PaymentPage = () => {
  // Lấy tham số từ router
  const { items } = useLocalSearchParams();

  let selectedItems = [];
  try {
    if (!items) {
      throw new Error('Query parameter "items" is undefined or null');
    }
    const decodedItems = decodeURIComponent(items); // Decode chuỗi JSON
    selectedItems = JSON.parse(decodedItems); // Parse JSON
    console.log('Received items:', selectedItems);
  } catch (error) {
    console.error("Error parsing items:", error.message);
    Alert.alert('Error', 'Không thể tải dữ liệu sản phẩm.'); // Thông báo lỗi
    selectedItems = [];
  }
  

  // Hàm định dạng tiền tệ
  const formatCurrency = (value) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  // Tính tổng tiền
  const calculateTotal = () =>
    selectedItems.reduce((total, item) => total + item.discountPrice * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thanh toán</Text>
      {/* Hiển thị log JSON trực tiếp trên giao diện */}
      <Text style={styles.debugText}>Raw Query: {items || 'No items received'}</Text>
      <Text style={styles.debugText}>
        Debug Data: {JSON.stringify(selectedItems, null, 2)}
      </Text>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={selectedItems}
        keyExtractor={(item) => String(item.productVersionID)}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>
              {item.productName} | {item.versionName}
            </Text>
            <Text>Số lượng: {item.quantity}</Text>
            <Text>Giá: {formatCurrency(item.discountPrice)}</Text>
          </View>
        )}
      />

      {/* Tổng tiền */}
      <Text style={styles.total}>
        Tổng tiền: {formatCurrency(calculateTotal())}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  debugText: { fontSize: 12, marginBottom: 20, color: 'red', backgroundColor: '#eee', padding: 10 },
  itemContainer: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  total: { marginTop: 20, fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#444' },
});

export default PaymentPage;
