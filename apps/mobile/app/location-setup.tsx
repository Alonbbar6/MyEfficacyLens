import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useUserStore } from '../stores/userStore';
import { Colors } from '../constants/colors';
import { processLocationInput } from '../services/api/geocodingApi';
import { UserLocation } from '../types';

export default function LocationSetupScreen() {
  const router = useRouter();
  const { preferences, setLocation, completeOnboarding } = useUserStore();
  const darkMode = preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;
  const styles = createStyles(colors);

  const [locationInput, setLocationInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectedLocation, setDetectedLocation] = useState<UserLocation | null>(null);

  const handleProcessLocation = async () => {
    if (!locationInput.trim()) {
      setError('Please enter a location');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('Processing location:', locationInput);
      const location = await processLocationInput(locationInput);
      
      setDetectedLocation(location);
      setError('');
    } catch (err: any) {
      console.error('Location processing error:', err);
      setError(err.message || 'Failed to process location. Please try again.');
      setDetectedLocation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    if (!detectedLocation) {
      setError('Please process your location first');
      return;
    }

    try {
      setLoading(true);
      await setLocation(detectedLocation);
      await completeOnboarding();
      
      // Navigate to politicians screen
      router.replace('/(tabs)/politicians');
    } catch (err: any) {
      setError('Failed to save location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Set a default location (Washington DC)
    const defaultLocation: UserLocation = {
      city: 'Washington',
      state: 'District of Columbia',
      stateCode: 'DC',
      zipCode: '20500',
      formattedAddress: 'Washington, DC 20500',
    };
    
    await setLocation(defaultLocation);
    await completeOnboarding();
    router.replace('/(tabs)/politicians');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Location</Text>
          <Text style={styles.subtitle}>
            Enter your address, city, or zip code to find politicians in your area
          </Text>
        </View>

        {/* Location Input */}
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="Enter your address, city, or zip code"
            placeholderTextColor={colors.textSecondary}
            value={locationInput}
            onChangeText={setLocationInput}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleProcessLocation}
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleProcessLocation}
            disabled={loading || !locationInput.trim()}
          >
            {loading && !detectedLocation ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Find My Location</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Examples */}
        <View style={styles.examplesSection}>
          <Text style={styles.examplesTitle}>Examples:</Text>
          <TouchableOpacity onPress={() => setLocationInput('Miami, FL')}>
            <Text style={styles.exampleText}>• Miami, FL</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLocationInput('33101')}>
            <Text style={styles.exampleText}>• 33101</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLocationInput('123 Main St, Miami, FL 33101')}>
            <Text style={styles.exampleText}>• 123 Main St, Miami, FL 33101</Text>
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Detected Location */}
        {detectedLocation && (
          <View style={styles.detectedSection}>
            <Text style={styles.detectedTitle}>✓ Location Found</Text>
            
            <View style={styles.detectedInfo}>
              <Text style={styles.detectedLabel}>Address:</Text>
              <Text style={styles.detectedValue}>
                {detectedLocation.formattedAddress}
              </Text>
            </View>

            {detectedLocation.city && (
              <View style={styles.detectedInfo}>
                <Text style={styles.detectedLabel}>City:</Text>
                <Text style={styles.detectedValue}>{detectedLocation.city}</Text>
              </View>
            )}

            {detectedLocation.stateCode && (
              <View style={styles.detectedInfo}>
                <Text style={styles.detectedLabel}>State:</Text>
                <Text style={styles.detectedValue}>
                  {detectedLocation.state} ({detectedLocation.stateCode})
                </Text>
              </View>
            )}

            {detectedLocation.zipCode && (
              <View style={styles.detectedInfo}>
                <Text style={styles.detectedLabel}>Zip Code:</Text>
                <Text style={styles.detectedValue}>{detectedLocation.zipCode}</Text>
              </View>
            )}

            {detectedLocation.congressionalDistrict && (
              <View style={styles.detectedInfo}>
                <Text style={styles.detectedLabel}>Congressional District:</Text>
                <Text style={styles.detectedValue}>
                  {detectedLocation.congressionalDistrict}
                </Text>
              </View>
            )}

            {detectedLocation.stateSenateDistrict && (
              <View style={styles.detectedInfo}>
                <Text style={styles.detectedLabel}>State Senate District:</Text>
                <Text style={styles.detectedValue}>
                  District {detectedLocation.stateSenateDistrict}
                </Text>
              </View>
            )}

            {detectedLocation.stateHouseDistrict && (
              <View style={styles.detectedInfo}>
                <Text style={styles.detectedLabel}>State House District:</Text>
                <Text style={styles.detectedValue}>
                  District {detectedLocation.stateHouseDistrict}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveLocation}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Save & Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for now (Use DC as default)</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 20,
      paddingTop: 60,
    },
    header: {
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
    },
    inputSection: {
      marginBottom: 24,
    },
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      marginBottom: 12,
    },
    button: {
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 52,
    },
    primaryButton: {
      backgroundColor: colors.clarity,
    },
    saveButton: {
      backgroundColor: colors.clarity,
      marginTop: 16,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    examplesSection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    examplesTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    exampleText: {
      fontSize: 14,
      color: colors.clarity,
      marginVertical: 4,
    },
    errorContainer: {
      backgroundColor: colors.error + '20',
      borderRadius: 12,
      padding: 16,
      marginBottom: 24,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      lineHeight: 20,
    },
    detectedSection: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      borderWidth: 2,
      borderColor: colors.clarity,
    },
    detectedTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.clarity,
      marginBottom: 16,
    },
    detectedInfo: {
      marginBottom: 12,
    },
    detectedLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 4,
    },
    detectedValue: {
      fontSize: 16,
      color: colors.text,
    },
    skipButton: {
      padding: 16,
      alignItems: 'center',
    },
    skipButtonText: {
      fontSize: 14,
      color: colors.textSecondary,
      textDecorationLine: 'underline',
    },
  });
}
