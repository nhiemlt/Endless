import { Tabs } from "expo-router";
import { Provider } from "react-redux"; // Import Provider từ react-redux
import { FontAwesome } from "@expo/vector-icons";
import store from "../app/(redux)/store"; // Đảm bảo đường dẫn đúng đến store

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      >
        
        
      </Tabs>
    </Provider>
  );
}
