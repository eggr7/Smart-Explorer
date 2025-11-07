import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

async function askOpenAI(prompt: string): Promise<string> {
  // ngrok HTTPS URL:
  const backendURL = 'https://unweighing-delana-nonvitrified.ngrok-free.dev/api/openai';
  try {
    const response = await fetch(backendURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    console.log("Raw backend response:", data);
    return data.reply ?? "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error contacting backend:", error);
    throw error;
  }
}

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hi! I am Smart Explorer. Ask me anything.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Chatbot",
          avatar: "https://placeimg.com/140/140/any"
        }
      }
    ]);
  }, []);

  const onSend = useCallback(async (msgs = []) => {
    setMessages(previous => GiftedChat.append(previous, msgs));
    const userMsg = msgs?.[0]?.text ?? "";
    if (!userMsg.trim()) return;
    setIsTyping(true);

    try {
      console.log("User message:", userMsg);
      const aiReply = await askOpenAI(userMsg);
      console.log("OpenAI reply:", aiReply);

      setMessages(previous =>
        GiftedChat.append(previous, [
          {
            _id: Date.now(),
            text: aiReply,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "Chatbot",
              avatar: "https://placeimg.com/140/140/any"
            }
          }
        ])
      );
    } catch (error) {
      setMessages(previous =>
        GiftedChat.append(previous, [
          {
            _id: Date.now(),
            text: "Sorry, there was an error processing your request.",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: "Chatbot",
              avatar: "https://placeimg.com/140/140/any"
            }
          }
        ])
      );
      console.error("Error in AI chat flow:", error);
    }
    setIsTyping(false);
  }, []);

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#007AFF",
          marginVertical: 5,
          marginRight: 10,
          maxWidth: "70%",
          borderRadius: 16
        },
        left: {
          backgroundColor: "#f0f0f0",
          marginVertical: 5,
          marginLeft: 10,
          maxWidth: "70%",
          borderRadius: 16
        }
      }}
      textStyle={{
        right: { color: "#fff", fontSize: 16 },
        left: { color: "#333", fontSize: 16 }
      }}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.chatBox}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 1 }}
          placeholder="Write your message here..."
          renderBubble={renderBubble}
          renderAvatarOnTop={true}
          renderAvatar={props =>
            props.currentMessage.user._id === 1 ? null : undefined
          }
          isTyping={isTyping}
        />
      </View>
    </View>
  );
}

const { height } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa"
  },
  chatBox: {
    width: "95%",
    minHeight: height * 0.5,
    maxHeight: height * 0.8,
    borderRadius: 24,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 }
  }
});
