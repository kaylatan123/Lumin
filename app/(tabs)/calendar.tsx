import React, { useState } from 'react';
import AuraBackground from '@/components/AuraBackground';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import BellIcon from '@/components/BellIcon';

const { width } = Dimensions.get('window');

export default function CalendarScreen() {
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const fadeAnim = new Animated.Value(1);
  
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
      daysArray.push(
        <View key={day} style={[styles.miniDay, isToday && styles.todayMini]}>
          <Text style={[styles.miniDayText, isToday && styles.todayText]}>
            {day}
          </Text>
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
            isCurrentMonth 
              ? ['rgba(245, 240, 220, 0.9)', 'rgba(200, 215, 180, 0.8)']
              : ['rgba(255, 255, 255, 0.7)', 'rgba(245, 240, 220, 0.6)']
          }
          style={styles.miniMonthGradient}
        >
          <Text style={[styles.miniMonthTitle, isCurrentMonth && styles.currentMonthTitle]}>
            {months[monthIndex]}
          </Text>
          <View style={styles.miniDaysGrid}>
            <View style={styles.dayLabelsRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((label, index) => (
                <Text key={`${label}-${index}`} style={styles.dayLabel}>{label}</Text>
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
      daysArray.push(
        <TouchableOpacity 
          key={day} 
          style={[styles.fullDay, isToday && styles.todayFull]}
          activeOpacity={0.7}
        >
          {isToday ? (
            <LinearGradient
              colors={['rgba(255, 69, 58, 0.9)', 'rgba(255, 45, 85, 0.8)']}
              style={styles.todayCircle}
            >
              <Text style={styles.todayFullText}>{day}</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.fullDayText}>{day}</Text>
          )}
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
            colors={['rgba(200, 215, 180, 0.8)', 'rgba(180, 200, 160, 0.9)']}
            style={styles.backButtonGradient}
          >
            <Text style={styles.backButtonText}>← Back to All Months</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <LinearGradient
          colors={['rgba(245, 240, 220, 0.95)', 'rgba(200, 215, 180, 0.9)']}
          style={styles.fullMonthGradient}
        >
          <Text style={styles.fullMonthTitle}>
            {months[monthIndex]} {currentYear}
          </Text>
          
          <View style={styles.fullDayLabelsRow}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label, index) => (
              <Text key={`${label}-${index}`} style={styles.fullDayLabel}>{label}</Text>
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
              colors={['rgba(245, 240, 220, 0.9)', 'rgba(200, 215, 180, 0.8)']}
              style={styles.headerGradient}
            >
              <ThemedText type="title" style={styles.headerText}>
                Calendar {currentYear}
              </ThemedText>
              <Text style={styles.headerSubtext}>
                Tap any month to view details
              </Text>
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
  todayFullText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
