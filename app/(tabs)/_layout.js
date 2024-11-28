import React, { useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Tabs } from "expo-router";
import { Avatar, Menu, Divider } from "react-native-paper";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
export default function RootLayout() {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
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
                    <Avatar.Image
                      size={40}
                      source={{
                        uri: "https://th.bing.com/th?id=OIP.xnZUcOP3x2o9ywsJPgYODQHaHg",
                      }}
                    />
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
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="cart"
          options={{
            title: "Cart",
            tabBarIcon: ({ color }) => (
              <Ionicons name="cart" size={24} color={color}/>
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
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
