import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Politician } from '../../types';
import { Colors, PartyColors } from '../../constants/colors';

interface PoliticianCardProps {
  politician: Politician;
  onPress: () => void;
  darkMode?: boolean;
}

export function PoliticianCard({ politician, onPress, darkMode = false }: PoliticianCardProps) {
  const colors = darkMode ? Colors.dark : Colors.light;
  const styles = createStyles(colors);
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardHeader}>
        {/* Avatar or Photo */}
        <View style={styles.avatarContainer}>
          {politician.photo && !imageError ? (
            <Image 
              source={{ uri: politician.photo }} 
              style={styles.photo}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(politician.name)}</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {politician.name}
          </Text>
          <Text style={styles.position} numberOfLines={1}>
            {politician.position}
          </Text>
          {politician.district && (
            <Text style={styles.district} numberOfLines={1}>
              {politician.district}
            </Text>
          )}
        </View>

        {/* Party Badge */}
        <View style={[styles.partyBadge, { backgroundColor: PartyColors[politician.party] }]}>
          <Text style={styles.partyText}>{politician.party[0]}</Text>
        </View>
      </View>

      {/* Contact Info */}
      {(politician.phone || politician.email) && (
        <View style={styles.contactSection}>
          {politician.phone && (
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText} numberOfLines={1}>
                {politician.phone}
              </Text>
            </View>
          )}
          
          {politician.email && (
            <View style={styles.contactRow}>
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactText} numberOfLines={1}>
                {politician.email}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

function createStyles(colors: typeof Colors.light) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatarContainer: {
      marginRight: 12,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.clarity,
      alignItems: 'center',
      justifyContent: 'center',
    },
    photo: {
      width: 56,
      height: 56,
      borderRadius: 28,
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
      fontSize: 16,
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
      fontSize: 12,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    partyBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    partyText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    contactSection: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    contactRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    contactIcon: {
      fontSize: 14,
      marginRight: 8,
      width: 20,
    },
    contactText: {
      fontSize: 13,
      color: colors.text,
      flex: 1,
    },
  });
}
