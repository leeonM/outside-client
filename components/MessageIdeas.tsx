import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';

const predefinedMessages = [
    {title: 'London events/places',text: 'Can you recommend some day parties, brunches, events,lounges or clubs in London'},
    {title: 'Paris events/places',text: 'Can you recommend some day parties, brunches, events,lounges or clubs in London'},
    {title: 'Dubai events/places',text: 'Can you recommend some day parties, brunches, events,lounges or clubs in London'}
]

// type so we can click and parent can send this to API
type Props = {
    onSelectCard: (message:string) => void;
}
const MessageIdeas = ({onSelectCard}: Props) => {

  return (
    <View>
      <ScrollView horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal:20, 
        gap:10,
        paddingVertical:10

    }}
      >
            {predefinedMessages.map((message,index)=>(
                <TouchableOpacity key={index} onPress={()=> onSelectCard(`${message.text}`)}
                style={styles.card}
                >
                        <Text style={{fontSize:14, fontWeight:500, color: Colors.grey}}>{message.title}</Text>
                </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.input,
        padding:14,
        borderRadius: 10,
    }
})

export default MessageIdeas