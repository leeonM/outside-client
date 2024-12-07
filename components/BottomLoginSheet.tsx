import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Colors from '@/constants/Colors'
import { Link } from 'expo-router'
import { useOAuth } from '@clerk/clerk-expo'
import * as WebBrowser from 'expo-web-browser'
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser'

const BottomLoginSheet = () => {
    useWarmUpBrowser();

    const { bottom } = useSafeAreaInsets();
    const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });
    const { startOAuthFlow: appleAuth } = useOAuth({ strategy: "oauth_apple" });

    const onOAuthPress = async (startOAuthFlow: any) => {
        try {
            const { createdSessionId, setActive } = await startOAuthFlow();
            
            if (createdSessionId) {
                setActive!({ session: createdSessionId });
            } else {
                // User canceled or closed the OAuth flow
                console.log('OAuth flow canceled or closed');
            }
        } catch (err) {
            console.error('OAuth error:', err);
        }
    };

    return (
        <View style={[styles.container, { paddingBottom: bottom }]}>
            <TouchableOpacity 
                style={[defaultStyles.btn, styles.btnLight]}
                onPress={() => onOAuthPress(appleAuth)}
            >
                <Ionicons name="logo-apple" size={14} style={styles.btnIcon} />
                <Text style={styles.btnLightText}>Continue with Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[defaultStyles.btn, styles.btnDark]}
                onPress={() => onOAuthPress(googleAuth)}
            >
                <Ionicons name="logo-google" size={16} style={styles.btnIcon} color={'#fff'} />
                <Text style={styles.btnDarkText}>Continue with Google</Text>
            </TouchableOpacity>

            <Link href={{
                pathname: '/login',
                params: { type: 'register' }
            }} asChild style={[defaultStyles.btn, styles.btnDark]}>
                <TouchableOpacity style={[defaultStyles.btn, styles.btnOutline]}>
                    <Text style={styles.btnDarkText}>Sign up with email</Text>
                </TouchableOpacity>
            </Link>

            <Link href={{
                pathname: '/login',
                params: { type: 'login' }
            }} asChild style={[defaultStyles.btn, styles.btnDark]}>
                <TouchableOpacity style={[defaultStyles.btn, styles.btnOutline]}>
                    <Text style={styles.btnDarkText}>Login</Text>
                </TouchableOpacity>
            </Link>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#000',
        padding: 26,
        gap: 14,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    btnLight: {
        backgroundColor: '#fff'
    },
    btnIcon: {
        paddingRight: 7,
    },
    btnLightText: {
        fontSize: 20,
    },
    btnDark: {
        backgroundColor: Colors.grey
    },
    btnDarkText: {
        color: '#fff',
        fontSize: 20,
    },
    btnOutline: {
        borderWidth: 3,
        borderColor: Colors.grey
    }
})

export default BottomLoginSheet