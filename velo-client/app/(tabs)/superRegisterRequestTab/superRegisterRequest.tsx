import React, { useEffect, useState } from 'react'
import {  FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import useLoginAccountStore from '@/store/loginAccountStore'
import axiosInstance from '@/constants/axiosHeader'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import axios from 'axios'

interface AppointmentRequest {
  id: string;
  name: string;
  mobileCode: string;
  mobileNumber: string;
}

const SuperRegisterRequest = () => {
  const { accountLoginData } = useLoginAccountStore();
  const [appointmentBookedData, setAppointmentBookedData] = useState<AppointmentRequest[]>([]);

  const getAppointmentRequest = async () => {
    try {
      const response = await axiosInstance.get('/api/test-routes/get-all-appointent-request')
      setAppointmentBookedData(response.data.allAppointmentRequest)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getAppointmentRequest()
  }, [])

  const handleAccept = async(id: string) => {
    console.log(`Accepted request for ID: ${id}`);
    try{
      const response = await axiosInstance.put(`/api/test-routes/approve-agent-appointment/${id}`)
      console.log(response.data);
      
      if(response.data.updateBool){
        Alert.alert('Agent Accepted')
        setAppointmentBookedData(prev=> prev.filter(item => item.id !== id))
  
      }
    }
    catch(e){
      console.log(e)
    } 
  
  }

  const handleDecline = (id: string) => {
    // Implement decline logic
    console.log(`Declined request for ID: ${id}`)
  }

  const renderAppointmentCard = ({ item }: { item: AppointmentRequest }) => (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.cardContent}>
        <ThemedText style={styles.name}>{item.name}</ThemedText>
        <ThemedText style={styles.phoneNumber}>
          {item.mobileCode} {item.mobileNumber}
        </ThemedText>
        
        <ThemedView style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.acceptButton]} 
            onPress={() => handleAccept(item.id)}
          >
            <ThemedText style={styles.buttonText}>Accept</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.declineButton]} 
            onPress={() => handleDecline(item.id)}
          >
            <ThemedText style={styles.buttonText}>Decline</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  )

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={appointmentBookedData}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: horizontalScale(16),
  },
  listContainer: {
    padding: horizontalScale(16),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    padding: horizontalScale(16),
  },
  name: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  phoneNumber: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(12),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(12),
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: horizontalScale(4),
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(16),
  },
})

export default SuperRegisterRequest