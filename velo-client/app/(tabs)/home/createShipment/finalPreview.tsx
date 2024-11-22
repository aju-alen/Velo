import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import useShipmentStore from '@/store/shipmentStore';
import { Divider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics';

const FinalPreview = () => {
  const { 
    savedAddressData, 
    packageDetail, 
    packageDescription, 
    accountAddressData, 
    deliveryServices 
  } = useShipmentStore();

  const renderAddressCard = (title, data) => (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <Divider style={styles.cardDivider} />
      <ThemedText style={styles.nameText}>{data.userName || data.name}</ThemedText>
      <ThemedText style={styles.detailText}>
        {data.addressOne}, {data.addressTwo}
      </ThemedText>
      <ThemedText style={styles.detailText}>
        {data.city}, {data.state}
      </ThemedText>
      <ThemedText style={styles.detailText}>{data.email}</ThemedText>
      <ThemedText style={styles.detailText}>
        {data.countryCode} {data.mobileNumber}
      </ThemedText>
    </ThemedView>
  );

  const renderIconHeader = (iconName, title) => (
    <ThemedView style={styles.sectionHeader}>
      <Ionicons name={iconName} size={24} color="#FFAC1C" />
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Shipment Details Section */}
      <ThemedView style={styles.section}>
        {renderIconHeader("cube-outline", "Shipment Details")}
        <Divider style={styles.sectionDivider} />
        
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Shipping Date</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.highlightText}>
            {savedAddressData.shipmentDate.toDateString()}
          </ThemedText>
        </ThemedView>

        {/* Shipping From */}
        {renderAddressCard('Shipping From', accountAddressData)}

        {/* Shipping To */}
        {renderAddressCard('Shipping To', savedAddressData)}

        {/* Package Details */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Package Details</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.detailText}>{packageDetail.packageName}</ThemedText>
          <ThemedText style={styles.detailText}>
            Dimensions: {packageDetail.length} x {packageDetail.width} x {packageDetail.height} cm
          </ThemedText>
          <ThemedText style={styles.detailText}>
            {packageDetail.numberOfPieces} Piece(s) • {packageDetail.weight} kg
          </ThemedText>
        </ThemedView>

        {/* Package Description */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Package Description</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.detailText}>{packageDescription}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Pickup Details Section */}
      <ThemedView style={styles.section}>
        {renderIconHeader("time-outline", "Pickup Details")}
        <Divider style={styles.sectionDivider} />

        {/* Pickup Time */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Pickup Time</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.highlightText}>
            {deliveryServices.deliveryPickupTimeFrom} - {deliveryServices.deliveryPickupTimeTo}
          </ThemedText>
        </ThemedView>

        {/* Pickup Instructions */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Pickup Instruction</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.detailText}>
            {deliveryServices.pickupInstruction || 'No specific instructions provided'}
          </ThemedText>
        </ThemedView>

        {/* Special Instructions */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Special Instruction</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.detailText}>
            {deliveryServices.pickupSpecialInstruction || 'No special instructions provided'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity onPress={()=>router.push('/(tabs)/home/createShipment/payment')}>
          <ThemedText style={styles.finalPreviewText}>Confirm Shipment</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  );
};

export default FinalPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal:horizontalScale(16),

  },
  section: {
    marginBottom: verticalScale(24),
    padding: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',

    marginLeft: horizontalScale(8),
  },
  sectionDivider: {
    marginVertical: verticalScale(12),

  },
  card: {
    padding: moderateScale(16),

    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',

    marginBottom: verticalScale(8),
  },
  cardDivider: {
    marginVertical: verticalScale(8),

  },
  nameText: {
    fontSize: moderateScale(16),
    fontWeight: '500',

    marginBottom: verticalScale(4),
  },
  detailText: {
    fontSize: moderateScale(14),

    marginBottom: verticalScale(4),
  },
  highlightText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#FFAC1C',
  },
  confirmButtonContainer:{
    alignItems: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(32),
    paddingVertical: verticalScale(12),
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(10),
  },
  buttonContainer: {
    backgroundColor: '#FFAC1C',
    padding: horizontalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: horizontalScale(24),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    fontSize: moderateScale(16),

  },
  finalPreviewText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});
