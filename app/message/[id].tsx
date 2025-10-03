import React, { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import AuraBackground from '@/components/AuraBackground';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Tutor {
  id: string;
  name: string;
  photoUrl: string;
}

const tutors: Tutor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    photoUrl: 'https://i.pravatar.cc/300?img=1',
  },
  {
    id: '2',
    name: 'Michael Chen',
    photoUrl: 'https://i.pravatar.cc/300?img=2',
  },
];

const initialMessages: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      text: "Hi Sarah! I saw you're interested in tutoring. What subject do you need help with?",
      isUser: false,
      timestamp: new Date(),
    },
  ],
  '2': [
    {
      id: '1',
      text: "Hi Michael! Let me know if you need help.",
      isUser: false,
      timestamp: new Date(),
    },
  ],
};

export default function MessageScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(initialMessages[id as string] || []);

  const sendMessage = () => {
    if (message.trim().length === 0) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date(),
      },
    ]);
    setMessage('');
    // Simulate tutor reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Thanks for your message! I'll get back to you shortly.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const MessageBubble = ({ item }: { item: Message }) => (
    <View style={[styles.messageRow, item.isUser && styles.userMessageRow]}>
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.tutorBubble,
        ]}
      >
        <ThemedText style={item.isUser ? styles.userMessageText : styles.tutorMessageText}>
          {item.text}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <AuraBackground>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Header with video call button */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            {tutors.find(t => t.id === id)?.name || 'Chat'}
          </ThemedText>
          <TouchableOpacity
            style={styles.videoButton}
            onPress={() => {/* TODO: Implement video call */}}
          >
            <IconSymbol size={28} name="video.fill" color="#007AFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            renderItem={({ item }) => <MessageBubble item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            inverted={false}
          />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Message"
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendMessage}
              disabled={message.trim().length === 0}
            >
              <IconSymbol
                size={24}
                name="arrow.up.circle.fill"
                color={message.trim().length === 0 ? '#ccc' : '#007AFF'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  videoButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 60, // Space for input container
  },
  messageList: {
    padding: 10,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '70%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
    marginLeft: 60,
  },
  tutorBubble: {
    backgroundColor: '#E9E9EB',
    borderBottomLeftRadius: 4,
    marginRight: 60,
  },
  userMessageText: {
    color: 'white',
    fontSize: 16,
  },
  tutorMessageText: {
    color: 'black',
    fontSize: 16,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    padding: 4,
  },
});
