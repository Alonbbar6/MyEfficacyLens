import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TestScreen() {
  const router = useRouter();

  const testItems = [
    {
      title: 'Civic API Test',
      description: 'Test the Google Civic Information API',
      route: '/test-civic',
    },
    {
      title: 'Representatives Test',
      description: 'Test the Representatives endpoint',
      route: '/test-representatives',
    },
    {
      title: 'Florida Senators',
      description: 'View all Florida State Senators (OpenStates API)',
      route: '/florida-senators',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>API Test Suite</Text>
      <Text style={styles.subtitle}>Test different API endpoints and functionality</Text>
      
      <View style={styles.testList}>
        {testItems.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.testCard}
            onPress={() => router.push(item.route as any)}
          >
            <Text style={styles.testTitle}>{item.title}</Text>
            <Text style={styles.testDescription}>{item.description}</Text>
            <View style={styles.testArrow}>
              <Text style={styles.arrow}>&rarr;</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.noteContainer}>
        <Text style={styles.noteTitle}>Note:</Text>
        <Text style={styles.noteText}>
          These test screens are for development purposes only. They will help you verify that your API connections are working correctly.
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  testList: {
    marginBottom: 30,
  },
  testCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  testTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  testDescription: {
    fontSize: 14,
    color: '#666',
    marginRight: 30,
  },
  testArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  arrow: {
    fontSize: 24,
    color: '#0074D9',
  },
  noteContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
  },
  noteTitle: {
    fontWeight: '600',
    marginBottom: 5,
    color: '#0d47a1',
  },
  noteText: {
    color: '#0d47a1',
    fontSize: 14,
    lineHeight: 20,
  },
} as const;
