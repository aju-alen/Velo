import { Alert, StyleSheet, Text, View } from 'react-native'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import useLoginAccountStore from '@/store/loginAccountStore'

import React from 'react'

const OrganisationManagement = () => {
    const { accountLoginData } = useLoginAccountStore();
    const handleManageTeam = () => {
        if (accountLoginData.modeOfWork === 'ORGANISATION' && accountLoginData.role === 'AGENT') {
            router.push('/(tabs)/profile/settings/manageOrg/manageTeam');
        }
        else {
            Alert.alert('Error', 'You are not authorised to access this page')
        }
    };
    const handlePricingOption = () => {
        if(accountLoginData.role === 'AGENT'){
            router.push('/profile/settings/manageOrg/managePricing');
        }

    }

    return (
        <ThemedView>
            <ThemedText style={styles.headerTitle}>Organisation Management</ThemedText>
            {accountLoginData.role === "AGENT" && accountLoginData.modeOfWork === "ORGANISATION" &&
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
            </TouchableOpacity>}

          { accountLoginData.role === "AGENT" && 
            <TouchableOpacity
                style={styles.menuItem}
                onPress={handlePricingOption}
            >
               
                    <ThemedView style={styles.menuItemContent}>
                        <Ionicons
                            name="people-outline"
                            size={24}
                            color="#666"
                            style={styles.icon}
                        />
                        <ThemedText style={styles.menuItemText}>Manage Pricing and Timeline</ThemedText>
                        <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="#666"
                            style={styles.chevronIcon}
                        />
                    </ThemedView>
            </TouchableOpacity>}
        </ThemedView>
    )
}

export default OrganisationManagement

const styles = StyleSheet.create({
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
})