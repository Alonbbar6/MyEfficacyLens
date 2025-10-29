import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../../stores/userStore';
import { Colors } from '../../constants/colors';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { preferences, isOnboarded } = useUserStore();
  const darkMode = preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;

  useEffect(() => {
    // Redirect to onboarding if not completed
    // Add a small delay to ensure router is ready
    const timer = setTimeout(() => {
      if (!isOnboarded) {
        router.replace('/onboarding');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isOnboarded, router]);

  const styles = createStyles(colors);

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to Efficacy</Text>
        <Text style={styles.subtitle}>
          Transform political anxiety into action
        </Text>
        {preferences.location.city && (
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>
              📍 {preferences.location.city}, {preferences.location.state}
            </Text>
          </View>
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{preferences.followedPoliticians.length}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{preferences.trackedBills.length}</Text>
          <Text style={styles.statLabel}>Tracking</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{preferences.remindedEvents.length}</Text>
          <Text style={styles.statLabel}>Events</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/politicians')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>👥</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Find Your Representatives</Text>
            <Text style={styles.actionDescription}>
              Search for local, state, and federal politicians
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/bills')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📄</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Track Bills</Text>
            <Text style={styles.actionDescription}>
              Monitor legislation that affects you
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => router.push('/events')}
        >
          <View style={styles.actionIcon}>
            <Text style={styles.actionEmoji}>📅</Text>
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Upcoming Events</Text>
            <Text style={styles.actionDescription}>
              Town halls, debates, and hearings near you
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Activity */}
      {(preferences.followedPoliticians.length > 0 || preferences.trackedBills.length > 0) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Activity</Text>
          <View style={styles.activityCard}>
            <Text style={styles.activityText}>
              You're following {preferences.followedPoliticians.length} politician(s) and 
              tracking {preferences.trackedBills.length} bill(s).
            </Text>
            <Text style={styles.activitySubtext}>
              Stay informed and make your voice count! 🗳️
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 20,
      paddingTop: 10,
    },
    greeting: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    locationBadge: {
      backgroundColor: colors.card,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      alignSelf: 'flex-start',
    },
    locationText: {
      fontSize: 14,
      color: colors.text,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.clarity,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    section: {
      paddingHorizontal: 20,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    actionCard: {
      flexDirection: 'row',
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      alignItems: 'center',
    },
    actionIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    actionEmoji: {
      fontSize: 24,
    },
    actionContent: {
      flex: 1,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    actionDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    activityCard: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.efficacy,
    },
    activityText: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    activitySubtext: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });
}
