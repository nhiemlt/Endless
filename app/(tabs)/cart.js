import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Fontisto from "@expo/vector-icons/Fontisto";

const Cart = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is cart file</Text>
      <Text style={styles.subtitle}>Product list:</Text>
    </View>
  );
};

export default Cart;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#f5f5f5",
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: "#333",
    },
    subtitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: "#666",
    },
    techList: {
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    techItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "90%",
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 15,
      elevation: 5,
    },
    techText: {
      fontSize: 18,
      color: "#fff",
      marginLeft: 10,
      fontWeight: "bold",
    },
  });
  