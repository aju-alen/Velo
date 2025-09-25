import { Alert, StyleSheet, TouchableOpacity, View, Text, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import axiosInstance from '@/constants/axiosHeader'
import useLoginAccountStore from '@/store/loginAccountStore'
import { FlatList } from 'react-native'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors';

const ManageTeam = () => {
    const { accountLoginData } = useLoginAccountStore();
    const [manageTeamData, setManageTeamData] = useState(null);
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
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
            <View style={[styles.agentContainer, { backgroundColor: themeColors.background, borderColor: themeColors.text }]}>
                <View style={[styles.agentHeader, { borderBottomColor: themeColors.text }]}>
                    <Text style={[styles.agentName, { color: themeColors.text }]}>{item.name}</Text>
                    <Text style={[styles.agentRole, { color: themeColors.text }]}>{item.role}</Text>
                </View>
                
                <View style={styles.agentDetails}>
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themeColors.text }]}>Email:</Text>
                        <Text style={{ color: themeColors.text }}>{item.email}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themeColors.text }]}>Phone:</Text>
                        <Text style={{ color: themeColors.text }}>{item.mobileCode} {item.mobileNumber}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themeColors.text }]}>Country:</Text>
                        <Text style={{ color: themeColors.text }}>{item.mobileCountry}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themeColors.text }]}>Verification Status:</Text>
                        <Text style={{ color: themeColors.text }}>{item.registerVerificationStatus}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themeColors.text }]}>First Time Login:</Text>
                        <Text style={{ color: themeColors.text }}>{item.firstTimeLogin ? 'Yes' : 'No'}</Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themeColors.text }]}>Appointment Date:</Text>
                        <Text style={{ color: themeColors.text }}>
                            {item.appointmentDate 
                                ? new Date(item.appointmentDate).toLocaleDateString() 
                                : 'Not set'}
                        </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                        <Text style={[styles.detailLabel, { color: themeColors.text }]}>Organisation Leader:</Text>
                        <Text style={{ color: themeColors.text }}>{item.isOrganisationLeader ? 'Yes' : 'No'}</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.orgName, { color: themeColors.text }]}>{manageTeamData?.organisationName}</Text>
            <Text style={[styles.employeeCount, { color: themeColors.text }]}>
                Number Of Employees: {manageTeamData?.agents.length}
            </Text>
            
           {manageTeamData?.superAdminApproval && <TouchableOpacity 
                style={styles.createEmployeeButton}
                onPress={() => router.push({ 
                    pathname: '/(tabs)/profile/settings/manageOrg/createNewEmployee', 
                    params: {orgId: manageTeamData.id}  
                })}
            >
                <Text style={styles.createEmployeeButtonText}>
                    Create an employee
                </Text>
            </TouchableOpacity>}
            
            <FlatList
                data={manageTeamData?.agents}
                keyExtractor={(item) => item.id}
                renderItem={renderAgentItem}
                contentContainerStyle={styles.flatlistContainer}
            />
        </View>
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
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    agentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottomWidth: 1,
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