import AuraBackground from '@/components/AuraBackground';
import BellIcon from '@/components/BellIcon';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ZOOM_CONFIG } from '@/config/zoom.config';
import { useColorScheme } from '@/hooks/useColorScheme';
import { EventType, useZoom } from '@zoom/react-native-videosdk';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function CallingScreen() {
  const colorScheme = useColorScheme();
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [isInSession, setIsInSession] = useState(false);
  const zoom = useZoom();

  useEffect(() => {
    // Listen for session events
    const sessionJoinListener = zoom.addListener(EventType.onSessionJoin, async () => {
      setIsInSession(true);
    });

    const sessionLeaveListener = zoom.addListener(EventType.onSessionLeave, async () => {
      setIsInSession(false);
    });

    return () => {
      sessionJoinListener.remove();
      sessionLeaveListener.remove();
    };
  }, []);

  const joinZoomSession = async (sessionName: string, token: string) => {
    try {
      await zoom.joinSession({
        sessionName: sessionName,
        sessionPassword: '',
        token: token,
        userName: 'Student',
        sessionIdleTimeoutMins: 40,
        audioOptions: {
          connect: true,
          mute: false,
        },
        videoOptions: {
          localVideoOn: true,
        },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to join Zoom session');
      console.error('Zoom join error:', error);
    }
  };

  const leaveZoomSession = async () => {
    try {
      await zoom.leaveSession(false);
      setIsInSession(false);
    } catch (error) {
      console.error('Zoom leave error:', error);
    }
  };

  // Sample recent calls data
  const recentCalls = [
    {
      id: '1',
      name: 'Sarah Chen',
      type: 'outgoing',
      time: '2 hours ago',
      duration: '45 min',
      subject: 'Mathematics Tutoring',
      status: 'completed'
    },
    {
      id: '2', 
      name: 'Michael Rodriguez',
      type: 'incoming',
      time: 'Yesterday',
      duration: '32 min',
      subject: 'Physics Help',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Emma Wilson', 
      type: 'missed',
      time: 'Yesterday',
      duration: 'Missed',
      subject: 'English Literature',
      status: 'missed'
    },
    {
      id: '4',
      name: 'David Kim',
      type: 'outgoing', 
      time: '2 days ago',
      duration: '28 min',
      subject: 'Computer Science',
      status: 'completed'
    }
  ];

  const quickActions = [
    { id: 'schedule', title: 'Schedule Call', icon: 'calendar.badge.plus', color: '#007AFF' },
    { id: 'emergency', title: 'Emergency Help', icon: 'phone.badge.plus', color: '#FF3B30' },
    { id: 'group', title: 'Group Session', icon: 'person.3.fill', color: '#34C759' },
    { id: 'record', title: 'Voice Message', icon: 'mic.fill', color: '#FF9500' }
  ];

  const handleQuickAction = async (actionId: string) => {
    setActiveCall(actionId);
    
    // Handle emergency help - start instant Zoom call
    if (actionId === 'emergency') {
      Alert.prompt(
        'Emergency Help',
        'Enter session name to join',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Join',
            onPress: async (sessionName) => {
              if (sessionName) {
                // In production, get token from your backend API
                Alert.alert(
                  'Zoom Session',
                  'To join Zoom, you need to provide a JWT token from your backend server.\n\nSDK Key: ' + ZOOM_CONFIG.sdkKey,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        // Example of how to join when you have a token:
                        // await joinZoomSession(sessionName, 'YOUR_JWT_TOKEN_HERE');
                      }
                    }
                  ]
                );
              }
            },
          },
        ],
        'plain-text'
      );
    }
    
    // Reset active state after animation
    setTimeout(() => setActiveCall(null), 200);
  };

  const getCallIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return 'phone.arrow.down.left';
      case 'outgoing':
        return 'phone.arrow.up.right';
      case 'missed':
        return 'phone.down';
      default:
        return 'phone';
    }
  };

  const getCallColor = (type: string) => {
    switch (type) {
      case 'incoming':
        return '#34C759';
      case 'outgoing':
        return '#007AFF';
      case 'missed':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  return (
    <AuraBackground>
      <BellIcon />
      
      {/* Zoom Video View - Shows when in session */}
      {isInSession && (
        <View style={styles.zoomContainer}>
          <ZoomView style={styles.zoomView} />
          <TouchableOpacity 
            style={styles.leaveButton}
            onPress={leaveZoomSession}
          >
            <LinearGradient
              colors={['rgba(255, 59, 48, 0.9)', 'rgba(255, 45, 85, 0.9)']}
              style={styles.leaveButtonGradient}
            >
              <IconSymbol size={20} name="phone.down.fill" color="#FFF" />
              <ThemedText style={styles.leaveButtonText}>Leave Call</ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: 'transparent' }]}>
          <LinearGradient
            colors={
              colorScheme === 'dark'
                ? [
                    'rgba(124, 58, 237, 0.3)',
                    'rgba(25, 25, 112, 0.8)', 
                    'rgba(10, 10, 15, 0.9)'
                  ]
                : [
                    'rgba(124, 58, 237, 0.18)',
                    'rgba(245, 240, 220, 0.9)',
                    'rgba(200, 215, 180, 0.8)'
                  ]
            }
            style={styles.headerGradient}
            start={{ x: 0.5, y: 0.3 }}
            end={{ x: 1.2, y: 1.2 }}
          >
            <ThemedText type="title" style={styles.headerText}>
              Calling
            </ThemedText>
            <ThemedText style={styles.headerSubtext}>
              Connect with your tutors instantly
            </ThemedText>
          </LinearGradient>
        </ThemedView>

        {/* Quick Actions */}
        <ThemedView style={[styles.section, { backgroundColor: 'transparent' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[
                  styles.quickActionButton,
                  activeCall === action.id && styles.quickActionActive
                ]}
                onPress={() => handleQuickAction(action.id)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={
                    colorScheme === 'dark'
                      ? [
                          `${action.color}40`,
                          'rgba(25, 25, 112, 0.6)',
                          'rgba(10, 10, 15, 0.8)'
                        ]
                      : [
                          `${action.color}30`,
                          'rgba(255, 255, 255, 0.8)',
                          'rgba(245, 240, 220, 0.6)'
                        ]
                  }
                  style={styles.quickActionGradient}
                  start={{ x: 0.5, y: 0.5 }}
                  end={{ x: 1.1, y: 1.1 }}
                >
                  <IconSymbol size={24} name={action.icon as any} color={action.color} />
                  <ThemedText style={styles.quickActionText}>{action.title}</ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Recent Calls */}
        <ThemedView style={[styles.section, { backgroundColor: 'transparent' }]}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Calls</ThemedText>
          <View style={styles.callsList}>
            {recentCalls.map((call) => (
              <TouchableOpacity
                key={call.id}
                style={styles.callItem}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    colorScheme === 'dark'
                      ? [
                          'rgba(124, 58, 237, 0.2)',
                          'rgba(25, 25, 112, 0.4)',
                          'rgba(10, 10, 15, 0.6)'
                        ]
                      : [
                          'rgba(255, 255, 255, 0.8)',
                          'rgba(245, 240, 220, 0.6)',
                          'rgba(200, 215, 180, 0.4)'
                        ]
                  }
                  style={styles.callItemGradient}
                  start={{ x: 0.5, y: 0.3 }}
                  end={{ x: 1.1, y: 1.1 }}
                >
                  <View style={styles.callIcon}>
                    <IconSymbol 
                      size={20} 
                      name={getCallIcon(call.type) as any} 
                      color={getCallColor(call.type)} 
                    />
                  </View>
                  <View style={styles.callDetails}>
                    <ThemedText type="defaultSemiBold" style={styles.callName}>
                      {call.name}
                    </ThemedText>
                    <ThemedText style={styles.callSubject}>{call.subject}</ThemedText>
                    <ThemedText style={styles.callTime}>
                      {call.time} • {call.duration}
                    </ThemedText>
                  </View>
                  <TouchableOpacity style={styles.callBackButton}>
                    <IconSymbol size={20} name="phone.fill" color="#34C759" />
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>
      </ScrollView>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 25,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtext: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionActive: {
    transform: [{ scale: 0.95 }],
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 80,
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  callsList: {
    gap: 12,
  },
  callItem: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  callItemGradient: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  callIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  callDetails: {
    flex: 1,
  },
  callName: {
    fontSize: 16,
    marginBottom: 2,
  },
  callSubject: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 2,
  },
  callTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  callBackButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Zoom video styles
  zoomContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    backgroundColor: '#000',
  },
  zoomView: {
    flex: 1,
  },
  leaveButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  leaveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  leaveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});