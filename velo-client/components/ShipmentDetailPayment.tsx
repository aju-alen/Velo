import { StyleSheet, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme'
import useShipmentStore from '@/store/shipmentStore';

const ShipmentDetailPayment = ({onGetData,onButtonclick,itemType}) => {
  const { packageDescription,setPackageDescription } = useShipmentStore();
  const colorScheme = useColorScheme();
  const [description, setDescription] = useState('');

  useEffect(() => {
    
    onGetData(packageDescription);

  }, [onButtonclick === true]);

  const handleSetDescription = (text) => {
    setPackageDescription(text);
  };
  console.log(packageDescription,'packageDescription----');
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.label}>{itemType === 'DOCUMENT' ? "Document": "Package"} Description</ThemedText>
          <ThemedText style={styles.subtitle}>
            Please provide details about the document you're sending {itemType === 'DOCUMENT' && '(Identity documents should be clearly described.)'}
          </ThemedText>
          
          <TextInput
            style={[styles.textInput, { color: colorScheme === 'light' ? '#000' : '#fff' }]}
            placeholder="Enter your document description here..."
            placeholderTextColor="#999"
            value={packageDescription}
            onChangeText={handleSetDescription}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

export default ShipmentDetailPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,


  },
  card: {

    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,

  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,

  },
  subtitle: {
    fontSize: 14,

    marginBottom: 16,
    lineHeight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 16,
    fontSize: 15,
    minHeight: 120,
  },
});