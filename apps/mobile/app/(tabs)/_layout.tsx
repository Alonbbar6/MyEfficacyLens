import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { useUserStore } from '../../stores/userStore';
import { Colors } from '../../constants/colors';

export default function TabLayout() {
  const darkMode = Boolean(useUserStore((state) => state.preferences.darkMode));
  const colors = darkMode ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0074D9',
        tabBarInactiveTintColor: darkMode ? '#A0A0A0' : '#6B7280',
        tabBarStyle: {
          backgroundColor: darkMode ? '#1A1A1A' : '#FFFFFF',
          borderTopColor: darkMode ? '#3A3A3A' : '#E5E5E5',
        },
        headerStyle: {
          backgroundColor: darkMode ? '#1A1A1A' : '#FFFFFF',
        },
        headerTintColor: darkMode ? '#F5F5F5' : '#1A1A1A',
        headerTitleStyle: {
          fontWeight: 'bold' as 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="politicians"
        options={{
          title: 'Politicians',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="people" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="bills"
        options={{
          title: 'Bills',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="document-text" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: 'API Tests',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="document-text" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="calendar" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

// Simple icon component using Text (React Native component)
function TabBarIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const icons: { [key: string]: string } = {
    home: '🏠',
    people: '👥',
    'document-text': '📄',
    calendar: '📅',
  };

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: size * 0.8, color: color, textAlign: 'center' }}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
}
