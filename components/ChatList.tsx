import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ChatBubble from '@/components/ChatBubble'; // Make sure the path to ChatBubble is correct

const ChatList = ({ messages, data, getSources }:any) => {
  const renderItem = ({ item, index }:any) => (
    <ChatBubble
      key={item.id}
      role={item.role}
      content={item.content}
      sources={data?.length ? getSources(data, item.role, index) : []}
    />
  );

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()} // Ensure 'id' is unique
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingVertical: 10,
  },
});

export default ChatList;
