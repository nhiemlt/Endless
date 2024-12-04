import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Tabs, useRouter } from "expo-router";
import { Avatar, Menu, Divider } from "react-native-paper";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FontAwesome } from "@expo/vector-icons";

export default function RootLayout() {
  const [menuVisible, setMenuVisible] = useState(false);

  const router = useRouter(); // Khởi tạo router

  const openMenu = () => {
    setMenuVisible(false); // Đóng menu nếu đang mở
    router.push("pages/accountSettings"); // Điều hướng tới trang accountSetting
  };
  
  const closeMenu = () => setMenuVisible(false);

  return (
    <PaperProvider>
      <Tabs
        screenOptions={{
          headerTitleAlign: "center",
          headerLeft: () => (
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.image}
            />
          ),
          headerRight: () => (
            <View style={styles.avatarContainer}>
              <Menu
                visible={menuVisible}
                onDismiss={closeMenu}
                anchor={
                  <TouchableOpacity onPress={openMenu}>
                    <FontAwesome name="bell" size={24} color="#2089dc" />
                    
                  </TouchableOpacity>
                }
                style={{ marginTop: 50 }}
              >
              </Menu>
            </View>
          ),
        }}
      >
        
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Giỏ hàng",
            tabBarIcon: ({ color }) => (
              <Ionicons name="cart" size={24} color={color}/>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Cài đặt",
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings" size={24} color={color}/>
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  avatarContainer: {
    marginRight: 10,
  },
});
