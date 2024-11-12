import { StyleSheet, TextInput, View, Text } from 'react-native';
import React, { useState } from 'react';
import { ThemedView } from './ThemedView'; // Assuming ThemedView is a custom component
import { ThemedText } from './ThemedText';

const ShipmentDetailPayment = () => {
  const [description, setDescription] = useState('');

  return (
    <ThemedView style={styles.container}>
      {/* Description Section */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.title}>Describe the document that you are sending</ThemedText>
        <TextInput
          style={styles.textInput}
          placeholder="Document description"
          value={description}
          onChangeText={setDescription}
          multiline={true} // Allow multi-line input
          numberOfLines={4} // 4 lines to show
        />
      </ThemedView>

      {/* Payment Section */}
    
    </ThemedView>
  );
};

export default ShipmentDetailPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

  },
  section: {
    marginBottom: 20, // Space between sections
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8, // Space between text and input

  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd', // Subtle border color
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top', // Align text at the top for better appearance
  },
  paymentMethod: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
});
