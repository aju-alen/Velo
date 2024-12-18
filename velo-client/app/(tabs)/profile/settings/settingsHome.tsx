import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router} from 'expo-router';

const SettingsHome = () => {
  
  const handleManageTeam = () => {
    router.push('/(tabs)/profile/settings/manageOrg/manageTeam');
  };

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <ThemedText style={styles.headerTitle}>Organisation Management</ThemedText>

      {/* Submenu Item */}
      <TouchableOpacity 
        style={styles.menuItem} 
        onPress={handleManageTeam}
      >
        <ThemedView style={styles.menuItemContent}>
          <Ionicons 
            name="people-outline" 
            size={24} 
            color="#666" 
            style={styles.icon} 
          />
          <ThemedText style={styles.menuItemText}>Manage Team</ThemedText>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color="#666" 
            style={styles.chevronIcon} 
          />
        </ThemedView>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,

  },
  menuItem: {
    backgroundColor: 'white',

    marginBottom: 10,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,

  },
  chevronIcon: {
    marginLeft: 10,
  },
});

export default SettingsHome;