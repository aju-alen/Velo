import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { TouchableOpacity } from 'react-native';
import axiosInstance from '@/constants/axiosHeader';
import { router } from 'expo-router';

const ManagePricingOption = () => {

  const [documentPricePerPiece, setDocumentPricePerPiece] = useState(''); 
  const [packagePricePerKg, setPackagePricePerKg] = useState('');
  const [packagePricePerPiece, setPackagePricePerPiece] = useState('');
  const [shipmentTimeline, setShipmentTimeline] = useState('');
  
  const handleSavePricing = async() => {
    try{
        const formData ={
            documentPricePerPiece,
            packagePricePerKg,
            packagePricePerPiece,
            shipmentTimeline,
        }
        const savePricing = await axiosInstance.put(`/api/organisation/save-pricing`,formData)
        router.replace('/profile/settings')
        
    }
    catch(e){
      console.log(e)
    }
  };
  const handleGetPricing = async() => {
    try{
        const getPricing = await axiosInstance.get(`/api/organisation/get-pricing`)

        setDocumentPricePerPiece(JSON.stringify(getPricing.data.documentPricePerPiece))
        setPackagePricePerKg(JSON.stringify(getPricing.data.packagePricePerKg))
        setPackagePricePerPiece(JSON.stringify(getPricing.data.packagePricePerPiece))
        setShipmentTimeline(JSON.stringify(getPricing.data.deliveryTimeline))
        console.log(getPricing.data.deliveryTimeline,'asdasdalskdaklsndakjlsndaklnsdj');
        
    }
    catch(e){
      console.log(e)
    }
  }
  console.log(typeof(packagePricePerKg), 'packagePricePerKg');
  
  useEffect(() => {
    handleGetPricing()
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText style={styles.title}>Manage Pricing Options</ThemedText>
      
      {/* Document Pricing Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Document Pricing</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Price per Piece"
          value={(documentPricePerPiece)}
          onChangeText={setDocumentPricePerPiece}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
      </ThemedView>
      
      {/* Package Pricing Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>Package Pricing</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Price per Kg"
          value={packagePricePerKg}
          onChangeText={setPackagePricePerKg}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Price per Piece"
          value={packagePricePerPiece}
          onChangeText={setPackagePricePerPiece}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        
        {/* Collection Price Note */}
       
      </ThemedView>

      <ThemedView style={styles.sectionContainer}>
        <ThemedText style={styles.sectionTitle}>{`Delivery Timeline (in days)`} </ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Input a delivery timeline"
          value={shipmentTimeline}
          onChangeText={setShipmentTimeline}
          keyboardType="default"
          placeholderTextColor="#888"
        />
       
        
        {/* Collection Price Note */}
       
      </ThemedView>
      
      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSavePricing}
      >
        <ThemedText style={styles.saveButtonText}>
          Save Pricing
        </ThemedText>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,

    padding: 12,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  noteContainer: {

    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  noteTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noteText: {

  },
  saveButton: {
    backgroundColor: '#FFAC1C',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ManagePricingOption;