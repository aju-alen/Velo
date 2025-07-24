import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import axiosInstance from '@/constants/axiosHeader'
import useLoginAccountStore from '@/store/loginAccountStore'
import { FlatList } from 'react-native'
import { router } from 'expo-router'

const ManageTeam = () => {
    const { accountLoginData } = useLoginAccountStore();
    const [manageTeamData, setManageTeamData] = useState(null);
    console.log(manageTeamData,"manageTeamData");
    
    
    const getOrganisationData = async () => {
        try {
            const response = await axiosInstance.get(`/api/organisation/get-single-org-data/${accountLoginData.id}`);
            setManageTeamData(response.data);
        }
        catch(e) {
            console.log(e)
            Alert.alert('Error', 'Failed to fetch organisation data')
        }
    }

    useEffect(() => {
        getOrganisationData()
    }, [])

    const renderAgentItem = ({item}) => {
        return (
            <ThemedView style={styles.agentContainer}>
                <ThemedView style={styles.agentHeader}>
                    <ThemedText style={styles.agentName}>{item.name}</ThemedText>
                    <ThemedText style={styles.agentRole}>{item.role}</ThemedText>
                </ThemedView>
                
                <ThemedView style={styles.agentDetails}>
                    <ThemedView style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Email:</ThemedText>
                        <ThemedText>{item.email}</ThemedText>
                    </ThemedView>
                    
                    <ThemedView style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Phone:</ThemedText>
                        <ThemedText>{item.mobileCode} {item.mobileNumber}</ThemedText>
                    </ThemedView>
                    
                    <ThemedView style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Country:</ThemedText>
                        <ThemedText>{item.mobileCountry}</ThemedText>
                    </ThemedView>
                    
                    <ThemedView style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Verification Status:</ThemedText>
                        <ThemedText>{item.registerVerificationStatus}</ThemedText>
                    </ThemedView>
                    
                    <ThemedView style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>First Time Login:</ThemedText>
                        <ThemedText>{item.firstTimeLogin ? 'Yes' : 'No'}</ThemedText>
                    </ThemedView>
                    
                    <ThemedView style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Appointment Date:</ThemedText>
                        <ThemedText>
                            {item.appointmentDate 
                                ? new Date(item.appointmentDate).toLocaleDateString() 
                                : 'Not set'}
                        </ThemedText>
                    </ThemedView>
                    
                    <ThemedView style={styles.detailRow}>
                        <ThemedText style={styles.detailLabel}>Organisation Leader:</ThemedText>
                        <ThemedText>{item.isOrganisationLeader ? 'Yes' : 'No'}</ThemedText>
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        )
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.orgName}>{manageTeamData?.organisationName}</ThemedText>
            <ThemedText style={styles.employeeCount}>
                Number Of Employees: {manageTeamData?.agents.length}
            </ThemedText>
            
           {manageTeamData?.superAdminApproval && <TouchableOpacity 
                style={styles.createEmployeeButton}
                onPress={() => router.push({ 
                    pathname: '/(tabs)/profile/settings/manageOrg/createNewEmployee', 
                    params: {orgId: manageTeamData.id}  
                })}
            >
                <ThemedText style={styles.createEmployeeButtonText}>
                    Create an employee
                </ThemedText>
            </TouchableOpacity>}
            
            <FlatList
                data={manageTeamData?.agents}
                keyExtractor={(item) => item.id}
                renderItem={renderAgentItem}
                contentContainerStyle={styles.flatlistContainer}
            />
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    orgName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    employeeCount: {
        marginBottom: 10,
    },
    createEmployeeButton: {
        backgroundColor: '#FFAC1C',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    createEmployeeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    flatlistContainer: {
        paddingBottom: 20,
    },
    agentContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    agentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    agentName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    agentRole: {
        color: '#666',
    },
    agentDetails: {
        marginTop: 5,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    detailLabel: {
        fontWeight: 'bold',
        marginRight: 10,
        width: 150,
    },
})

export default ManageTeam