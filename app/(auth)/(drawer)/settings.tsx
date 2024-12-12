import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsPage() {
  const { signOut, getToken,userId } = useAuth();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const SECRET_KEY=process.env.EXPO_PUBLIC_CLERK_SECRET_KEY

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // const token = await getToken();
              const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
                method: "DELETE",
                headers: {
                  "Authorization": `Bearer ${SECRET_KEY}`,
                  "Content-type": "application/json"
                }
              });
              
              if (response.ok) {
                await signOut();
                router.push('/');
              } else {
                Alert.alert("Error", "Failed to delete account");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong");
            }
          }
        }
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Sign Out",
          onPress: async () => {
            await signOut();
            router.push('/');
          }
        }
      ]
    );
  };

  return (
    <View style={[
      styles.container, 
      { paddingBottom: bottom }
    ]}>
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  section: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  button: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  deleteButton: {
    backgroundColor: '#fee2e2',
  },
  deleteButtonText: {
    color: '#dc2626',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#666',
  },
});