import { Ionicons } from "@expo/vector-icons";
import { Slot, SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store'
import { useFonts } from "expo-font";
import { useEffect } from "react";



const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key)
      if (item) {
        console.log(`${key} was used 🔐 \n`)
      } else {
        console.log('No values stored under key: ' + key)
      }
      return item
    } catch (error) {
      console.error('SecureStore get item error: ', error)
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value)
    } catch (err) {
      return
    }
  },
}

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

SplashScreen.preventAutoHideAsync();
const InitialLayout = () => {
  const [loaded,error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  })
  const router = useRouter();
  const {isLoaded, isSignedIn} = useAuth();
  const segments = useSegments();

  useEffect(()=> {
    if (error) throw error;
  },[error]);

  useEffect(()=> {
    if (loaded){
      SplashScreen.hideAsync();
    }
  },[loaded]);

  useEffect(()=>{
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';
    console.log("isAuthGroup: ", inAuthGroup);
    console.log("isSignedin: ", isSignedIn);
    if (isSignedIn && !inAuthGroup) {
      // redirect user to auth group area
      // @ts-ignore
      router.replace('/(auth)/(drawer)/(chat)/new');
    } else if (!isSignedIn && inAuthGroup){
      // kick user out 
      router.replace('/login');
    }
  },[isSignedIn])

  if (!loaded || !isLoaded){
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
          <ActivityIndicator size={'large'} color="#000"  />
      </View>
    )
  }


  return (
      <Stack>
        <Stack.Screen 
        name="index"
        options={{
          headerShown: false
          }} />
        <Stack.Screen
        name="login"
        options={{
          presentation: 'modal',
          title:'',
          headerLeft: ()=>(
            <TouchableOpacity onPress={()=>router.replace('/')}>
              <Ionicons name="close-outline" size={28} />
            </TouchableOpacity>
          )
        }} />
        <Stack.Screen name="(auth)" options={{headerShown:false}} />
    </Stack>
    )
}

const RootLayoutNav = () => {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
    <GestureHandlerRootView style={{flex:1}}>
        <InitialLayout />
    </GestureHandlerRootView>
</ClerkProvider>
  )
}

export default RootLayoutNav;
