import { StyleSheet, Text } from "react-native";
import { Linking } from "react-native";

const LinkText = ({
    text,
    role,
  }: {
    text: string;
    role: "user" | "assistant";
  }) => {
    // Regex to match URLs, including handling parentheses
    const urlRegex = /\(?(?<url>https?:\/\/[^\s)]+)\)?/g;
    const parts = [];
    let lastIndex = 0;
    let match;
  
    while ((match = urlRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: text.slice(lastIndex, match.index),
        });
      }
  
      // Add the URL without parentheses
      const url = match.groups?.url || match[1];
      parts.push({
        type: "link",
        content: url,
      });
  
      lastIndex = match.index + match[0].length;
    }
  
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex),
      });
    }
  
    return (
      <Text
        style={[
          styles.messageText,
          role === "user" ? styles.userText : styles.assistantText,
        ]}
      >
        {parts.map((part, index) => {
          if (part.type === "link") {
            return (
              <Text
                key={index}
                style={[
                  styles.link,
                  role === "user"
                    ? { color: "#FFFFFF", textDecorationColor: "#FFFFFF" }
                    : styles.link,
                ]}
                onPress={() => Linking.openURL(part.content)}
              >
                {part.content}
              </Text>
            );
          }
          return <Text key={index}>{part.content}</Text>;
        })}
      </Text>
    );
  };

    const styles = StyleSheet.create({
        messageText: {
          fontSize: 16,
          lineHeight: 22,
        },
        userText: {
          color: "#FFFFFF",
        },
        assistantText: {
          color: "#000000",
        },
        link: {
          color: "#2196F3",
          textDecorationLine: "underline",
        },

    });

    export default LinkText;