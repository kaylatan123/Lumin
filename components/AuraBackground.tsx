import { useColorScheme } from '@/hooks/useColorScheme';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function AuraBackground({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  
  return (
    <View style={styles.container}>
      {/* Layer 1: Base radial gradient from center */}
      <LinearGradient
        colors={
          colorScheme === 'dark' 
            ? [
                'rgba(124, 58, 237, 0.3)', // Stronger purple center for night
                'rgba(75, 0, 130, 0.2)', // Deep indigo
                'rgba(10, 10, 25, 0.8)', // Dark midnight blue
                'rgba(0, 0, 0, 0.9)', // Near black edge
              ]
            : [
                'rgba(124, 58, 237, 0.15)', // Purple center
                'rgba(196, 181, 253, 0.08)', // Light purple
                'rgba(245, 245, 220, 0.4)', // Beige mid
                'rgba(240, 235, 215, 0.2)', // Light beige edge
              ]
        }
        style={[StyleSheet.absoluteFillObject, styles.radialBase]}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 1.2, y: 1.2 }}
      />
      
      {/* Layer 2: Secondary radial from top-right */}
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? [
                'rgba(138, 43, 226, 0.25)', // Violet center
                'rgba(25, 25, 112, 0.15)', // Midnight blue blend
                'rgba(10, 10, 15, 0.6)', // Very dark
                'transparent',
              ]
            : [
                'rgba(200, 215, 180, 0.6)', // Green center
                'rgba(124, 58, 237, 0.08)', // Purple blend
                'rgba(180, 200, 160, 0.3)', // Soft green
                'transparent',
              ]
        }
        style={[StyleSheet.absoluteFillObject, styles.radialSecondary]}
        start={{ x: 0.8, y: 0.1 }}
        end={{ x: 0.3, y: 0.8 }}
      />
      
      {/* Layer 3: Depth accent from bottom-left */}
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? [
                'rgba(147, 112, 219, 0.15)', // Medium orchid
                'rgba(15, 15, 25, 0.4)', // Dark blend
                'transparent',
                'transparent',
              ]
            : [
                'rgba(196, 181, 253, 0.12)', // Light purple
                'rgba(245, 245, 220, 0.25)', // Beige
                'transparent',
                'transparent',
              ]
        }
        style={[StyleSheet.absoluteFillObject, styles.radialAccent]}
        start={{ x: 0.2, y: 0.9 }}
        end={{ x: 0.7, y: 0.4 }}
      />
      
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  radialBase: {
    // Removed borderRadius to allow full screen coverage
  },
  radialSecondary: {
    opacity: 0.8,
  },
  radialAccent: {
    opacity: 0.6,
  },
});
