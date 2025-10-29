import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useUserStore } from '../../stores/userStore';
import { Colors } from '../../constants/colors';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { preferences } = useUserStore();
  const darkMode = preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          Event Details
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          ID: {id}
        </Text>
        <Text style={[styles.comingSoon, { color: colors.clarity }]}>
          Coming Soon
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
