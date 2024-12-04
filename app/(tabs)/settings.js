import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Import useRouter từ expo-router
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useDispatch } from "react-redux"; // Import useDispatch để reset Redux state
import { loginAction } from "../(redux)/authSlice"; // Import loginAction

const Settings = () => {
  const router = useRouter();
  const dispatch = useDispatch(); // Lấy dispatch từ Redux

  const handleNavigate = (page) => {
    router.push({
      pathname: `/pages/${page}`,
    });
  };

  const handleLogout = async () => {
    // Xóa token và userInfo khỏi AsyncStorage
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userInfo');

    // Reset lại thông tin người dùng trong Redux
    dispatch(loginAction({ token: '', userInfo: null }));

    // Điều hướng về trang đăng nhập
    router.push('/auth/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bạn có thể sửa cái nết của bạn tại đây</Text>
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleNavigate('accountSettings')} // Điều hướng đến trang accountSettings
        >
          <FontAwesome name="user" size={24} color="#4caf50" />
          <Text style={styles.optionText}>Tài khoản</Text>
          <FontAwesome name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => handleNavigate('purchaseHistory')} // Điều hướng đến trang notifications
        >
          <FontAwesome name="bell" size={24} color="#ff9800" />
          <Text style={styles.optionText}>Lịch sử mua hàng</Text>
          <FontAwesome name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => handleNavigate('vouchers')} // Điều hướng đến trang privacy
        >
          <FontAwesome name="lock" size={24} color="#f44336" />
          <Text style={styles.optionText}>Danh sách voucher</Text>
          <FontAwesome name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => handleNavigate('address')} // Điều hướng đến trang about
        >
          <FontAwesome name="info-circle" size={24} color="#3f51b5" />
          <Text style={styles.optionText}>Địa chỉ</Text>
          <FontAwesome name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => handleLogout()} // Điều hướng đến trang logout
        >
          <FontAwesome name="sign-out" size={24} color="#e91e63" />
          <Text style={styles.optionText}>Đăng xuất</Text>
          <FontAwesome name="angle-right" size={24} color="#999" style={styles.optionIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
    elevation: 2,
  },
  optionText: {
    flex: 1,
    fontSize: 18,
    marginLeft: 10,
    color: "#333",
  },
  optionIcon: {
    marginLeft: "auto",
  },
});
