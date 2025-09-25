import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, useColorScheme } from 'react-native'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import useShipmentStore from '@/store/shipmentStore'
import useLoginAccountStore from '@/store/loginAccountStore'
import { Divider } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors';

const ShippingOptions = () => {
  const { savedAddressData, packageDetail, accountAddressData, itemType } = useShipmentStore()
  const { accountLoginData } = useLoginAccountStore()
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  console.log(itemType,"itemType");

  const renderAddressBlock = (title, data, icon) => (
    <View style={[styles.addressContainer, { backgroundColor: themeColors.background }]}>
      <View style={styles.addressHeader}>
        <MaterialCommunityIcons name={icon} size={24} color="#666" />
        <Text style={[styles.addressHeaderText, { color: themeColors.text }]}>{title}</Text>
      </View>
      
      <View style={[styles.addressDetailsContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.addressNameText, { color: themeColors.text }]}>
          {`${data.name}`}
        </Text>
        <Text style={[styles.addressLocationText, { color: themeColors.text }]}>
          {`${data.state}${data.country?.name ? `, ${data.country.name}` : ''}`}
        </Text>
        <Text style={[styles.contactInfoText, { color: themeColors.text }]}>{data.email}</Text>
        <Text style={[styles.contactInfoText, { color: themeColors.text }]}>
          {`${data.mobileCode || data.countryCode}${data.mobileNumber}`}
        </Text>
      </View>
    </View>
  )

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Package Details */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name="package-variant" size={24} color="#666" />
            <Text style={[styles.sectionTitleText, { color: themeColors.text }]}>
              Shipment Details
            </Text>
          </View>
          
          <View style={[styles.packageDetailsContainer, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.packageNameText, { color: themeColors.text }]}>
              {packageDetail.packageName}
            </Text>
           {itemType === "PACKAGE" && <Text style={[styles.packageMetaText, { color: themeColors.text }]}>
              {`Dimensions: ${packageDetail.length} × ${packageDetail.width} × ${packageDetail.height} cm`}
            </Text>}
            <Text style={[styles.packageMetaText, { color: themeColors.text }]}>
              {`${packageDetail.numberOfPieces} Piece(s) • ${packageDetail.weight} kg`}
            </Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Shipping Addresses */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <Text style={[styles.sectionTitleText, { color: themeColors.text }]}>
            Shipping From/To
          </Text>
          
          {renderAddressBlock('From', {...accountLoginData, ...accountAddressData}, 'arrow-up-circle')}
          <View style={[styles.addressConnector, { backgroundColor: themeColors.text }]} />
          {renderAddressBlock('To', savedAddressData, 'arrow-down-circle')}
        </View>

        <Divider style={styles.divider} />

        {/* Shipping Options */}
     

        <TouchableOpacity 
          style={styles.continueButton} 
          onPress={() => router.push('/(tabs)/home/createShipment/shippingOptionalService')}
        >
          <Text style={styles.continueButtonText}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
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
    lineHeight: moderateScale(22),
    fontWeight: '600',
    marginLeft: horizontalScale(8),
  },
  packageDetailsContainer: {
    padding: verticalScale(12),
    borderRadius: moderateScale(8),
  },
  packageNameText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(4),
  },
  packageMetaText: {
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
    lineHeight: moderateScale(22),
    fontWeight: '600',
  },
  addressDetailsContainer: {

    padding: verticalScale(12),
    borderRadius: moderateScale(8),
    marginLeft: horizontalScale(32),
  },
  addressNameText: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(4),
  },
  addressLocationText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(4),
  },
  contactInfoText: {
    fontSize: 14,
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(2),
  },
  addressConnector: {
    height: verticalScale(16),
    width: horizontalScale(2),
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
    color: 'white',
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600',
  }
})