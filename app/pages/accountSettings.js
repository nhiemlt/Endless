import React, { useState, useEffect } from "react";
import { Text, View, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import { Dialog, Button } from "react-native-paper"; // Import Dialog
import ProfileService from "../(services)/api/profileService";

const Account = () => {
  const [user, setUser] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    fullname: "",
    phone: "",
    email: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState(null); 
  const [visible, setVisible] = useState(false);  // State to control dialog visibility
  const [dialogMessage, setDialogMessage] = useState(''); // Store the dialog message

  const profileService = ProfileService();

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.fetchCurrentUser();
      setUser(data);
      setUpdatedData({
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
        avatar: data.avatar,
      });
    } catch (err) {
      setError("Không thể lấy thông tin người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
  
    if (!updatedData.fullname || !updatedData.phone || !updatedData.email) {
      setDialogMessage("Các trường thông tin bắt buộc không thể để trống.");
      setVisible(true);
      setLoading(false);
      return;
    }
  
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(updatedData.phone)) {
      setDialogMessage("Số điện thoại phải có 10 chữ số và bắt đầu bằng 0.");
      setVisible(true);
      setLoading(false);
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(updatedData.email)) {
      setDialogMessage("Định dạng email không hợp lệ.");
      setVisible(true);
      setLoading(false);
      return;
    }

    const updatedUserData = {
      ...updatedData,
      username: user.username, // Gửi lại username cũ
    };
  
    try {
      const response = await profileService.updateCurrentUser(updatedUserData);
      setUser(response);
      setDialogMessage("Cập nhật hồ sơ thành công.");
      setVisible(true);
    } catch (err) {
      setDialogMessage("Cập nhật hồ sơ thất bại.");
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return <Text style={styles.loadingText}>Đang tải...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        {user && (
          <>   
            <Text style={styles.title}>Hồ sơ người dùng</Text>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tên người dùng</Text>
              <TextInput
                style={styles.input}
                value={user.username}
                editable={false} // Không cho phép chỉnh sửa
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập họ và tên"
                value={updatedData.fullname}
                onChangeText={(text) => setUpdatedData({ ...updatedData, fullname: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập số điện thoại"
                value={updatedData.phone}
                onChangeText={(text) => setUpdatedData({ ...updatedData, phone: text })}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Nhập email"
                value={updatedData.email}
                onChangeText={(text) => setUpdatedData({ ...updatedData, email: text })}
              />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
              <Text style={styles.buttonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Dialog for success or error messages */}
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Thông báo</Dialog.Title>
        <Dialog.Content>
          <Text>{dialogMessage}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setVisible(false)}>Đóng</Button>
        </Dialog.Actions>
      </Dialog>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 60,
    color: "#333",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: "100%",
    maxWidth: 500,
    marginBottom: 20,
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 20,
    borderWidth: 5,
    borderColor: "gray",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 20,
  },
});

export default Account;
