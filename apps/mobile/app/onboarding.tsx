import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useUserStore } from '../stores/userStore';
import { Colors } from '../constants/colors';

export default function OnboardingScreen() {
  const router = useRouter();
  const { setLocation, completeOnboarding, preferences } = useUserStore();
  const colors = Colors.light;

  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [loading, setLoading] = useState(false);

  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to find your representatives.');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const address = geocode[0];
        await setLocation({
          zipCode: address.postalCode || '',
          city: address.city || '',
          state: address.region || '',
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        await completeOnboarding();
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your location. Please enter manually.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = async () => {
    if (!zipCode && (!city || !state)) {
      Alert.alert('Required', 'Please enter either a zip code or city and state.');
      return;
    }

    await setLocation({
      zipCode,
      city,
      state,
    });

    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Logo/Header */}
        <View style={styles.header}>
          <Text style={[styles.logo, { color: colors.clarity }]}>Efficacy</Text>
          <Text style={[styles.tagline, { color: colors.text }]}>
            Stop Doomscrolling. Start Doing.
          </Text>
        </View>

        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.title, { color: colors.text }]}>
            Welcome! Let's Get Started
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            To show you relevant politicians and bills, we need to know your location.
          </Text>
        </View>

        {/* Auto-detect Location */}
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, { backgroundColor: colors.clarity }]}
          onPress={requestLocationPermission}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Getting Location...' : '📍 Use My Current Location'}
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        </View>

        {/* Manual Entry */}
        <View style={styles.form}>
          <Text style={[styles.formLabel, { color: colors.text }]}>Enter Manually</Text>
          
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.card, 
              color: colors.text,
              borderColor: colors.border,
            }]}
            placeholder="Zip Code"
            placeholderTextColor={colors.textSecondary}
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
            maxLength={5}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border,
              }]}
              placeholder="City"
              placeholderTextColor={colors.textSecondary}
              value={city}
              onChangeText={setCity}
            />
            <TextInput
              style={[styles.input, styles.inputHalf, { 
                backgroundColor: colors.card, 
                color: colors.text,
                borderColor: colors.border,
              }]}
              placeholder="State"
              placeholderTextColor={colors.textSecondary}
              value={state}
              onChangeText={setState}
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: colors.clarity }]}
            onPress={handleManualEntry}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.clarity }]}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Note */}
        <Text style={[styles.privacyNote, { color: colors.textSecondary }]}>
          🔒 Your location is stored locally and never shared
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
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
  },
  welcomeSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButton: {
    borderWidth: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  form: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  privacyNote: {
    fontSize: 12,
    textAlign: 'center',
  },
});
