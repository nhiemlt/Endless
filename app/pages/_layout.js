import React, { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router"; 
import { useAuthService } from "../(services)/authService"; 

export default function AppLayout() {
  const { checkTokenValidity } = useAuthService();
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      checkTokenValidity();
    }, [])
  );

  return (
    <Stack>
      <Stack.Screen
        name="notifications"
        options={{
          title: "Thông báo",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="payment"
        options={{
          title: "Thanh toán",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="productDetail"
        options={{
          title: "Chi tiết sản phẩm",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="purchaseHistory"
        options={{
          title: "Lịch sử mua hàng",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="accountSettings"
        options={{
          title: "Cài đặt tài khoản",
          headerLeft: () => <BackButton />,
        }}
      />
      <Stack.Screen
        name="address"
        options={{
          title: "Địa chỉ",
          headerLeft: () => <BackButton />,
        }}

        
      />
      <Stack.Screen
        name="vouchers"
        options={{
          title: "Mã giảm giá",
          headerLeft: () => <BackButton />,
        }}
      />
    </Stack>
  );
}

function BackButton() {
  const router = useRouter();

  const handleGoBack = () => {
      router.push("/(tabs)");
  };

  return (
    <TouchableOpacity onPress={handleGoBack}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );
}
