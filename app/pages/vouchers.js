import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Clipboard, ActivityIndicator } from 'react-native';
import UserVoucherService from '../(services)/api/userVoucherService';

function Voucher() {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy danh sách voucher từ UserVoucherService
  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      const response = await UserVoucherService.getUserVouchers();
      console.log("Danh sách voucher từ API:", response); // Kiểm tra dữ liệu trả về
      setVouchers(response?.length ? response : []);
      setLoading(false);
    };
    fetchVouchers();
  }, []);

  // Hàm định dạng thời gian đếm ngược cho đến khi hết hạn
  const formatCountdown = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setVouchers((prevVouchers) =>
        prevVouchers.map((voucher) => ({
          ...voucher,
          countdown: formatCountdown(voucher.endDate),
        }))
      );
    });

    return () => clearInterval(intervalId);
  }, []);

  const renderVoucherItem = ({ item }) => (
    <View style={styles.voucherCard}>
      <Text style={styles.title}>VOUCHER</Text>
      <Text style={styles.discountText}>
        Giảm đến <Text style={styles.discountLevel}>{item.discountLevel}%</Text> cho lần mua tiếp theo với tổng hóa đơn là
        <Text style={styles.discountAmount}>
          {" "}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.leastBill)}{" "}
        </Text>!
      </Text>
      <Text style={styles.maxDiscountText}>
        Giá giảm tối đa: 
        <Text>
          {" "}{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.biggestDiscount)}{" "}
        </Text>
      </Text>
      <View style={styles.voucherCodeWrapper}>
        <Text style={styles.voucherCode}>{item.voucherCode}</Text>
        <Button 
          title="Copy" 
          onPress={() => Clipboard.setString(item.voucherCode)} 
          style={styles.copyButton} 
        />
      </View>
      <View style={styles.countdownWrapper}>
        <Text style={styles.countdownText}>
          {item.countdown?.days} ngày {item.countdown?.hours} giờ {item.countdown?.minutes} phút {item.countdown?.seconds} giây
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách voucher</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : vouchers.length === 0 ? ( // Kiểm tra danh sách voucher
        <Text style={styles.noVoucherText}>Bạn không có voucher nào</Text>
      ) : (
        <FlatList
          data={vouchers}
          renderItem={renderVoucherItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  voucherCard: {
    backgroundColor: 'blue',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3, // Tạo bóng đổ cho thẻ
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  discountText: {
    color: 'white',
    marginVertical: 8,
  },
  discountLevel: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  discountAmount: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  maxDiscountText: {
    color: 'white',
    fontSize: 12,
  },
  voucherCodeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  voucherCode: {
    fontSize: 14,
    color: 'gray',
  },
  copyButton: {
    fontSize: 12,
  },
  countdownWrapper: {
    marginTop: 8,
  },
  countdownText: {
    fontSize: 12,
    color: 'white',
  },
});

export default Voucher;
