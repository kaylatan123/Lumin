import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';
import { IconSymbol } from './ui/IconSymbol';

interface SwipeAnimationProps {
  type: 'right' | 'left';
  onAnimationComplete: () => void;
}

export function SwipeAnimation({ type, onAnimationComplete }: SwipeAnimationProps) {
  // Create multiple opacity values for neon effect layers
  const neonLayer1 = new Animated.Value(0);
  const neonLayer2 = new Animated.Value(0);
  const neonLayer3 = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(0.3);
  const bulbFlickerValue = new Animated.Value(1);

  useEffect(() => {
    if (type === 'right') {
      // Neon flicker and lightbulb animation
      Animated.parallel([
        // Base opacity animation
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        // Neon layer animations
        ...Array(3).fill(null).flatMap(() => [
          Animated.sequence([
            Animated.timing(neonLayer1, {
              toValue: Math.random() * 0.4 + 0.6,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(neonLayer2, {
              toValue: Math.random() * 0.4 + 0.6,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(neonLayer3, {
              toValue: Math.random() * 0.4 + 0.6,
              duration: 75,
              useNativeDriver: true,
            }),
          ]),
        ]),
        // Bulb flicker
        Animated.sequence([
          ...Array(5).fill(null).flatMap(() => [
            Animated.timing(bulbFlickerValue, {
              toValue: Math.random() * 0.4 + 0.6,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(bulbFlickerValue, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
          ]),
        ]),
        // Scale animation
        Animated.sequence([
          Animated.spring(scaleValue, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(scaleValue, {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(onAnimationComplete);
    } else {
      // Left swipe animation
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.delay(800),
          Animated.timing(opacityValue, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.spring(scaleValue, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.delay(600),
          Animated.timing(scaleValue, {
            toValue: 0.3,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(onAnimationComplete);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: opacityValue,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        {type === 'right' ? (
          <>
            <Animated.View style={{ opacity: bulbFlickerValue }}>
              <IconSymbol
                size={60}
                name="lightbulb.fill"
                color="#FFD700"
              />
            </Animated.View>
            <View style={styles.neonContainer}>
              <Animated.Text style={[styles.text, styles.illuminatingText, styles.neonBase]}>
                illuminating...
              </Animated.Text>
              <Animated.Text style={[styles.text, styles.illuminatingText, styles.neonLayer1, { opacity: neonLayer1 }]}>
                illuminating...
              </Animated.Text>
              <Animated.Text style={[styles.text, styles.illuminatingText, styles.neonLayer2, { opacity: neonLayer2 }]}>
                illuminating...
              </Animated.Text>
              <Animated.Text style={[styles.text, styles.illuminatingText, styles.neonLayer3, { opacity: neonLayer3 }]}>
                illuminating...
              </Animated.Text>
            </View>
          </>
        ) : (
          <>
            <IconSymbol
              size={60}
              name="face.smiling.fill"
              color="#FFD700"
            />
            <Text style={styles.text}>maybe next time 😉</Text>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -1,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  illuminatingText: {
    fontFamily: 'DancingScript_400Regular',
    fontSize: 32,
  },
  neonContainer: {
    position: 'relative',
  },
  neonBase: {
    color: '#fff',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  neonLayer1: {
    position: 'absolute',
    color: '#ff00ff',
    textShadowColor: '#ff00ff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    top: 20,
    left: 0,
  },
  neonLayer2: {
    position: 'absolute',
    color: '#00ffff',
    textShadowColor: '#00ffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
    top: 20,
    left: 0,
  },
  neonLayer3: {
    position: 'absolute',
    color: '#fff',
    textShadowColor: '#fff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
    top: 20,
    left: 0,
  },
});
