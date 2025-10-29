import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function CivicTestScreen() {
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_KEY = 'AIzaSyD9rzLJCUqRSCi9mKpo0fxZ1ACxffe5mzc';
  const API_URL = 'https://www.googleapis.com/civicinfo/v2';

  const fetchElections = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`${API_URL}/elections?key=${API_KEY}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to fetch elections');
      }
      
      setElections(data.elections || []);
    } catch (err: any) {
      console.error('Error fetching elections:', err);
      setError(err.message || 'Failed to fetch elections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Civic API Test</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Elections Data</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Loading elections data...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
            <Button title="Retry" onPress={fetchElections} />
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            {elections.length > 0 ? (
              elections.map((election, index) => (
                <View key={election.id || index} style={styles.electionCard}>
                  <Text style={styles.electionName}>{election.name}</Text>
                  <Text style={styles.electionDate}>Date: {election.electionDay}</Text>
                  <Text style={styles.electionId}>ID: {election.id}</Text>
                </View>
              ))
            ) : (
              <Text>No elections found</Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Another Endpoint</Text>
        <Button 
          title="Test Representatives Endpoint" 
          onPress={() => router.push('/test-representatives')}
        />
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
    marginBottom: 30,
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
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 10,
  },
  resultsContainer: {
    marginTop: 10,
  },
  electionCard: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#2196f3',
  },
  electionName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  electionDate: {
    color: '#666',
    marginBottom: 3,
  },
  electionId: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
} as const;
