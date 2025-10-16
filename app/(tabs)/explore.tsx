import React, { useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import AuraBackground from '@/components/AuraBackground';
import { ThemedView } from '@/components/ThemedView';
import TutorCard from '@/components/TutorCard';
import BellIcon from '@/components/BellIcon';

  const tutors = [
    {
      id: '1',
      name: 'Sarah Chen',
      bio: 'Mathematics tutor with 5+ years experience. Specializing in calculus and algebra. Patient and encouraging teaching style.',
      rating: 4.8,
      photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9d5f296?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      bio: 'Physics and Chemistry expert. Making complex concepts simple and fun. Interactive learning approach.',
      rating: 4.9,
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      bio: 'English Literature and Creative Writing mentor. Helping students find your voice and improve writing skills.',
      rating: 4.7,
      photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      id: '4',
      name: 'David Kim',
      bio: 'Computer Science and Programming instructor. Full-stack development, algorithms, and data structures.',
      rating: 4.6,
      photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      bio: 'History and Social Studies teacher. Bringing the past to life with engaging stories and interactive lessons.',
      rating: 4.8,
      photoUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
    }
  ];

export default function ExploreScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipeLeft = () => {
    console.log('Swiped left (disinterest)');
    if (currentIndex < tutors.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleSwipeRight = () => {
    console.log('Swiped right (interest)');
    if (currentIndex < tutors.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleSwipeUp = () => {
    console.log('Swiped up (super like)');
    if (currentIndex < tutors.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  const handleSwipeDown = () => {
    console.log('Swiped down (save for later)');
    if (currentIndex < tutors.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  return (
    <AuraBackground>
      <ThemedView style={[styles.container, { backgroundColor: 'transparent' }]}>
        <BellIcon />
        <ThemedView style={[styles.cardContainer, { backgroundColor: 'transparent' }]}>
          {currentIndex < tutors.length && (
            <TutorCard
              key={tutors[currentIndex].id}
              tutor={tutors[currentIndex]}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
              onSwipeUp={handleSwipeUp}
              onSwipeDown={handleSwipeDown}
            />
          )}
        </ThemedView>
      </ThemedView>
    </AuraBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
});
