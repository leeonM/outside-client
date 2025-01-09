import {
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { Message, Role } from "@/utils/interfaces";
import { Linking } from "react-native";
import { ActivityIndicator } from "react-native";
import renderItem from "@/components/RenderItem";
import { useSQLiteContext } from "expo-sqlite";
import { addChat, addMessage, getMessages } from "@/utils/Database";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


const ChatPage = () => {
  const { signOut } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [height, setHeight] = useState(0);
  const { bottom } = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const [chatId, setChatId] = useState<string>(id);

  useEffect(() => {
    if (id) {
      console.log("Chat ID: ", id);
      getMessages(db, parseInt(id)).then((messages) => {
        console.log("Got messages: ", id);
        setMessages(messages);
      });
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

  setIsLoading(true);

  const userMessage = {
    id: Date.now().toString(),
    content: input.trim(),
    role: "user",
  };

  let chatID;

  if (messages.length === 0) {
    const result = await addChat(db, userMessage.content);
    chatID = result.lastInsertRowId;
    setChatId(chatID.toString());
    addMessage(db, chatID, {
      id: chatID?.toString(),
      content: userMessage.content,
      role: Role.User,
    });
  }
  // @ts-ignore
  setMessages((prev) => [...prev, userMessage]);
  setInput(""); // Clear input

  try {
    const response = await fetch("https://outside-server-0kp4.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...messages, userMessage],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch result");
    }

    const data = await response.json();
    const resultText = data; 

    let partialMessage = "";
    const displaySpeed = 10; // Adjust to control the "typing" speed
    // @ts-ignore
    setMessages((prev) => [...prev, { id: "loading", content: "", role: "assistant" }]);

    for (let i = 0; i < resultText.length; i++) {
      partialMessage += resultText[i];

      // Update the UI progressively to simulate streaming
      // @ts-ignore
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          id: (Date.now() + 1).toString(),
          content: partialMessage,
          role: "assistant",
        },
      ]);

      await new Promise((resolve) => setTimeout(resolve, displaySpeed));
    }

    // Save the final response to the database
    if (chatID) {
      addMessage(db, chatID, {
        id: chatID?.toString(),
        content: resultText,
        role: Role.Bot,
      });
    }
    } catch (error) {
      console.error("Error:", error);
      // Optionally show error to user
      Alert.alert("Error", "Failed to send message, please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const ListEmptyComponent = React.useMemo(
    () => (
      <View style={styles.emptyStateContainer}>
        <Image
          source={require("@/assets/images/outsidelogotransparent.png")}
          style={styles.image}
        />
      </View>
    ),
    []
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={70}
    >
      <View style={styles.container}>
        <FlatList
          style={styles.messageContainer}
          contentContainerStyle={[
            styles.messageContent,
            !messages.length && styles.emptyContent,
          ]}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ref={flatListRef}
          ListEmptyComponent={ListEmptyComponent}
          scrollEventThrottle={16}
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
            autoscrollToTopThreshold: 10,
          }}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
        />
        <BlurView
          intensity={80}
          style={[styles.inputContainer, { paddingBottom: bottom, paddingTop: 10 }]}
          tint="extraLight"
        >
          <View style={styles.row}>
            <TextInput
              autoFocus
              placeholder={isLoading ? "Loading..." : "Enter your query"}
              style={[styles.messageInput, isLoading && styles.disabledInput]}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading || !input.trim()}
              style={[
                styles.sendButton,
                (isLoading || !input.trim()) && styles.disabledSendButton,
              ]}
            >
              <Ionicons
                name="send"
                size={20}
                color={isLoading || !input.trim() ? Colors.greyLight : Colors.grey}
              />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messageContent: {
    paddingBottom: 20,
  },
  image: {
    width: 130,
    height: 50,
    resizeMode: "cover",
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  messageInput: {
    flex: 1,
    marginHorizontal: 10,
    marginRight: 5, 
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 20,
    padding: 10,
    borderColor: Colors.greyLight,
    backgroundColor: Colors.light,
    fontSize: 20
  },
  disabledInput: {
    opacity: 0.5,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  emptyContent: {
    flexGrow: 1,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 5,
    backgroundColor: Colors.light,
  },
  disabledSendButton: {
    opacity: 0.5,
  }
});

export default ChatPage;
