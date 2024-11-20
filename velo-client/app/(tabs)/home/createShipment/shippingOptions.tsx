import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale } from '@/constants/metrics'
import useShipmentStore from '@/store/shipmentStore'
import useLoginAccountStore from '@/store/loginAccountStore'
import { Divider } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

const ShippingOptions = () => {
  const { savedAddressData, packageDetail, packageDescription, accountAddressData } = useShipmentStore()
  const { accountLoginData } = useLoginAccountStore()

  const renderAddressBlock = (title, data, icon) => (
    <ThemedView style={styles.addressBlock}>
      <ThemedView style={styles.addressHeader}>
        <MaterialCommunityIcons name={icon} size={24} color="#666" />
        <ThemedText type='defaultSemiBold' style={styles.addressTitle}>{title}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.addressContent}>
        <ThemedText type='default' style={styles.addressText}>
          {`${data.name}, ${data.state}${data.country?.name ? `, ${data.country.name}` : ''}`}
        </ThemedText>
        <ThemedText type='default' style={styles.contactText}>{data.email}</ThemedText>
        <ThemedText type='default' style={styles.contactText}>
          {`${data.mobileCode || data.countryCode}${data.mobileNumber}`}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  )

  return (
    <ScrollView >
    <ThemedView style={styles.container}>
      {/* Package Details Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <MaterialCommunityIcons name="package-variant" size={24} color="#666" />
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>Your shipment details</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.packageDetails}>
          <ThemedText type='default' style={styles.packageName}>{packageDetail.packageName}</ThemedText>
          <ThemedText type='default' style={styles.dimensionText}>
            {`Dimensions: ${packageDetail.length} × ${packageDetail.width} × ${packageDetail.height} cm`}
          </ThemedText>
          <ThemedText type='default' style={styles.weightText}>
            {`${packageDetail.numberOfPieces} Piece(s) • ${packageDetail.weight} kg`}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <Divider style={styles.divider} />

      {/* Shipping Addresses Section */}
      <ThemedView style={styles.section}>
        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>Shipping from/to</ThemedText>
        
        {renderAddressBlock('From', {...accountLoginData, ...accountAddressData}, 'arrow-up-circle')}
        <ThemedView style={styles.addressDivider} />
        {renderAddressBlock('To', savedAddressData, 'arrow-down-circle')}
      </ThemedView>

      <Divider style={styles.divider} />

      {/* Shipping Options Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <MaterialCommunityIcons name="truck-delivery" size={24} color="#666" />
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>Select a shipping option</ThemedText>
        </ThemedView>
        {/* Add your shipping options here */}
      </ThemedView>
      <TouchableOpacity style={styles.buttonContainer} onPress={()=>router.push('/(tabs)/home/createShipment/shippingOptionalService')}>
        <ThemedText>
          Continue
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
    </ScrollView>
  )
}

export default ShippingOptions

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: 18,
    marginLeft: horizontalScale(8),
  },
  packageDetails: {

    padding: verticalScale(12),
    borderRadius: 8,
    marginTop: verticalScale(8),
  },
  packageName: {
    fontSize: 16,
    marginBottom: verticalScale(4),
  },
  dimensionText: {
    color: '#666',
    marginBottom: verticalScale(4),
  },
  weightText: {
    color: '#666',
  },
  divider: {
    marginVertical: verticalScale(16),
  },
  addressBlock: {
    marginVertical: verticalScale(8),
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(0),
  },
  addressTitle: {
    marginLeft: horizontalScale(8),
    fontSize: 16,
  },
  addressContent: {

    padding: verticalScale(12),
    borderRadius: 8,
    marginLeft: horizontalScale(32),
  },
  addressText: {
    fontSize: 15,
    marginBottom: verticalScale(0),
  },
  contactText: {
    color: '#666',
    fontSize: 14,
    marginBottom: verticalScale(2),
  },
  addressDivider: {

    width: 2,
    marginLeft: horizontalScale(11),
  },
  buttonContainer:{
    backgroundColor: '#FFAC1C',
    padding: verticalScale(12),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(24),
  }
})