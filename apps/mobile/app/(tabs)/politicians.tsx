import { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/userStore';
import { Colors } from '../../constants/colors';
import { politiciansApi } from '../../services/api/politicians';
import { Politician } from '../../types';
import { PoliticianCard } from '../../components/politician/PoliticianCard';

export default function PoliticiansScreen() {
  const router = useRouter();
  const { preferences } = useUserStore();
  const darkMode = preferences.darkMode;
  const colors = darkMode ? Colors.dark : Colors.light;
  const styles = createStyles(colors);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>();

  // Fetch politicians based on user location
  const { data: politicians, isLoading, error, refetch } = useQuery({
    queryKey: ['politicians', preferences.location],
    queryFn: async () => {
      // Use user's location or default to Washington DC for testing
      let address = '';
      
      if (preferences.location.formattedAddress) {
        address = preferences.location.formattedAddress;
      } else if (preferences.location.zipCode) {
        address = preferences.location.zipCode;
      } else if (preferences.location.city && preferences.location.stateCode) {
        address = `${preferences.location.city}, ${preferences.location.stateCode}`;
      } else if (preferences.location.city && preferences.location.state) {
        address = `${preferences.location.city}, ${preferences.location.state}`;
      } else {
        // Default to Washington DC for testing
        address = '20500';
        console.log('No location set, using default: Washington DC');
      }
      
      console.log('Fetching politicians for:', address);
      return await politiciansApi.getRepresentativesByAddress(address);
    },
    retry: 2,
    retryDelay: 1000,
  });

  // Filter politicians based on search and level (memoized for performance)
  const filteredPoliticians = useMemo(() => {
    if (!politicians) return [];
    
    return politicians.filter(p => {
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.position.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLevel = !selectedLevel || p.level === selectedLevel;
      
      return matchesSearch && matchesLevel;
    });
  }, [politicians, searchQuery, selectedLevel]);

  const renderPolitician = ({ item }: { item: Politician }) => (
    <PoliticianCard
      politician={item}
      onPress={() => router.push(`/politician/${item.id}` as any)}
      darkMode={darkMode}
    />
  );

  return (
    <View style={styles.container}>
      {/* Location Header */}
      <View style={styles.locationHeader}>
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Your Location</Text>
          <Text style={styles.locationText}>
            {preferences.location.city && preferences.location.stateCode
              ? `${preferences.location.city}, ${preferences.location.stateCode}`
              : preferences.location.zipCode || 'Washington, DC'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.changeLocationButton}
          onPress={() => router.push('/location-setup' as any)}
        >
          <Text style={styles.changeLocationText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search politicians..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Level Filter */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            !selectedLevel && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel(undefined)}
        >
          <Text style={[
            styles.filterButtonText,
            !selectedLevel && styles.filterButtonTextActive,
          ]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === 'Federal' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel('Federal')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedLevel === 'Federal' && styles.filterButtonTextActive,
          ]}>
            Federal
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === 'State' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel('State')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedLevel === 'State' && styles.filterButtonTextActive,
          ]}>
            State
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedLevel === 'Local' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedLevel('Local')}
        >
          <Text style={[
            styles.filterButtonText,
            selectedLevel === 'Local' && styles.filterButtonTextActive,
          ]}>
            Local
          </Text>
        </TouchableOpacity>
      </View>

      {/* Politicians List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.clarity} />
          <Text style={styles.loadingText}>Loading politicians...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Failed to load politicians</Text>
          <Text style={styles.errorDetails}>
            {error instanceof Error ? error.message : 'Unknown error occurred'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : filteredPoliticians.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No politicians found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery ? 'Try a different search' : 'Check your location settings'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPoliticians}
          renderItem={renderPolitician}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
              tintColor={colors.clarity}
            />
          }
        />
      )}
    </View>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    locationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    locationInfo: {
      flex: 1,
    },
    locationLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    locationText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    changeLocationButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.clarity,
    },
    changeLocationText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    searchContainer: {
      padding: 16,
      backgroundColor: colors.background,
    },
    searchInput: {
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 12,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
    },
    filterButtonActive: {
      backgroundColor: colors.clarity,
      borderColor: colors.clarity,
    },
    filterButtonText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    filterButtonTextActive: {
      color: '#FFFFFF',
    },
    listContent: {
      padding: 16,
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: colors.textSecondary,
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      marginBottom: 8,
      fontWeight: '600',
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
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
}
