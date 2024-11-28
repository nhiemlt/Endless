import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; 

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.section}>
        <TouchableOpacity style={styles.option}>
          <FontAwesome name="user" size={24} color="#4caf50" />
          <Text style={styles.optionText}>Account</Text>
          <FontAwesome
            name="angle-right"
            size={24}
            color="#999"
            style={styles.optionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <FontAwesome name="bell" size={24} color="#ff9800" />
          <Text style={styles.optionText}>Notifications</Text>
          <FontAwesome
            name="angle-right"
            size={24}
            color="#999"
            style={styles.optionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <FontAwesome name="lock" size={24} color="#f44336" />
          <Text style={styles.optionText}>Privacy</Text>
          <FontAwesome
            name="angle-right"
            size={24}
            color="#999"
            style={styles.optionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <FontAwesome name="info-circle" size={24} color="#3f51b5" />
          <Text style={styles.optionText}>About</Text>
          <FontAwesome
            name="angle-right"
            size={24}
            color="#999"
            style={styles.optionIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.option}>
          <FontAwesome name="sign-out" size={24} color="#e91e63" />
          <Text style={styles.optionText}>Logout</Text>
          <FontAwesome
            name="angle-right"
            size={24}
            color="#999"
            style={styles.optionIcon}
          />
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
