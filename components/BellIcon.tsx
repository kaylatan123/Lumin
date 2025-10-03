import React, { useState } from 'react';
import { TouchableOpacity, Modal, ScrollView, View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface BellIconProps {
  notificationCount?: number;
}

export default function BellIcon({ notificationCount = 2 }: BellIconProps) {
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  return (
    <>
      <TouchableOpacity 
        style={styles.bellContainer}
        onPress={() => setShowNotificationsModal(true)}
      >
        <LinearGradient
          colors={['rgba(52, 152, 219, 0.2)', 'rgba(155, 89, 182, 0.1)']}
          style={styles.bellBackground}
        >
          <Ionicons name="notifications" size={24} color="#2c3e50" />
          {notificationCount > 0 && (
            <View style={styles.notificationBadge}>
              <ThemedText style={styles.badgeText}>
                {notificationCount > 99 ? '99+' : notificationCount.toString()}
              </ThemedText>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ThemedView style={styles.notificationsModal}>
          <View style={styles.notificationsHeader}>
            <TouchableOpacity onPress={() => setShowNotificationsModal(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
            <ThemedText type="title" style={styles.notificationsTitle}>Notifications</ThemedText>
            <View style={styles.spacer} />
          </View>
          
          <ScrollView style={styles.notificationsContent}>
            <View style={styles.notificationsContainer}>
              <View style={[styles.notificationItem, styles.unreadNotification]}>
                <LinearGradient
                  colors={['rgba(52, 152, 219, 0.1)', 'rgba(155, 89, 182, 0.05)']}
                  style={styles.notificationGradient}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons name="heart" size={20} color="#e74c3c" />
                  </View>
                  <View style={styles.notificationContent}>
                    <ThemedText type="defaultSemiBold" style={styles.notificationTitle}>
                      Sarah M. liked your profile
                    </ThemedText>
                    <ThemedText style={styles.notificationTime}>2 hours ago</ThemedText>
                  </View>
                  <View style={styles.notificationDot} />
                </LinearGradient>
              </View>
              
              <View style={[styles.notificationItem, styles.unreadNotification]}>
                <LinearGradient
                  colors={['rgba(52, 152, 219, 0.1)', 'rgba(155, 89, 182, 0.05)']}
                  style={styles.notificationGradient}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons name="school" size={20} color="#3498db" />
                  </View>
                  <View style={styles.notificationContent}>
                    <ThemedText type="defaultSemiBold" style={styles.notificationTitle}>
                      New tutoring request in Mathematics
                    </ThemedText>
                    <ThemedText style={styles.notificationTime}>4 hours ago</ThemedText>
                  </View>
                  <View style={styles.notificationDot} />
                </LinearGradient>
              </View>
              
              <View style={styles.notificationItem}>
                <LinearGradient
                  colors={['rgba(52, 152, 219, 0.05)', 'rgba(155, 89, 182, 0.02)']}
                  style={styles.notificationGradient}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons name="chatbubble" size={20} color="#95a5a6" />
                  </View>
                  <View style={styles.notificationContent}>
                    <ThemedText type="default" style={styles.notificationTitle}>
                      Alex J. sent you a message
                    </ThemedText>
                    <ThemedText style={styles.notificationTime}>1 day ago</ThemedText>
                  </View>
                </LinearGradient>
              </View>
              
              <View style={styles.notificationItem}>
                <LinearGradient
                  colors={['rgba(52, 152, 219, 0.05)', 'rgba(155, 89, 182, 0.02)']}
                  style={styles.notificationGradient}
                >
                  <View style={styles.notificationIcon}>
                    <Ionicons name="calendar" size={20} color="#95a5a6" />
                  </View>
                  <View style={styles.notificationContent}>
                    <ThemedText type="default" style={styles.notificationTitle}>
                      Your session with Emma is starting soon
                    </ThemedText>
                    <ThemedText style={styles.notificationTime}>2 days ago</ThemedText>
                  </View>
                </LinearGradient>
              </View>
            </View>
          </ScrollView>
        </ThemedView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bellContainer: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1000,
  },
  bellBackground: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  notificationsModal: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 73, 94, 0.1)',
  },
  closeButton: {
    padding: 8,
  },
  notificationsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  spacer: {
    width: 40,
  },
  notificationsContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  notificationsContainer: {
    gap: 12,
  },
  notificationItem: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  unreadNotification: {
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    position: 'relative',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    paddingRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
  },
});