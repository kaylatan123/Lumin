import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuraBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {/* Optimized static gradient for maximum performance */}
      <LinearGradient
        colors={[
          'rgba(245, 245, 220, 0.6)', // Beige
          'rgba(200, 215, 180, 0.7)', // Light green
          'rgba(180, 200, 160, 0.5)', // Soft green
          'rgba(240, 235, 215, 0.4)', // Light beige
        ]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
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
});
