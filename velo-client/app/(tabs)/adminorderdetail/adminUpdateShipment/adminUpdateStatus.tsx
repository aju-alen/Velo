import { StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

const AdminUpdateStatus = () => {
  const handleApprove = () => {
    // Add approval logic here
    console.log('Approved');
  };

  const handleReject = () => {
    // Add rejection logic here
    console.log('Rejected');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Update Status</ThemedText>
      
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.approveButton]} 
          onPress={handleApprove}
        >
          <ThemedText style={styles.buttonText}>Approve</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.rejectButton]} 
          onPress={handleReject}
        >
          <ThemedText style={styles.buttonText}>Reject</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

export default AdminUpdateStatus

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  approveButton: {
    backgroundColor: '#4CAF50', // Green
  },
  rejectButton: {
    backgroundColor: '#F44336', // Red
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});