import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MarkdownView } from 'react-native-markdown-view'; // React Native Markdown renderer

const wrappedText = (text) => {
  return text.split('\n').map((line, i) => (
    <Text key={i} style={styles.line}>
      {line}
    </Text>
  ));
};

const ChatBubble = ({ role = 'assistant', content, sources = [] }) => {
  if (!content) {
    return null;
  }

  const wrappedMessage = wrappedText(content);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={role !== 'assistant' ? styles.userTitle : styles.aiTitle}>
          {role === 'assistant' ? 'AI' : 'You'}
        </Text>
      </View>
      <View style={styles.cardContent}>
        <ScrollView>{wrappedMessage}</ScrollView>
      </View>
      {sources.length > 0 && (
        <View style={styles.cardFooter}>
          {sources.map((source, index) => (
            <View key={index} style={styles.sourceContainer}>
              <Text style={styles.sourceTitle}>{`Source ${index + 1}:`}</Text>
              <MarkdownView style={styles.sourceContent}>{source}</MarkdownView>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 5,
  },
  userTitle: {
    color: 'orange',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiTitle: {
    color: 'blue',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardContent: {
    paddingVertical: 5,
  },
  cardFooter: {
    marginTop: 10,
  },
  sourceContainer: {
    marginBottom: 10,
  },
  sourceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sourceContent: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  line: {
    fontSize: 14,
    color: 'black',
  },
});

export default ChatBubble;
