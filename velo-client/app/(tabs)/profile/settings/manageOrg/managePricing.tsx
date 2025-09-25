import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, ScrollView, View, Text, useColorScheme } from 'react-native';
import { TouchableOpacity } from 'react-native';
import axiosInstance from '@/constants/axiosHeader';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const ManagePricingOption = () => {

  const [documentPricePerPiece, setDocumentPricePerPiece] = useState(''); 
  const [packagePricePerKg, setPackagePricePerKg] = useState('');
  const [packagePricePerPiece, setPackagePricePerPiece] = useState('');
  const [shipmentTimeline, setShipmentTimeline] = useState('');
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  
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
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.title, { color: themeColors.text }]}>Manage Pricing Options</Text>
      
      {/* Document Pricing Section */}
      <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Document Pricing</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.background, borderColor: themeColors.text, color: themeColors.text }]}
          placeholder="Price per Piece"
          value={(documentPricePerPiece)}
          onChangeText={setDocumentPricePerPiece}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
      </View>
      
      {/* Package Pricing Section */}
      <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Package Pricing</Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.background, borderColor: themeColors.text, color: themeColors.text }]}
          placeholder="Price per Kg"
          value={packagePricePerKg}
          onChangeText={setPackagePricePerKg}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.background, borderColor: themeColors.text, color: themeColors.text }]}
          placeholder="Price per Piece"
          value={packagePricePerPiece}
          onChangeText={setPackagePricePerPiece}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        
        {/* Collection Price Note */}
       
      </View>

      <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.sectionTitle, { color: themeColors.text }]}>{`Delivery Timeline (in days)`} </Text>
        <TextInput
          style={[styles.input, { backgroundColor: themeColors.background, borderColor: themeColors.text, color: themeColors.text }]}
          placeholder="Input a delivery timeline"
          value={shipmentTimeline}
          onChangeText={setShipmentTimeline}
          keyboardType="default"
          placeholderTextColor="#888"
        />
       
        
        {/* Collection Price Note */}
       
      </View>
      
      {/* Save Button */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSavePricing}
      >
        <Text style={styles.saveButtonText}>
          Save Pricing
        </Text>
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