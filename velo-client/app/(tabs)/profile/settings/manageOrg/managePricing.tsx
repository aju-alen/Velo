import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, ScrollView, View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';
import axiosInstance from '@/constants/axiosHeader';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics';

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
        router.replace('/(tabs)/profile/settings/settingsHome')
        
    }
    catch(e){
      console.log(e)
    }
  };
  const handleGetPricing = async() => {
    try{
        const getPricing = await axiosInstance.get(`/api/organisation/get-pricing`)

        setDocumentPricePerPiece(getPricing.data.documentPricePerPiece?.toString() || '')
        setPackagePricePerKg(getPricing.data.packagePricePerKg?.toString() || '')
        setPackagePricePerPiece(getPricing.data.packagePricePerPiece?.toString() || '')
        setShipmentTimeline(getPricing.data.deliveryTimeline?.toString() || '')
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Pricing Section */}
        <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(16) }]}>Document Pricing</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)', 
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
              color: themeColors.text 
            }]}
            placeholder="Price per Piece"
            value={documentPricePerPiece}
            onChangeText={setDocumentPricePerPiece}
            keyboardType="numeric"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
          />
        </View>
        
        {/* Package Pricing Section */}
        <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(16) }]}>Package Pricing</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)', 
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
              color: themeColors.text 
            }]}
            placeholder="Price per Kg"
            value={packagePricePerKg}
            onChangeText={setPackagePricePerKg}
            keyboardType="numeric"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
          />
          <TextInput
            style={[styles.input, { 
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)', 
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
              color: themeColors.text 
            }]}
            placeholder="Price per Piece"
            value={packagePricePerPiece}
            onChangeText={setPackagePricePerPiece}
            keyboardType="numeric"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
          />
        </View>

        {/* Delivery Timeline Section */}
        <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(16) }]}>Delivery Timeline (in days)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)', 
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
              color: themeColors.text 
            }]}
            placeholder="Input a delivery timeline"
            value={shipmentTimeline}
            onChangeText={setShipmentTimeline}
            keyboardType="numeric"
            placeholderTextColor={colorScheme === 'dark' ? '#666' : '#999'}
          />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(80),
  },
  sectionContainer: {
    marginBottom: verticalScale(20),
    padding: horizontalScale(16),
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(10),
    fontSize: moderateScale(16),
    fontWeight: '400',
  },
  saveButton: {
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(20),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    marginTop: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: moderateScale(16),
  },
});

export default ManagePricingOption;