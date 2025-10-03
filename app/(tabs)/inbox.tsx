import React, { useState } from 'react';
import AuraBackground from '@/components/AuraBackground';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity, StyleSheet, FlatList, Image, View, Text, Dimensions, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import BellIcon from '@/components/BellIcon';
dayjs.extend(relativeTime);

const { width: screenWidth } = Dimensions.get('window');

const chats = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'See you at 5pm!',
    avatar: 'https://i.pravatar.cc/300?img=1',
    lastMessageTime: dayjs().subtract(2, 'hour').toDate(),
    unread: true,
    muted: false,
  },
  {
    id: '2',
    name: 'Michael Chen',
    lastMessage: 'Let me know if you need help.',
    avatar: 'https://i.pravatar.cc/300?img=2',
    lastMessageTime: dayjs().subtract(1, 'day').toDate(),
    unread: false,
    muted: false,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    lastMessage: 'Thanks for your help!',
    avatar: 'https://i.pravatar.cc/300?img=3',
    lastMessageTime: dayjs().subtract(3, 'hours').toDate(),
    unread: true,
    muted: true,
  },
  {
    id: '4',
    name: 'James Brown',
    lastMessage: 'Can we reschedule our meeting?',
    avatar: 'https://i.pravatar.cc/300?img=4',
    lastMessageTime: dayjs().subtract(2, 'days').toDate(),
    unread: false,
    muted: false,
  },
];

// Swipeable Chat Item Component
const SwipeableChat = ({ item, onPress, onToggleRead, onToggleMute, onLongPress }: any) => {
  const translateX = useSharedValue(0);
  const hapticTriggered = useSharedValue(false);

  const triggerHaptic = (type: 'light' | 'success') => {
    'worklet';
    if (type === 'light') {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
    } else {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .onUpdate((event) => {
      translateX.value = Math.max(-screenWidth * 0.25, Math.min(screenWidth * 0.25, event.translationX));

      // Ultra-simple haptic trigger
      if (Math.abs(translateX.value) > screenWidth * 0.12 && !hapticTriggered.value) {
        hapticTriggered.value = true;
        triggerHaptic('light');
      } else if (Math.abs(translateX.value) < screenWidth * 0.08) {
        hapticTriggered.value = false;
      }
    })
    .onEnd((event) => {
      const shouldCompleteAction = Math.abs(event.translationX) > screenWidth * 0.15;
      
      if (shouldCompleteAction) {
        triggerHaptic('success');
        if (event.translationX > 0) {
          runOnJS(onToggleRead)(item.id);
        } else {
          runOnJS(onToggleMute)(item.id);
        }
      }
      
      hapticTriggered.value = false;
      translateX.value = withSpring(0, { 
        damping: 20, 
        stiffness: 200,
        overshootClamping: true
      });
    });

  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onEnd(() => {
      runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light);
      runOnJS(onLongPress)(item);
    });

  const combinedGesture = Gesture.Race(panGesture, longPressGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const leftActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? Math.min(translateX.value / (screenWidth * 0.15), 1) : 0,
  }));

  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? Math.min(Math.abs(translateX.value) / (screenWidth * 0.15), 1) : 0,
  }));

  return (
    <View style={styles.swipeContainer}>
      {/* Left Action - Toggle Read Status */}
      <Animated.View style={[styles.actionContainer, styles.leftAction, leftActionStyle]}>
        <LinearGradient
          colors={
            item.unread 
              ? ['rgba(52, 199, 89, 0.9)', 'rgba(76, 217, 100, 1)']
              : ['rgba(255, 149, 0, 0.9)', 'rgba(255, 179, 64, 1)']
          }
          style={styles.actionGradient}
        >
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>
              {item.unread ? '📖' : '✉️'}
            </Text>
            <Text style={styles.actionLabel}>
              {item.unread ? 'Mark Read' : 'Mark Unread'}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Right Action - Toggle Mute */}
      <Animated.View style={[styles.actionContainer, styles.rightAction, rightActionStyle]}>
        <LinearGradient
          colors={
            item.muted
              ? ['rgba(52, 199, 89, 0.9)', 'rgba(76, 217, 100, 1)']
              : ['rgba(142, 142, 147, 0.9)', 'rgba(174, 174, 178, 1)']
          }
          style={styles.actionGradient}
        >
          <View style={styles.actionIconContainer}>
            <Text style={styles.actionIcon}>
              {item.muted ? '🔔' : '🔕'}
            </Text>
            <Text style={styles.actionLabel}>
              {item.muted ? 'Unmute' : 'Mute'}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Chat Item */}
      <GestureDetector gesture={combinedGesture}>
        <Animated.View style={[styles.chatItemWrapper, animatedStyle]}>
          <TouchableOpacity
            style={[styles.chatItem, item.unread && styles.unreadChatItem]}
            onPress={() => onPress(item)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                item.unread
                  ? ['rgba(245, 240, 220, 0.95)', 'rgba(200, 215, 180, 0.9)']
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(245, 240, 220, 0.6)']
              }
              style={styles.chatGradient}
            >
              <View style={styles.avatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              </View>
              <View style={styles.chatTextContainer}>
                <Text style={[styles.chatName, item.unread && styles.unreadText]}>
                  {item.name}
                </Text>
                <Text style={[styles.lastMessage, item.unread && styles.unreadMessageText]} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                <Text style={styles.timeAgo}>
                  {dayjs(item.lastMessageTime).fromNow()}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default function InboxScreen() {
  const router = useRouter();
  const [chatList, setChatList] = useState(chats);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChatPress = (item: any) => {
    if (isProcessing) return;
    router.push(`/message/${item.id}`);
  };

  const handleToggleRead = (chatId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setChatList(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unread: !chat.unread } : chat
    ));
    setIsProcessing(false);
  };

  const handleToggleMute = (chatId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    setChatList(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, muted: !chat.muted } : chat
    ));
    setIsProcessing(false);
  };

  const handleLongPress = (item: any) => {
    if (isProcessing) return;
    setSelectedChat(item);
    setShowOptionsModal(true);
  };

  const closeOptionsModal = () => {
    setShowOptionsModal(false);
    setSelectedChat(null);
  };

  const handleMarkAsRead = () => {
    if (selectedChat) {
      handleToggleRead(selectedChat.id);
    }
    closeOptionsModal();
  };

  const handleMuteToggle = () => {
    if (selectedChat) {
      handleToggleMute(selectedChat.id);
    }
    closeOptionsModal();
  };

  return (
    <AuraBackground>
      <BellIcon />
      <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <ThemedText type="title" style={styles.header}>Messages</ThemedText>
        <FlatList
          data={chatList}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <SwipeableChat
              item={item}
              onPress={handleChatPress}
              onToggleRead={handleToggleRead}
              onToggleMute={handleToggleMute}
              onLongPress={handleLongPress}
            />
          )}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          windowSize={2}
          initialNumToRender={3}
          updateCellsBatchingPeriod={200}
          scrollEventThrottle={32}
        />

        {/* Long Press Options Modal */}
        <Modal
          visible={showOptionsModal}
          transparent={true}
          animationType="fade"
          onRequestClose={closeOptionsModal}
        >
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              closeOptionsModal();
            }}
          >
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['rgba(245, 240, 220, 0.98)', 'rgba(200, 215, 180, 0.95)']}
                style={styles.modalGradient}
              >
                <Text style={styles.modalTitle}>
                  {selectedChat?.name}
                </Text>
                
                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={handleMarkAsRead}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionIcon}>
                    {selectedChat?.unread ? '📖' : '✉️'}
                  </Text>
                  <Text style={styles.optionText}>
                    {selectedChat?.unread ? 'Mark as Read' : 'Mark as Unread'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.modalOption}
                  onPress={handleMuteToggle}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionIcon}>
                    {selectedChat?.muted ? '🔔' : '🔕'}
                  </Text>
                  <Text style={styles.optionText}>
                    {selectedChat?.muted ? 'Unmute Notifications' : 'Mute Notifications'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.modalOption, styles.cancelOption]}
                  onPress={closeOptionsModal}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionIcon}>❌</Text>
                  <Text style={styles.optionText}>Cancel</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </Modal>
      </ThemedView>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  
  // Swipe container
  swipeContainer: {
    position: 'relative',
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  
  // Action styles (full screen coverage)
  actionContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  leftAction: {
    left: -screenWidth,
  },
  rightAction: {
    right: -screenWidth,
  },
  actionGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  actionIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  
  // Chat item wrapper
  chatItemWrapper: {
    zIndex: 2,
  },
  chatItem: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
    elevation: 1,
  },
  unreadChatItem: {
    elevation: 2,
  },
  chatGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  
  // Avatar styles
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  // Text styles
  chatTextContainer: {
    flex: 1,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#1a252f',
  },
  lastMessage: {
    fontSize: 15,
    color: '#5a6c57',
    marginBottom: 4,
    lineHeight: 20,
  },
  unreadMessageText: {
    fontWeight: '600',
    color: '#34495e',
  },
  timeAgo: {
    fontSize: 13,
    color: '#7f8c8d',
    fontWeight: '500',
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: screenWidth * 0.85,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  modalGradient: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginVertical: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
  },
  cancelOption: {
    marginTop: 10,
    backgroundColor: 'rgba(255, 69, 58, 0.2)',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
    textAlign: 'center',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
});
