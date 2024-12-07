import AnimatedIntro from "@/components/AnimatedIntro";
import BottomLoginSheet from "@/components/BottomLoginSheet";
import { SplashScreen } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  SplashScreen.preventAutoHideAsync();
  setTimeout(SplashScreen.hideAsync, 5000);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
          <AnimatedIntro />
          <BottomLoginSheet />
    </View>
  );
}
