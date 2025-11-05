import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

// Main chat screen component
export default function ChatScreen() {
  const [messages, setMessages] = useState([]);

  // Set initial bot welcome message when the component mounts
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hi! I am Smart Explorer. Ask me for recommendations of nearby places.',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Chatbot',
          avatar: 'https://placeimg.com/140/140/any', // Bot avatar image
        },
      },
    ]);
  }, []);

  // Handler for sending user messages
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  // Custom bubble rendering for chat messages
  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      // Adjust bubble style for user and bot messages
      wrapperStyle={{
        right: {
          backgroundColor: '#007AFF', // User bubble color (blue)
          marginVertical: 5,
          marginRight: 10,
          maxWidth: '70%', // Max bubble width
          borderRadius: 16,
        },
        left: {
          backgroundColor: '#f0f0f0', // Bot bubble color (light grey)
          marginVertical: 5,
          marginLeft: 10,
          maxWidth: '70%',
          borderRadius: 16,
        },
      }}
      textStyle={{
        right: { color: '#fff', fontSize: 16 },
        left: { color: '#333', fontSize: 16 },
      }}
    />
  );

  // Main container: centers the chat box
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
          // Optionally, hide avatar for user messages below
          renderAvatar={props =>
            props.currentMessage.user._id === 1 ? null : undefined
          }
        />
      </View>
    </View>
  );
}

// Responsive sizing for the chat box (centered)
const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center chat vertically
    alignItems: 'center',     // Center chat horizontally
    backgroundColor: '#f5f7fa', // App background color
  },
  chatBox: {
    width: '95%',
    minHeight: height * 0.5,
    maxHeight: height * 0.8,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
});

