import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

const SelectPackage = (getPackageDetail) => {
  const [dimensions, setDimensions] = useState({
    length: '',
    height: '',
    width: ''
  });
  const [numberOfPieces, setNumberOfPieces] = useState('');
  const [weight, setWeight] = useState('');

  const handleInputChange = (name, input) => {
    if (input === '') {
      setDimensions(prev => ({ ...prev, [name]: '' }));
      return;
    }
    const cleanedInput = input.replace(/[^0-9.]/g, '');
    const parts = cleanedInput.split('.');
    if (parts.length > 2) return;
    
    let value = cleanedInput;
    if (parts[0].length > 3) {
      value = parts[0].slice(0, 3) + (parts[1] ? '.' + parts[1] : '');
    }
    
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue <= 999) {
      setDimensions(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleInputPieceChange = (input) => {
    if (input === '') {
      setNumberOfPieces('');
      return;
    }
    const cleanedInput = input.replace(/[^0-9]/g, '');
    const numericValue = parseInt(cleanedInput);
    if (!isNaN(numericValue) && numericValue <= 10) {
      setNumberOfPieces(cleanedInput);
    }
  };

  const handleInputWeightChange = (input) => {
    if (input === '') {
      setWeight('');
      return;
    }
    const cleanedInput = input.replace(/[^0-9.]/g, '');
    const parts = cleanedInput.split('.');
    if (parts.length > 2) return;
    
    const numericValue = parseFloat(cleanedInput);
    if (!isNaN(numericValue) && numericValue <= 10000) {
      setWeight(cleanedInput);
    }
  };

  const totalWeight = numberOfPieces && weight 
    ? (Number(numberOfPieces) * Number(weight)).toFixed(1) 
    : '0';

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>Package Details</ThemedText>
          <View style={styles.titleUnderline} />
        </ThemedView>
        
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Dimensions (cm)</ThemedText>
          <ThemedView style={styles.dimensionsRow}>
            {['Length', 'Width', 'Height'].map((dimension) => (
              <ThemedView key={dimension} style={styles.inputWrapper}>
                <ThemedText style={styles.inputLabel}>{dimension}</ThemedText>
                <ThemedView style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="0.0"
                    value={dimensions[dimension.toLowerCase()]}
                    keyboardType="decimal-pad"
                    onChangeText={(text) => handleInputChange(dimension.toLowerCase(), text)}
                  />
                  <ThemedText style={styles.unitText}>cm</ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quantity & Weight</ThemedText>
          <ThemedView style={styles.quantityRow}>
            <ThemedView style={[styles.inputWrapper, { flex: 0.4 }]}>
              <ThemedText style={styles.inputLabel}>Number of Pieces</ThemedText>
              <ThemedView style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={numberOfPieces}
                  keyboardType="numeric"
                  onChangeText={handleInputPieceChange}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView style={[styles.inputWrapper, { flex: 0.7 }]}>
              <ThemedText style={styles.inputLabel}>Weight per Piece</ThemedText>
              <ThemedView style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="0.0"
                  value={weight}
                  keyboardType="decimal-pad"
                  onChangeText={handleInputWeightChange}
                />
                <ThemedText style={styles.unitText}>kg</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.summary}>
          <ThemedView style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Total Packages</ThemedText>
            <ThemedText style={styles.summaryValue}>{numberOfPieces || '0'}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>Total Weight</ThemedText>
            <ThemedText style={styles.summaryValue}>{totalWeight} kg</ThemedText>
          </ThemedView>
        </ThemedView>

      
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAFC',

  },
  card: {
    


   
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontWeight: '700',
    color: '#FFAC1C',
    marginBottom: 8,
  },
  titleUnderline: {
    width: 60,
    height: 4,
    backgroundColor: '#FFAC1C',
    borderRadius: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {

    fontWeight: '600',
    marginBottom: 16,
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,

  },
  inputContainer: {
    position: 'relative',
    height: 48,
  },
  input: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingRight: 40,
    fontSize: 16,
    height: 48,
    width: '100%',

  },
  unitText: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: [{ translateY: -8 }],
    fontSize: 14,
    fontWeight: '500',
    color: '#718096',
  },
  summary: {

    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
 
});

export default SelectPackage;