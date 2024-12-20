import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { router} from 'expo-router';
import useLoginAccountStore from '@/store/loginAccountStore';
import OrganisationManagement from '@/components/settings/organisationManagementMenu/OrganisationManagement';

const SettingsHome = () => {
  const { accountLoginData } = useLoginAccountStore();
  console.log(accountLoginData,'accountLoginData');
  
  

  return (
    <ThemedView style={styles.container}>

     {accountLoginData.role === "AGENT" && <OrganisationManagement/>}

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
 
});

export default SettingsHome;