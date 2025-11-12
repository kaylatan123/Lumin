/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';
const purple500 = '#7C3AED'; // main purple
const purple300 = '#C4B5FD'; // light purple for subtle tints

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    accentPurple: purple500,
    accentPurpleLight: purple300,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#FFFFFF', // Pure white text for night mode
    background: '#0A0A0F', // Deep midnight background
    tint: tintColorDark,
    accentPurple: purple300,
    accentPurpleLight: purple500,
    icon: '#B0B0B0', // Lighter icons for dark mode
    tabIconDefault: '#8A8A8A',
    tabIconSelected: tintColorDark,
    // Midnight theme specific colors
    cardBackground: '#1A1A24', // Dark card background
    surfaceBackground: '#141420', // Surface elements
    borderColor: '#2A2A3A', // Border elements
    overlayBackground: 'rgba(10, 10, 15, 0.9)', // Dark overlays
  },
};
