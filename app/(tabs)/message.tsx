import React, { useState } from 'react';
import AuraBackground from '@/components/AuraBackground';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ScrollView,
} from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import BellIcon from '@/components/BellIcon';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function MessageScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  // AI Chat Tutor State
  const [aiMessage, setAiMessage] = useState('');
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'ai_1',
      text: "Hello! I'm your AI Study Assistant. Ask me anything about your studies, homework help, or learning strategies!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [showAiChat, setShowAiChat] = useState(false);

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

  const sendAiMessage = () => {
    if (aiMessage.trim().length === 0) return;

    const userMessage = aiMessage.trim();
    setAiMessages(prev => [
      ...prev,
      {
        id: `ai_${Date.now()}`,
        text: userMessage,
        isUser: true,
        timestamp: new Date(),
      },
    ]);
    setAiMessage('');

    // Simulate AI tutor response with intelligent replies
    setTimeout(() => {
      let aiResponse = "I'd be happy to help you with that!";
      
      const lowerMessage = userMessage.toLowerCase();
      if (lowerMessage.includes('math') || lowerMessage.includes('mathematics') || lowerMessage.includes('algebra') || lowerMessage.includes('calculus')) {
        aiResponse = "Great question about mathematics! What specific concept are you struggling with? I can help break it down step by step.";
      } else if (lowerMessage.includes('science') || lowerMessage.includes('physics') || lowerMessage.includes('chemistry') || lowerMessage.includes('biology')) {
        aiResponse = "Science is fascinating! What topic would you like to explore? I can explain concepts, help with experiments, or assist with homework.";
      } else if (lowerMessage.includes('english') || lowerMessage.includes('writing') || lowerMessage.includes('essay') || lowerMessage.includes('grammar')) {
        aiResponse = "I'd love to help with English! Whether it's grammar, essay writing, or literature analysis, I'm here to assist.";
      } else if (lowerMessage.includes('study') || lowerMessage.includes('exam') || lowerMessage.includes('test')) {
        aiResponse = "Study strategies are key to success! I can help you create study schedules, suggest memorization techniques, and provide exam prep tips.";
      } else if (lowerMessage.includes('homework') || lowerMessage.includes('assignment')) {
        aiResponse = "I'm here to help guide you through your homework! What subject or specific problem are you working on?";
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        aiResponse = "Hello! I'm your AI Study Assistant. What can I help you learn today?";
      }

      setAiMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now() + 1}`,
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }, 1500);
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

  const AIMessageBubble = ({ item }: { item: AIMessage }) => (
    <View style={[styles.messageRow, item.isUser && styles.userMessageRow]}>
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <ThemedText style={item.isUser ? styles.userMessageText : styles.aiMessageText}>
          {item.text}
        </ThemedText>
      </View>
    </View>
  );

  return (
    <AuraBackground>
      <View style={styles.container}>
        <BellIcon />
        
        {showAiChat ? (
          // Full Screen AI Chat
          <View style={styles.fullScreenAiChat}>
            <TouchableOpacity 
              style={styles.aiChatHeader}
              onPress={() => setShowAiChat(false)}
            >
              <LinearGradient
                colors={['rgba(138, 43, 226, 0.8)', 'rgba(75, 0, 130, 0.9)']}
                style={styles.aiHeaderGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.aiHeaderContent}>
                  <View style={styles.aiIconContainer}>
                    <Ionicons name="sparkles" size={24} color="#fff" />
                  </View>
                  <View style={styles.aiHeaderText}>
                    <ThemedText style={styles.aiHeaderTitle}>AI Study Assistant</ThemedText>
                    <ThemedText style={styles.aiHeaderSubtitle}>
                      Tap to minimize and return to messages
                    </ThemedText>
                  </View>
                  <Ionicons 
                    name="chevron-down" 
                    size={20} 
                    color="#fff" 
                  />
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.fullScreenAiContainer}
            >
              <ScrollView 
                style={styles.fullScreenAiMessagesList}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.fullScreenMessagesContent}
              >
                {aiMessages.map((item) => (
                  <AIMessageBubble key={item.id} item={item} />
                ))}
              </ScrollView>
              
              <View style={styles.aiInputContainer}>
                <TextInput
                  style={styles.aiInput}
                  value={aiMessage}
                  onChangeText={setAiMessage}
                  placeholder="Ask your AI tutor anything..."
                  placeholderTextColor="#999"
                  multiline
                />
                <TouchableOpacity
                  style={styles.aiSendButton}
                  onPress={sendAiMessage}
                  disabled={aiMessage.trim().length === 0}
                >
                  <LinearGradient
                    colors={aiMessage.trim().length === 0 ? ['#ccc', '#ccc'] : ['#8A2BE2', '#4B0082']}
                    style={styles.aiSendGradient}
                  >
                    <Ionicons name="send" size={16} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        ) : (
          <>
            {/* AI Chat Tutor Panel - Header Only */}
            <View style={styles.aiChatPanel}>
              <TouchableOpacity 
                style={styles.aiChatHeader}
                onPress={() => setShowAiChat(true)}
              >
                <LinearGradient
                  colors={['rgba(138, 43, 226, 0.8)', 'rgba(75, 0, 130, 0.9)']}
                  style={styles.aiHeaderGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.aiHeaderContent}>
                    <View style={styles.aiIconContainer}>
                      <Ionicons name="sparkles" size={24} color="#fff" />
                    </View>
                    <View style={styles.aiHeaderText}>
                      <ThemedText style={styles.aiHeaderTitle}>AI Study Assistant</ThemedText>
                      <ThemedText style={styles.aiHeaderSubtitle}>
                        Tap to chat with AI tutor
                      </ThemedText>
                    </View>
                    <Ionicons 
                      name="chevron-up" 
                      size={20} 
                      color="#fff" 
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Regular Messages */}
            <View style={styles.regularMessagesHeader}>
              <ThemedText style={styles.regularMessagesTitle}>Messages</ThemedText>
            </View>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.messagesContainer}
            >
              <FlatList
                data={messages}
                renderItem={({ item }) => <MessageBubble item={item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messageList}
                inverted={false}
              />
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
            </KeyboardAvoidingView>
          </>
        )}
      </View>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  // Full Screen AI Chat Styles
  fullScreenAiChat: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  fullScreenAiContainer: {
    flex: 1,
  },
  fullScreenAiMessagesList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  fullScreenMessagesContent: {
    paddingBottom: 20,
  },
  // AI Chat Panel Styles
  aiChatPanel: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aiChatHeader: {
    // No additional styles needed
  },
  aiHeaderGradient: {
    paddingHorizontal: 0,
    paddingVertical: 12,
    width: '100%',
  },
  aiHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiHeaderText: {
    flex: 1,
  },
  aiHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  aiHeaderSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  aiChatContainer: {
    maxHeight: 300,
    backgroundColor: '#f8f9fa',
  },
  aiMessagesList: {
    maxHeight: 200,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  aiInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E9E9EB',
  },
  aiInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  aiSendButton: {
    // No additional styles needed
  },
  aiSendGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiBubble: {
    backgroundColor: '#8A2BE2',
    borderBottomLeftRadius: 4,
    marginRight: 60,
    shadowColor: '#8A2BE2',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  aiMessageText: {
    color: 'white',
    fontSize: 14,
  },
  // Regular Messages Styles
  regularMessagesHeader: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9EB',
  },
  regularMessagesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messageList: {
    padding: 10,
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E9E9EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    padding: 4,
  },
});
