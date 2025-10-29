import { View, Text, StyleSheet } from 'react-native';
import { useUserStore } from '../../stores/userStore';
import { Colors } from '../../constants/colors';

export default function BillsScreen() {
  const { preferences } = useUserStore();
  const darkMode = preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.emoji]}>📄</Text>
        <Text style={[styles.title, { color: colors.text }]}>Bills Tracker</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Track legislation that affects you
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
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
