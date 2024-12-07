import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export type MessageInputProps = {
    onShouldSendMessage: (message:string)=>void;
}

const MessageInput = ({onShouldSendMessage}: MessageInputProps) => {
    const [message, setMessage] = useState('');
    const {bottom} = useSafeAreaInsets();
    const expanded = useSharedValue(0);

// const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

// const expandItems = () => {

// }

// const onChangeText = (text:string) => {
//     collapseItems();
//     setMessage(text);
// }

const collapseItems = () => {

}

const onSend = () => {
    onShouldSendMessage(message)
    setMessage('')
}

  return (
    <BlurView intensity={80} style={{paddingBottom: bottom, paddingTop:10}}
    tint='extraLight'>
      <View style={styles.row}>
            {/* <AnimatedTouchableOpacity onPress={expandItems} style={[styles.roundBtn]}>
                <Ionicons name="add" size={24} color={Colors.grey} />
            </AnimatedTouchableOpacity> */}

            <TextInput autoFocus placeholder="Enter your query" style={styles.messageInput}
            multiline
            value={message}
            onChangeText={setMessage}
            onFocus={collapseItems}
            />


            {message.length > 0 ? (
            <TouchableOpacity onPress={onSend}>
            <Ionicons name="arrow-up-circle-outline" size={24} color={Colors.grey} />
       </TouchableOpacity>
            ):(
             <TouchableOpacity>
                 <FontAwesome5 name="headphones" size={24} color={Colors.grey} />
            </TouchableOpacity>
            )}
        </View>
    </BlurView>
  )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal:20,
    },
    roundBtn: {
        width:30,
        height:30,
        borderRadius: 20,
        backgroundColor: Colors.input,
        alignItems: 'center',
        justifyContent:'center'
    },
    messageInput: {
        flex:1,
        marginHorizontal: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 20,
        padding:10,
        borderColor: Colors.greyLight,
        backgroundColor: Colors.light
    }

})

export default MessageInput