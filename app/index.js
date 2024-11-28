import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  PanResponder,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function WelcomeScreen() {
  const router = useRouter();
  const translateX = useRef(new Animated.Value(0)).current;
  
  useFocusEffect(
    React.useCallback(() => {
      translateX.setValue(0); // Đặt lại giá trị về 0
    }, [])
  );

  // Xử lý vuốt
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // Di chuyển màn hình theo cử chỉ vuốt trái
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dx < -150) {
          // Vuốt trái đủ xa thì chuyển trang
          Animated.timing(translateX, {
            toValue: -500, // Rời khỏi màn hình về bên trái
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            router.push('/(tabs)');
          });
        } else {
          // Nếu vuốt không đủ xa thì trở lại vị trí ban đầu
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateX }] }]}
      {...panResponder.panHandlers}
    >
      {/* Hình nền động */}
      <LinearGradient
        colors={["#0f2027", "#203a43", "#2c5364"]}
        style={styles.animatedBackground}
      >
        <Animated.View style={styles.particleEffect} />
      </LinearGradient>

      {/* Logo và tiêu đề */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Endless Tech Store</Text>
        <Text style={styles.slogan}>Công nghệ tương lai trong tay bạn</Text>
      </View>

      {/* Banner trung tâm */}
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: "https://source.unsplash.com/random/500x300?technology",
          }}
          style={styles.banner}
        />
        <Text style={styles.bannerText}>
          Ưu đãi hấp dẫn mỗi ngày, khám phá ngay!
        </Text>
      </View>

      <TouchableOpacity style={styles.roboContainer}>
        <Image
          source={require("../assets/images/intro.png")}
          style={styles.robo}
        />
      </TouchableOpacity>

      {/* Nút hành động chính */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => router.push('/(tabs)')}
      >
        <Text style={styles.mainButtonText}>Bắt đầu khám phá</Text>
      </TouchableOpacity>

      {/* Tính năng nổi bật */}
      <View style={styles.features}>
        <View style={styles.featureCard}>
          <Feather name="shopping-cart" size={24} color="white" />
          <Text style={styles.featureText}>Mua sắm dễ dàng</Text>
        </View>
        <View style={styles.featureCard}>
          <MaterialIcons name="payment" size={24} color="white" />
          <Text style={styles.featureText}>Thanh toán nhanh chóng</Text>
        </View>
        <View style={styles.featureCard}>
          <MaterialIcons name="discount" size={24} color="white" />
          <Text style={styles.featureText}>Ưu đãi độc quyền</Text>
        </View>
        <View style={styles.featureCard}>
          <Feather name="phone-call" size={24} color="white" />
          <Text style={styles.featureText}>Hỗ trợ 24/7</Text>
        </View>
      </View>

      {/* Nút đăng nhập và đăng ký */}
      <View style={styles.authButtons}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.authButtonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.authButtonText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Bằng việc sử dụng ứng dụng, bạn đồng ý với các{" "}
          <Text style={styles.link}>Điều khoản & Chính sách</Text>.
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1f",
  },
  animatedBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  particleEffect: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(0, 255, 200, 0.15)",
    opacity: 0.8,
    top: -70,
    alignSelf: "center",
    transform: [{ scale: 1.5 }],
  },
  header: {
    alignItems: "center", // Căn giữa theo chiều ngang
    justifyContent: "center", // Căn giữa theo chiều dọc
    marginTop: 20, // Khoảng cách từ trên cùng
    paddingHorizontal: 20, // Thêm khoảng cách hai bên để nội dung không sát mép
  },
  logo: {
    width: 130, // Điều chỉnh kích thước logo
    height: 130, // Tạo khoảng cách giữa logo và tiêu đề
  },
  robo: {
    width: 200, // Điều chỉnh kích thước logo
    height: 200, // Tạo khoảng cách giữa logo và tiêu đề
  },
  roboContainer: {
    marginTop: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10, // Tạo khoảng cách giữa tiêu đề và slogan
  },
  slogan: {
    fontSize: 16,
    color: "#a9a9a9",
    textAlign: "center",
  },
  bannerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  banner: {
    width: "90%",
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#39ff14",
  },
  bannerText: {
    position: "absolute",
    bottom: 10,
    fontSize: 14,
    color: "#ffffff",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 8,
  },
  mainButton: {
    marginTop: 20,
    alignSelf: "center",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 2, // Thêm viền
    borderColor: "#0ff", // Màu viền
    backgroundColor: "transparent", // Nền trong suốt
  },
  mainButtonText: {
    fontSize: 48,
    color: "#0ff",
    fontWeight: "bold",
  },
  authButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    marginHorizontal: 50,
  },
  loginButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: "transparent",
    borderColor: "#39ff14",
    borderWidth: 1,
  },
  registerButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#39ff14",
  },
  authButtonText: {
    textAlign: "center",
    fontSize: 16,
    color: "#39ff14",
    fontWeight: "bold",
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 30,
  },
  featureCard: {
    width: 110,
    height: 110,
    backgroundColor: "#243B55",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    shadowColor: "#0ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  featureIcon: {
    width: 40,
    height: 40,
    tintColor: "#39ff14",
    marginStart: 10,
  },
  featureText: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  footerText: {
    color: "#8dc6ff",
    fontSize: 12,
    textAlign: "center",
  },
  link: {
    color: "#ff5f6d",
    textDecorationLine: "underline",
  },
});