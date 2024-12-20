import { StyleSheet, TextInput, View, TouchableOpacity, Modal, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { Divider } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme'
import { MaterialIcons } from '@expo/vector-icons';
import { getPackageDetailDimension } from '@/constants/packageDimensionData';
import { verticalScale, moderateScale, horizontalScale } from '@/constants/metrics';
import useShipmentStore from '@/store/shipmentStore';


const SelectPackage = ({ getPackageDetail, onButtonclick, itemType }) => {
  const {packageDetail,setPackageDetail} = useShipmentStore();
  const colorScheme = useColorScheme();



  const [showPackageDetail, setShowPackageDetail] = useState(false);
  const [openPackageModal, setOpenPackageModal] = useState(false);
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
    console.log(input,'numbe rof pieces');
    
    if (input === '') {
      setPackageDetail({ ...packageDetail, numberOfPieces: '' });
      return;
    }
    const cleanedInput = input.replace(/[^0-9]/g, '');
    const numericValue = parseInt(cleanedInput);
    if (!isNaN(numericValue) && numericValue <= 10) {
      setPackageDetail({ ...packageDetail, numberOfPieces: cleanedInput });
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
    ? (Number(packageDetail.numberOfPieces) * Number(weight)).toFixed(1)
    : '0';

  useEffect(() => {

    getPackageDetail(dimensions, packageDetail.numberOfPieces, weight);
  }, [onButtonclick]);



  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>{itemType === 'DOCUMENT' ? 'Document' : 'Package'} Details</ThemedText>
          <ThemedView style={styles.titleUnderline} />
        </ThemedView>

        <ThemedText style={styles.title}>{itemType === 'DOCUMENT' ? '' : "Package Type"}</ThemedText>

        {/* Pacakge type when checkbox is checked package */}
        {itemType === 'PACKAGE' &&
          <>
            <ThemedView style={styles.selectPackageContainer}>
              <TouchableOpacity onPress={() => setOpenPackageModal(true)}>
                <ThemedText type='mini' style={styles.sectionTitle}>Package type</ThemedText>
                <ThemedText style={styles.sectionTitle}>Tap to select</ThemedText>
              </TouchableOpacity>
            </ThemedView>
            <Modal
              animationType='slide'
              transparent={true}
              visible={openPackageModal}
              onRequestClose={() => setOpenPackageModal(false)}
            >
              <ThemedView style={styles.modalContent}>
                <ThemedView style={styles.modalTitleContainer}>
                  <ThemedText style={styles.title}>Shipping Package Options</ThemedText>
                  <MaterialIcons >
                    <TouchableOpacity onPress={() => setOpenPackageModal(false)}>
                      <MaterialIcons name="close" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    </TouchableOpacity>
                  </MaterialIcons>
                </ThemedView>
                <Divider />
                <ThemedView style={styles.modalBodyContainer}>
                  <ThemedText type='mini' style={styles.title}>Packaging dimensions are written as length x width x height</ThemedText>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {getPackageDetailDimension.map((packageDetail) => (
                      <TouchableOpacity
                        key={packageDetail.id}
                        onPress={() => {
                          setDimensions({
                            length: packageDetail.length,
                            width: packageDetail.width,
                            height: packageDetail.height
                          });
                          setNumberOfPieces('1');
                          setWeight(packageDetail.weight.toString());
                          setOpenPackageModal(false);
                          setShowPackageDetail(true);
                        }}
                      >
                        <ThemedView style={styles.selectPackageContainer}>
                          <ThemedText style={styles.sectionTitle}>{packageDetail.name}</ThemedText>
                          <ThemedText style={styles.sectionTitle}>
                            {packageDetail.length} x {packageDetail.width} x {packageDetail.height} cm, {packageDetail.weight} kg
                          </ThemedText>
                        </ThemedView>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>


                </ThemedView>
              </ThemedView>
            </Modal>
            {showPackageDetail && <>
              <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Dimensions (cm)</ThemedText>
                <ThemedView style={styles.dimensionsRow}>
                  {['Length', 'Width', 'Height'].map((dimension) => (
                    <ThemedView key={dimension} style={styles.inputWrapper}>
                      <ThemedText style={styles.inputLabel}>{dimension}</ThemedText>
                      <ThemedView style={styles.inputContainer}>
                        <TextInput
                          style={[styles.input, { color: colorScheme === 'dark' ? 'white' : 'black' }]}
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
                        style={[styles.input, { color: colorScheme === 'dark' ? 'white' : 'black' }]}
                        placeholder="0"
                        value={packageDetail.numberOfPieces}
                        keyboardType="numeric"
                        onChangeText={handleInputPieceChange}
                      />
                    </ThemedView>
                  </ThemedView>

                  <ThemedView style={[styles.inputWrapper, { flex: 0.7 }]}>
                    <ThemedText style={styles.inputLabel}>Weight per Piece</ThemedText>
                    <ThemedView style={styles.inputContainer}>
                      <TextInput
                        style={[styles.input, { color: colorScheme === 'dark' ? 'white' : 'black' }]}
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
                  <ThemedText style={styles.summaryValue}>{packageDetail.numberOfPieces || '0'}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.summaryRow}>
                  <ThemedText style={styles.summaryLabel}>Total Weight</ThemedText>
                  <ThemedText style={styles.summaryValue}>{totalWeight} kg</ThemedText>
                </ThemedView>
              </ThemedView>
            </>}
          </>
        }

        {/* document type when checkbox is checked document */}

        {itemType === 'DOCUMENT' &&
          <ThemedView style={styles.numberOfDocumentsContainer}>
            <ThemedText style={styles.title}>{'Number of document(s)'}</ThemedText>
            <TextInput
              style={[styles.documentInput, { color: colorScheme === 'dark' ? 'white' : 'black' }]}
              placeholder="0"
              value={packageDetail.numberOfPieces}
              keyboardType="numeric"
              onChangeText={
                (text) => setPackageDetail({ ...packageDetail, numberOfPieces: text })
              }
            />
          </ThemedView>
        }




        <Divider style={{ marginVertical: verticalScale(16) }} />
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
    marginBottom: verticalScale(22),
  },
  title: {
    marginBottom: verticalScale(8),
  },
  titleUnderline: {
    width: horizontalScale(60),
    height: verticalScale(4),
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(2),
  },

  section: {
    marginBottom: verticalScale(32),
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  dimensionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(8),
  },
  quantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(8),
  },
  inputWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginBottom: verticalScale(8),

  },
  inputContainer: {
    position: 'relative',
    height: verticalScale(48),
  },
  input: {
    flex: 1,
    borderWidth: moderateScale(1),
    borderColor: '#E2E8F0',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(14),
    paddingRight: horizontalScale(40),
    fontSize: moderateScale(16),
    height: verticalScale(48),
    width: '100%',

  },
  numberOfDocumentsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  documentInput: {
    borderWidth: moderateScale(1),
    borderColor: '#E2E8F0',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(14),
    paddingRight: horizontalScale(40),
    fontSize: moderateScale(16),
    height: verticalScale(48),
    width: '30%',
    marginBottom: verticalScale(16),
  },
  unitText: {
    position: 'absolute',
    right: moderateScale(14),
    top: '50%',
    transform: [{ translateY: -8 }],
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#718096',
  },
  summary: {

    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(24),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
  },
  summaryLabel: {
    fontSize: moderateScale(16),
    color: '#4A5568',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#2D3748',
  },
  selectPackageContainer: {
    borderWidth: moderateScale(1),
    borderColor: '#E2E8F0',
    borderRadius: moderateScale(12),
    paddingTop: verticalScale(12),
    paddingLeft: horizontalScale(14),
    marginBottom: verticalScale(16),
  },
  modalContent: {
    height: '70%',
    width: '100%',
    borderTopRightRadius: horizontalScale(18),
    borderTopWidth: verticalScale(4),
    borderTopColor: '#FFAC1C',
    borderTopLeftRadius: horizontalScale(18),
    position: 'absolute',
    bottom: 0,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  modalBodyContainer: {
    padding: moderateScale(20),
  },

});

export default SelectPackage;