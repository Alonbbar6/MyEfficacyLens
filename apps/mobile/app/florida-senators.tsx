import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchFloridaSenators, OpenStatesLegislator } from '../services/api/openStatesApi';
import { useUserStore } from '../stores/userStore';
import { Colors } from '../constants/colors';

export default function FloridaSenatorsScreen() {
  const router = useRouter();
  const { preferences } = useUserStore();
  const darkMode = preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;
  const styles = createStyles(colors);

  const [senators, setSenators] = useState<OpenStatesLegislator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSenators();
  }, []);

  const loadSenators = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching Florida senators...');
      
      const data = await fetchFloridaSenators();
      console.log('Loaded senators:', data.length);
      setSenators(data);
    } catch (err: any) {
      console.error('Error loading senators:', err);
      setError(err.message || 'Failed to load Florida senators');
    } finally {
      setLoading(false);
    }
  };

  const getPartyColor = (party: string) => {
    const normalized = party.toLowerCase();
    if (normalized.includes('democrat')) return '#2196F3';
    if (normalized.includes('republican')) return '#F44336';
    return '#9E9E9E';
  };

  const getPartyInitial = (party: string) => {
    const normalized = party.toLowerCase();
    if (normalized.includes('democrat')) return 'D';
    if (normalized.includes('republican')) return 'R';
    return party[0]?.toUpperCase() || '?';
  };

  const handleCall = (phone?: string) => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  const handleEmail = (email?: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const handleWebsite = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.clarity} />
          <Text style={styles.loadingText}>Loading Florida Senators...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error Loading Senators</Text>
          <Text style={styles.errorDetails}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadSenators}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Florida State Senators</Text>
        <Text style={styles.subtitle}>
          {senators.length} senators found
        </Text>
      </View>

      {senators.map((senator) => (
        <View key={senator.id} style={styles.card}>
          <View style={styles.cardHeader}>
            {/* Avatar or Photo */}
            <View style={styles.avatarContainer}>
              {senator.image ? (
                <Image 
                  source={{ uri: senator.image }} 
                  style={styles.photo}
                  onError={() => console.log('Image failed to load')}
                />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {senator.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </Text>
                </View>
              )}
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
              <Text style={styles.name}>{senator.name}</Text>
              <Text style={styles.position}>
                {senator.current_role?.title || 'State Senator'}
              </Text>
              <Text style={styles.district}>
                District {senator.current_role?.district}
              </Text>
            </View>

            {/* Party Badge */}
            <View style={[styles.partyBadge, { backgroundColor: getPartyColor(senator.party) }]}>
              <Text style={styles.partyText}>{getPartyInitial(senator.party)}</Text>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.contactSection}>
            {senator.capitol_voice && (
              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleCall(senator.capitol_voice)}
              >
                <Text style={styles.contactIcon}>📞</Text>
                <Text style={styles.contactLabel}>Capitol: </Text>
                <Text style={styles.contactText}>{senator.capitol_voice}</Text>
              </TouchableOpacity>
            )}

            {senator.district_voice && (
              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleCall(senator.district_voice)}
              >
                <Text style={styles.contactIcon}>📞</Text>
                <Text style={styles.contactLabel}>District: </Text>
                <Text style={styles.contactText}>{senator.district_voice}</Text>
              </TouchableOpacity>
            )}

            {senator.email && (
              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleEmail(senator.email)}
              >
                <Text style={styles.contactIcon}>✉️</Text>
                <Text style={styles.contactText}>{senator.email}</Text>
              </TouchableOpacity>
            )}

            {senator.sources && senator.sources.length > 0 && senator.sources[0]?.url && (
              <TouchableOpacity 
                style={styles.contactRow}
                onPress={() => handleWebsite(senator.sources![0].url)}
              >
                <Text style={styles.contactIcon}>🌐</Text>
                <Text style={styles.contactText}>Official Website</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Address Information */}
          {(senator.capitol_address || senator.district_address) && (
            <View style={styles.addressSection}>
              {senator.capitol_address && (
                <View style={styles.addressRow}>
                  <Text style={styles.addressLabel}>Capitol Office:</Text>
                  <Text style={styles.addressText}>{senator.capitol_address}</Text>
                </View>
              )}
              {senator.district_address && (
                <View style={styles.addressRow}>
                  <Text style={styles.addressLabel}>District Office:</Text>
                  <Text style={styles.addressText}>{senator.district_address}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    header: {
      padding: 20,
      backgroundColor: colors.clarity,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: '#FFFFFF',
      opacity: 0.9,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
    },
    errorText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.error,
      marginBottom: 8,
      textAlign: 'center',
    },
    errorDetails: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    retryButton: {
      backgroundColor: colors.clarity,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      margin: 16,
      marginTop: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    avatarContainer: {
      marginRight: 12,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.clarity,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photo: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.border,
    },
    avatarText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    cardInfo: {
      flex: 1,
      marginRight: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    position: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 2,
    },
    district: {
      fontSize: 13,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    partyBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    partyText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    contactSection: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    contactIcon: {
      fontSize: 16,
      marginRight: 8,
      width: 24,
    },
    contactLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    contactText: {
      fontSize: 13,
      color: colors.clarity,
      flex: 1,
    },
    addressSection: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    addressRow: {
      marginTop: 8,
    },
    addressLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 2,
    },
    addressText: {
      fontSize: 12,
      color: colors.text,
      lineHeight: 18,
    },
    backButton: {
      margin: 16,
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 8,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.clarity,
    },
  });
}
