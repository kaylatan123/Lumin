import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          "rgba(245, 240, 220, 0.95)", // Warm cream beige with transparency
          "rgba(240, 235, 215, 0.9)", // Soft beige 
          "rgba(220, 225, 195, 0.85)", // Beige transitioning to green
          "rgba(200, 215, 180, 0.9)", // Light sage green
          "rgba(245, 240, 220, 0.95)", // Back to beige for smooth blend
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
      {/* Removed grain texture to eliminate rectangle appearance */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
});

export function useBottomTabOverflow() {
  return 0;
}
