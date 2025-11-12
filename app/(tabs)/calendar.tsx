import AuraBackground from '@/components/AuraBackground';
import BellIcon from '@/components/BellIcon';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Alert, Animated, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Sample scheduled meetings data
const scheduledMeetings: { [key: string]: { tutor: string; time: string; subject: string } } = {
  // Format: 'YYYY-MM-DD': meeting info
  '2025-10-15': { tutor: 'Sarah Chen', time: '2:00 PM', subject: 'Mathematics' },
  '2025-10-18': { tutor: 'Michael Rodriguez', time: '4:30 PM', subject: 'Physics' },
  '2025-10-22': { tutor: 'Emma Wilson', time: '1:00 PM', subject: 'English' },
  '2025-10-25': { tutor: 'David Kim', time: '3:15 PM', subject: 'Computer Science' },
  '2025-11-02': { tutor: 'Lisa Thompson', time: '11:00 AM', subject: 'History' },
  '2025-11-08': { tutor: 'Sarah Chen', time: '5:00 PM', subject: 'Calculus' },
  '2025-11-15': { tutor: 'Michael Rodriguez', time: '2:30 PM', subject: 'Chemistry' },
  '2025-12-03': { tutor: 'Emma Wilson', time: '10:00 AM', subject: 'Creative Writing' },
};

export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const fadeAnim = new Animated.Value(1);
  const colorScheme = useColorScheme();
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleMonthPress = (monthIndex: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => setSelectedMonth(monthIndex), 150);
  };

  const handleBackPress = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    
    setTimeout(() => setSelectedMonth(null), 150);
  };

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const hasScheduledMeeting = (day: number, month: number, year: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledMeetings[dateKey] !== undefined;
  };

  const getMeetingInfo = (day: number, month: number, year: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return scheduledMeetings[dateKey];
  };

  const showMeetingDetails = (day: number, month: number, year: number) => {
    const meetingInfo = getMeetingInfo(day, month, year);
    if (meetingInfo) {
      Alert.alert(
        `Meeting on ${months[month]} ${day}`,
        `Tutor: ${meetingInfo.tutor}\nSubject: ${meetingInfo.subject}\nTime: ${meetingInfo.time}`,
        [{ text: 'OK', style: 'default' }]
      );
    }
  };

  const renderMiniMonth = (monthIndex: number) => {
    const days = daysInMonth(monthIndex, currentYear);
    const firstDay = getFirstDayOfMonth(monthIndex, currentYear);
    const isCurrentMonth = monthIndex === currentMonth;
    
    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
    }
    
    // Add all days of the month
    for (let day = 1; day <= days; day++) {
      const isToday = isCurrentMonth && day === currentDay;
      const hasMeeting = hasScheduledMeeting(day, monthIndex, currentYear);
      
      daysArray.push(
        <View key={day} style={[styles.miniDay, isToday && styles.todayMini]}>
          {hasMeeting && (
            <View style={styles.miniStarContainer}>
              <IconSymbol size={12} name="star.fill" color="#FFD700" />
            </View>
          )}
          <ThemedText style={[styles.miniDayText, isToday && styles.todayText]}>
            {day}
          </ThemedText>
        </View>
      );
    }

    return (
      <TouchableOpacity 
        key={monthIndex}
        style={styles.miniMonthContainer}
        onPress={() => handleMonthPress(monthIndex)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={
            colorScheme === 'dark'
              ? isCurrentMonth 
                ? [
                    'rgba(124, 58, 237, 0.4)', // Stronger purple for night current month
                    'rgba(75, 0, 130, 0.7)', // Deep indigo
                    'rgba(25, 25, 112, 0.8)' // Midnight blue edge
                  ]
                : [
                    'rgba(138, 43, 226, 0.25)', // Violet for night other months
                    'rgba(15, 15, 25, 0.8)', // Dark blend
                    'rgba(10, 10, 15, 0.9)' // Very dark edge
                  ]
              : isCurrentMonth 
                ? [
                    'rgba(124, 58, 237, 0.2)', // Purple center
                    'rgba(245, 240, 220, 0.9)', // Warm beige
                    'rgba(200, 215, 180, 0.8)' // Soft green edge
                  ]
                : [
                    'rgba(196, 181, 253, 0.1)', // Light purple center
                    'rgba(255, 255, 255, 0.7)', // White
                    'rgba(245, 240, 220, 0.6)' // Beige edge
                  ]
          }
          style={[styles.miniMonthGradient, styles.radialMonth]}
          start={{ x: 0.5, y: 0.3 }}
          end={{ x: 1.1, y: 1.1 }}
        >
          <ThemedText style={[styles.miniMonthTitle, isCurrentMonth && styles.currentMonthTitle]}>
            {months[monthIndex]}
          </ThemedText>
          <View style={styles.miniDaysGrid}>
            <View style={styles.dayLabelsRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
                <ThemedText key={`${label}-${index}`} style={styles.dayLabel}>{label}</ThemedText>
              ))}
            </View>
            <View style={styles.daysContainer}>
              {daysArray}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderFullMonth = (monthIndex: number) => {
    const days = daysInMonth(monthIndex, currentYear);
    const firstDay = getFirstDayOfMonth(monthIndex, currentYear);
    const isCurrentMonth = monthIndex === currentMonth;
    
    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      daysArray.push(<View key={`empty-${i}`} style={styles.emptyFullDay} />);
    }
    
    // Add all days of the month
    for (let day = 1; day <= days; day++) {
      const isToday = isCurrentMonth && day === currentDay;
      const hasMeeting = hasScheduledMeeting(day, monthIndex, currentYear);
      const meetingInfo = getMeetingInfo(day, monthIndex, currentYear);
      
      daysArray.push(
        <TouchableOpacity 
          key={day} 
          style={[styles.fullDay, isToday && styles.todayFull]}
          activeOpacity={0.7}
          onPress={() => hasMeeting && showMeetingDetails(day, monthIndex, currentYear)}
        >
          <View style={styles.dayContentContainer}>
            {isToday ? (
              <LinearGradient
                colors={['rgba(255, 69, 58, 0.9)', 'rgba(255, 45, 85, 0.8)']}
                style={styles.todayCircle}
              >
                <ThemedText style={styles.todayFullText}>{day}</ThemedText>
              </LinearGradient>
            ) : (
              <ThemedText style={[styles.fullDayText, hasMeeting && styles.meetingDayText]}>{day}</ThemedText>
            )}
            
            {hasMeeting && (
              <View style={styles.starContainer}>
                <IconSymbol size={16} name="star.fill" color="#FFD700" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.fullMonthContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={
              colorScheme === 'dark'
                ? [
                    'rgba(124, 58, 237, 0.4)', // Stronger purple for night
                    'rgba(138, 43, 226, 0.6)', // Violet blend
                    'rgba(25, 25, 112, 0.8)' // Midnight blue edge
                  ]
                : [
                    'rgba(124, 58, 237, 0.25)', // Purple center
                    'rgba(200, 215, 180, 0.8)', // Green blend
                    'rgba(180, 200, 160, 0.9)' // Darker green edge
                  ]
            }
            style={[styles.backButtonGradient, styles.radialButton]}
            start={{ x: 0.5, y: 0.5 }}
            end={{ x: 1.2, y: 1.2 }}
          >
            <ThemedText style={styles.backButtonText}>← Back to All Months</ThemedText>
          </LinearGradient>
        </TouchableOpacity>
        
        <LinearGradient
          colors={
            colorScheme === 'dark'
              ? [
                  'rgba(124, 58, 237, 0.3)', // Purple center for night
                  'rgba(75, 0, 130, 0.8)', // Deep indigo
                  'rgba(10, 10, 15, 0.9)' // Very dark edge
                ]
              : [
                  'rgba(124, 58, 237, 0.15)', // Purple center
                  'rgba(245, 240, 220, 0.95)', // Warm beige
                  'rgba(200, 215, 180, 0.9)' // Green edge
                ]
          }
          style={[styles.fullMonthGradient, styles.radialFullMonth]}
          start={{ x: 0.5, y: 0.2 }}
          end={{ x: 1.3, y: 1.3 }}
        >
          <ThemedText style={styles.fullMonthTitle}>
            {months[monthIndex]} {currentYear}
          </ThemedText>
          
          <View style={styles.fullDayLabelsRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, index) => (
              <ThemedText key={`${label}-${index}`} style={styles.fullDayLabel}>{label}</ThemedText>
            ))}
          </View>
          
          <View style={styles.fullDaysContainer}>
            {daysArray}
          </View>
        </LinearGradient>
      </View>
    );
  };

  if (selectedMonth !== null) {
    return (
      <AuraBackground>
        <BellIcon />
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim }}>
            {renderFullMonth(selectedMonth)}
          </Animated.View>
        </ScrollView>
      </AuraBackground>
    );
  }

  return (
    <AuraBackground>
      <BellIcon />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <ThemedView style={[styles.header, { backgroundColor: 'transparent' }]}>
            <LinearGradient
              colors={
                colorScheme === 'dark'
                  ? [
                      'rgba(124, 58, 237, 0.3)', // Purple center for night
                      'rgba(25, 25, 112, 0.8)', // Midnight blue
                      'rgba(10, 10, 15, 0.9)' // Very dark edge
                    ]
                  : [
                      'rgba(124, 58, 237, 0.18)', // Purple center
                      'rgba(245, 240, 220, 0.9)', // Warm beige
                      'rgba(200, 215, 180, 0.8)' // Green edge
                    ]
              }
              style={[styles.headerGradient, styles.radialHeader]}
              start={{ x: 0.5, y: 0.3 }}
              end={{ x: 1.2, y: 1.2 }}
            >
              <ThemedText type="title" style={styles.headerText}>
                Calendar {currentYear}
              </ThemedText>
              <ThemedText style={styles.headerSubtext}>
                Tap any month to view details
              </ThemedText>
              
              {/* Legend */}
              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={styles.legendCircle} />
                  <ThemedText style={styles.legendText}>Today</ThemedText>
                </View>
                <View style={styles.legendItem}>
                  <IconSymbol size={14} name="star.fill" color="#FFD700" />
                  <ThemedText style={styles.legendText}>Meeting</ThemedText>
                </View>
              </View>
            </LinearGradient>
          </ThemedView>
          
          <View style={styles.monthsGrid}>
            {months.map((_, index) => renderMiniMonth(index))}
          </View>
        </Animated.View>
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
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  headerGradient: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  headerSubtext: {
    fontSize: 16,
    color: '#5a6c57',
    opacity: 0.8,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  miniMonthContainer: {
    width: (width - 60) / 2,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  miniMonthGradient: {
    padding: 15,
  },
  miniMonthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  currentMonthTitle: {
    color: '#d63031',
    fontSize: 17,
  },
  miniDaysGrid: {
    alignItems: 'center',
  },
  dayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
    width: '100%',
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#636e72',
    width: 20,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    width: '100%',
  },
  emptyDay: {
    width: 20,
    height: 20,
    margin: 1,
  },
  miniDay: {
    width: 20,
    height: 20,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  miniStarContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 1,
  },
  todayMini: {
    backgroundColor: 'rgba(255, 69, 58, 0.9)',
  },
  miniDayText: {
    fontSize: 10,
    color: '#2c3e50',
    fontWeight: '500',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Full month styles
  fullMonthContainer: {
    flex: 1,
  },
  backButton: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  backButtonGradient: {
    padding: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  fullMonthGradient: {
    padding: 20,
    borderRadius: 15,
    minHeight: 400,
  },
  fullMonthTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  fullDayLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  fullDayLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#636e72',
    flex: 1,
    textAlign: 'center',
  },
  fullDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  emptyFullDay: {
    width: (width - 80) / 7,
    height: 45,
    margin: 2,
  },
  fullDay: {
    width: (width - 80) / 7,
    height: 45,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  dayContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  todayFull: {
    // No additional styles needed, the gradient handles the background
  },
  todayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullDayText: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  meetingDayText: {
    color: '#d63031',
    fontWeight: 'bold',
  },
  starContainer: {
    position: 'absolute',
    top: 2,
    right: 2,
    zIndex: 1,
  },
  todayFullText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  
  // Legend styles
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 69, 58, 0.9)',
  },
  legendText: {
    fontSize: 12,
    color: '#5a6c57',
    fontWeight: '500',
  },
  // Radial gradient styles for depth effects
  radialMonth: {
    // Removed borderRadius for full coverage
  },
  radialButton: {
    borderRadius: 15, // Keep rounded for buttons only
  },
  radialFullMonth: {
    // Removed borderRadius for full coverage
  },
  radialHeader: {
    // Removed borderRadius for full coverage
  },
});
