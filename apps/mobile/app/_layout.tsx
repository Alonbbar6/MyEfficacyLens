import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useUserStore } from '../stores/userStore';
import { StatusBar } from 'expo-status-bar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function RootLayout() {
  const loadPreferences = useUserStore((state) => state.loadPreferences);
  const darkMode = useUserStore((state) => state.preferences.darkMode);

  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: darkMode ? '#1A1A1A' : '#FFFFFF',
          },
          headerTintColor: darkMode ? '#F5F5F5' : '#1A1A1A',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen 
          name="location-setup" 
          options={{ 
            title: 'Set Your Location',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="politician/[id]" 
          options={{ 
            title: 'Politician Details',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="bill/[id]" 
          options={{ 
            title: 'Bill Details',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="event/[id]" 
          options={{ 
            title: 'Event Details',
            presentation: 'card',
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}
