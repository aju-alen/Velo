import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import useShipmentStore from '@/store/shipmentStore'
import useLoginAccountStore from '@/store/loginAccountStore'
import { Divider } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

const ShippingOptions = () => {
  const { savedAddressData, packageDetail, accountAddressData, itemType } = useShipmentStore()
  const { accountLoginData } = useLoginAccountStore()
  console.log(itemType,"itemType");

  const renderAddressBlock = (title, data, icon) => (
    <ThemedView style={styles.addressContainer}>
      <ThemedView style={styles.addressHeader}>
        <MaterialCommunityIcons name={icon} size={24} color="#666" />
        <ThemedText type='defaultSemiBold' style={styles.addressHeaderText}>{title}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.addressDetailsContainer}>
        <ThemedText style={styles.addressNameText}>
          {`${data.name}`}
        </ThemedText>
        <ThemedText style={styles.addressLocationText}>
          {`${data.state}${data.country?.name ? `, ${data.country.name}` : ''}`}
        </ThemedText>
        <ThemedText style={styles.contactInfoText}>{data.email}</ThemedText>
        <ThemedText style={styles.contactInfoText}>
          {`${data.mobileCode || data.countryCode}${data.mobileNumber}`}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  )

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        {/* Package Details */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedView style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name="package-variant" size={24} color="#666" />
            <ThemedText type='defaultSemiBold' style={styles.sectionTitleText}>
              Shipment Details
            </ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.packageDetailsContainer}>
            <ThemedText style={styles.packageNameText}>
              {packageDetail.packageName}
            </ThemedText>
           {itemType === "PACKAGE" && <ThemedText style={styles.packageMetaText}>
              {`Dimensions: ${packageDetail.length} × ${packageDetail.width} × ${packageDetail.height} cm`}
            </ThemedText>}
            <ThemedText style={styles.packageMetaText}>
              {`${packageDetail.numberOfPieces} Piece(s) • ${packageDetail.weight} kg`}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <Divider style={styles.divider} />

        {/* Shipping Addresses */}
        <ThemedView style={styles.sectionContainer}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitleText}>
            Shipping From/To
          </ThemedText>
          
          {renderAddressBlock('From', {...accountLoginData, ...accountAddressData}, 'arrow-up-circle')}
          <ThemedView style={styles.addressConnector} />
          {renderAddressBlock('To', savedAddressData, 'arrow-down-circle')}
        </ThemedView>

        <Divider style={styles.divider} />

        {/* Shipping Options */}
     

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => router.push('/(tabs)/home/createShipment/shippingOptionalService')}
        >
          <ThemedText style={styles.continueButtonText}>
            Continue
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ScrollView>
  )
}

export default ShippingOptions

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: horizontalScale(16),
  },
  sectionContainer: {
    marginBottom: verticalScale(16),
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitleText: {
    fontSize: moderateScale(18),
    marginLeft: horizontalScale(8),
  },
  packageDetailsContainer: {
    padding: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  packageNameText: {
    fontSize: moderateScale(16),
    marginBottom: verticalScale(4),
  },
  packageMetaText: {
    color: '#666',
    marginBottom: verticalScale(4),
  },
  divider: {
    marginVertical: verticalScale(16),
  },
  addressContainer: {
    marginVertical: verticalScale(8),
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  addressHeaderText: {
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(16),
  },
  addressDetailsContainer: {

    padding: verticalScale(12),
    borderRadius: moderateScale(8),
    marginLeft: horizontalScale(32),
  },
  addressNameText: {
    fontSize: moderateScale(15),
    marginBottom: verticalScale(4),
  },
  addressLocationText: {
    fontSize: moderateScale(14),
    color: '#666',
    marginBottom: verticalScale(4),
  },
  contactInfoText: {
    color: '#666',
    fontSize: 14,
    marginBottom: verticalScale(2),
  },
  addressConnector: {
    height: verticalScale(16),
    width: horizontalScale(2),
    backgroundColor: '#666',
    marginLeft: horizontalScale(40),
  },
  continueButton: {
    backgroundColor: '#FFAC1C',
    padding: verticalScale(12),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(24),
  },
  continueButtonText: {

    fontWeight: '600',
  }
})