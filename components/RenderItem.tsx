import Colors from "@/constants/Colors";
import { StyleSheet, View } from "react-native";
import LinkText from "./LinkText";

const renderItem = ({ item: m }: any) => (
    <View
      style={[
        styles.messageWrapper,
        // @ts-ignore
        m.role === "user" ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          // @ts-ignore
          m.role === "user" ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        {/* @ts-ignore */}
        <LinkText text={m.content} role={m.role} />
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    messageWrapper: {
      marginVertical: 8,
      width: "100%",
    },
    messageBubble: {
      maxWidth: "100%",
      padding: 12,
      borderRadius: 20,
      elevation: 1,
    },
    userMessage: {
      alignItems: "flex-end",
    },
    assistantMessage: {
      alignItems: "flex-start",
    },
    userBubble: {
      backgroundColor: "#000",
      marginLeft: "auto",
      borderTopRightRadius: 4,
    },
    assistantBubble: {
      backgroundColor: "#F1F1F1",
      marginRight: "auto",
      borderTopLeftRadius: 4,
    },
});

export default renderItem;