import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// This is a shim for web and Android where the tab bar is generally opaque.
export default function TabBarBackground() {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      {/* Layer 1: Main radial gradient */}
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? [
                "rgba(124, 58, 237, 0.25)", // Purple center for night
                "rgba(25, 25, 112, 0.8)", // Midnight blue
                "rgba(10, 10, 15, 0.9)", // Very dark
                "rgba(0, 0, 0, 0.95)", // Near black edge
              ]
            : [
                "rgba(124, 58, 237, 0.15)", // Purple center
                "rgba(245, 240, 220, 0.9)", // Warm cream beige
                "rgba(200, 215, 180, 0.85)", // Light sage green
                "rgba(240, 235, 215, 0.95)", // Soft beige edge
              ]
        }
        start={{ x: 0.3, y: 0.5 }}
        end={{ x: 1.2, y: 0.8 }}
        style={[styles.gradient, styles.radialLayer]}
      />
      
      {/* Layer 2: Secondary depth */}
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? [
                "rgba(138, 43, 226, 0.2)", // Violet for night
                "rgba(15, 15, 25, 0.5)", // Dark blend
                "transparent",
                "transparent",
              ]
            : [
                "rgba(196, 181, 253, 0.12)", // Light purple
                "rgba(220, 225, 195, 0.6)", // Beige-green blend
                "transparent",
                "transparent",
              ]
        }
        start={{ x: 0.8, y: 0.3 }}
        end={{ x: 0.2, y: 0.9 }}
        style={[styles.gradient, styles.radialSecondary]}
      />
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
  radialLayer: {
    // Removed borderRadius for full coverage
    opacity: 0.9,
  },
  radialSecondary: {
    opacity: 0.7,
  },
});

export function useBottomTabOverflow() {
  return 0;
}
