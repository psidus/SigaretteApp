import { useColorScheme } from '@/hooks/use-color-scheme'; // Assicurati che questo hook esista o usa useColorScheme di react-native
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* La Home (Mappa) deve essere la prima o chiamata 'index' */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        
        {/* La cartella Admin */}
        <Stack.Screen name="admin" options={{ headerShown: false }} />
        
        {/* Modale opzionale */}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}