import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { apiClient, API_KEYS, API_URLS } from '../services/api/config';
import { fetchElections, fetchRepresentatives } from '../services/api/civicApi';

export default function ApiTestScreen() {
  const [civicData, setCivicData] = useState<any>(null);
  const [mapsData, setMapsData] = useState<any>(null);
  const [loading, setLoading] = useState({
    civic: false,
    maps: false,
  });
  const [error, setError] = useState({
    civic: '',
    maps: '',
  });
  const router = useRouter();

  const testCivicApi = async () => {
    setLoading(prev => ({ ...prev, civic: true }));
    setError(prev => ({ ...prev, civic: '' }));
    
    try {
      console.log('Testing Civic API with key:', API_KEYS.googleCivic ? 'Key exists' : 'NO KEY');
      
      // Test elections endpoint (we know this works!)
      const electionsData = await fetchElections();
      console.log('Elections API Success:', electionsData);
      
      // Also test representatives endpoint
      const testAddress = '1600 Pennsylvania Ave NW, Washington, DC 20500';
      const repsData = await fetchRepresentatives(testAddress);
      console.log('Representatives API Success:', repsData);
      
      setCivicData({
        elections: electionsData.elections,
        representatives: repsData.officials,
        offices: repsData.offices,
      });
    } catch (err: any) {
      console.error('Civic API Error:', err);
      const errorMsg = err.message || 'Failed to fetch from Civic API';
      setError(prev => ({
        ...prev,
        civic: errorMsg,
      }));
    } finally {
      setLoading(prev => ({ ...prev, civic: false }));
    }
  };

  const testMapsApi = async () => {
    setLoading(prev => ({ ...prev, maps: true }));
    setError(prev => ({ ...prev, maps: '' }));
    
    try {
      const testAddress = '1600 Pennsylvania Ave NW, Washington, DC 20500';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          testAddress
        )}&key=${API_KEYS.googleMaps}`
      );
      const data = await response.json();
      setMapsData(data);
    } catch (err: any) {
      console.error('Maps API Error:', err);
      setError(prev => ({
        ...prev,
        maps: err.message || 'Failed to fetch from Maps API',
      }));
    } finally {
      setLoading(prev => ({ ...prev, maps: false }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Test Screen</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>API Keys Status</Text>
        <Text style={styles.infoText}>
          Civic API Key: {API_KEYS.googleCivic ? '✓ Configured' : '✗ Missing'}
        </Text>
        <Text style={styles.infoText}>
          Maps API Key: {API_KEYS.googleMaps ? '✓ Configured' : '✗ Missing'}
        </Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Google Civic API</Text>
        <Button
          title={loading.civic ? 'Testing...' : 'Test Civic API'}
          onPress={testCivicApi}
          disabled={loading.civic}
        />
        
        {loading.civic && <ActivityIndicator style={styles.loader} />}
        
        {error.civic ? (
          <Text style={styles.error}>Error: {error.civic}</Text>
        ) : civicData ? (
          <View style={styles.resultContainer}>
            <Text style={styles.success}>✓ Civic API Connected Successfully</Text>
            <Text style={styles.resultText}>
              Found {civicData.elections?.length || 0} elections
            </Text>
            <Text style={styles.resultText}>
              Found {civicData.representatives?.length || 0} representatives
            </Text>
            {civicData.elections && civicData.elections.length > 0 && (
              <View style={styles.detailSection}>
                <Text style={styles.detailTitle}>Latest Election:</Text>
                <Text style={styles.detailText}>{civicData.elections[0].name}</Text>
                <Text style={styles.detailText}>Date: {civicData.elections[0].electionDay}</Text>
              </View>
            )}
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Google Maps API</Text>
        <Button
          title={loading.maps ? 'Testing...' : 'Test Maps API'}
          onPress={testMapsApi}
          disabled={loading.maps}
        />
        
        {loading.maps && <ActivityIndicator style={styles.loader} />}
        
        {error.maps ? (
          <Text style={styles.error}>Error: {error.maps}</Text>
        ) : mapsData ? (
          <View style={styles.resultContainer}>
            <Text style={styles.success}>✓ Maps API Connected Successfully</Text>
            <Text style={styles.resultText}>
              {mapsData.results?.[0]?.formatted_address || 'No address found'}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.backButton}>
        <Button
          title="Back to App"
          onPress={() => router.back()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginVertical: 5,
    color: '#333',
  },
  loader: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  success: {
    color: 'green',
    fontWeight: '600',
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f8ff',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  resultText: {
    marginTop: 5,
  },
  detailSection: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  detailTitle: {
    fontWeight: '600',
    marginTop: 5,
    marginBottom: 3,
  },
  detailText: {
    fontSize: 13,
    color: '#555',
    marginVertical: 2,
  },
  backButton: {
    marginTop: 20,
  },
});
