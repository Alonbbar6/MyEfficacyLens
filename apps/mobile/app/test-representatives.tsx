import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function RepresentativesTestScreen() {
  const [address, setAddress] = useState('1600 Pennsylvania Ave NW, Washington, DC 20500');
  const [representatives, setRepresentatives] = useState<any[]>([]);
  const [offices, setOffices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_KEY = 'AIzaSyD9rzLJCUqRSCi9mKpo0fxZ1ACxffe5mzc';
  const API_URL = 'https://www.googleapis.com/civicinfo/v2';

  const fetchRepresentatives = async () => {
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(
        `${API_URL}/representatives?address=${encodeURIComponent(address)}&key=${API_KEY}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch representatives');
      }
      
      setRepresentatives(data.officials || []);
      setOffices(data.offices || []);
      
    } catch (err: any) {
      console.error('Error fetching representatives:', err);
      setError(`Error: ${err.message || 'Failed to fetch representatives'}`);
      setRepresentatives([]);
      setOffices([]);
    } finally {
      setLoading(false);
    }
  };

  const getOfficeForOfficial = (officialIndex: number) => {
    return offices.find(office => 
      office.officialIndices.includes(officialIndex)
    )?.name || 'Unknown Position';
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Representatives API Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter an address"
          placeholderTextColor="#999"
        />
        <Button 
          title="Fetch Representatives" 
          onPress={fetchRepresentatives}
          disabled={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Loading representatives data...</Text>
        </View>
      )}

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.note}>
            Note: If you're seeing a 404 error, please ensure:
            \n1. The Google Civic Information API is enabled in your Google Cloud Console
2. Your API key has the necessary permissions
3. The endpoint URL is correct
          </Text>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          {representatives.length > 0 && (
            <Text style={styles.resultsTitle}>Representatives for {address}</Text>
          )}
          
          {representatives.map((rep, index) => (
            <View key={index} style={styles.repCard}>
              <Text style={styles.repName}>{rep.name}</Text>
              <Text style={styles.repOffice}>{getOfficeForOfficial(index)}</Text>
              
              {rep.party && (
                <Text style={styles.repParty}>
                  Party: {rep.party}
                </Text>
              )}
              
              {rep.phones && rep.phones.length > 0 && (
                <Text style={styles.repContact}>
                  Phone: {rep.phones[0]}
                </Text>
              )}
              
              {rep.emails && rep.emails.length > 0 && (
                <Text style={styles.repContact}>
                  Email: {rep.emails[0]}
                </Text>
              )}
              
              {rep.photoUrl && (
                <View style={styles.photoPlaceholder}>
                  <Text>Photo available at: {rep.photoUrl}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Information</Text>
        <Text style={styles.debugText}>
          API Key: {API_KEY ? '✓ Configured' : '✗ Missing'}
        </Text>
        <Text style={styles.debugText}>
          Endpoint: {`${API_URL}/representatives?address=...&key=...`}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
    marginBottom: 20,
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
  },
  note: {
    marginTop: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  resultsContainer: {
    marginTop: 10,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  repCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  repName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  repOffice: {
    fontSize: 16,
    color: '#2196f3',
    marginBottom: 8,
  },
  repParty: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  repContact: {
    fontSize: 14,
    color: '#444',
    marginBottom: 3,
  },
  photoPlaceholder: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  debugText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
} as const;
