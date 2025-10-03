import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  useFonts as useDancingScript,
  DancingScript_400Regular,
} from '@expo-google-fonts/dancing-script';

import { useColorScheme } from '@/hooks/useColorScheme';
import AuraBackground from '@/components/AuraBackground';
import { RevenueCatProvider } from '@/components/RevenueCatProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  const [dancingScriptLoaded] = useDancingScript({
    DancingScript_400Regular,
  });

  if (!loaded || !dancingScriptLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <RevenueCatProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuraBackground>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </AuraBackground>
      </GestureHandlerRootView>
    </RevenueCatProvider>
  );
}
