import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, Stack } from 'expo-router'
import Colors from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { SQLiteProvider } from 'expo-sqlite'
import { migrateDbIfNeeded } from '@/utils/Database'

const Layout = () => {
  return (
    <SQLiteProvider databaseName='chats.db' onInit={migrateDbIfNeeded}>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="(drawer)" 
            options={{
              headerShown: false
            }} 
          />
          {/* Your other Stack.Screen components */}
        </Stack>
      </View>
    </SQLiteProvider>
  )
}

export default Layout