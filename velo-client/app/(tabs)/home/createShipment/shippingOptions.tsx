import React from 'react'
import { ScrollView, StyleSheet, TouchableOpacity, View, Text, useColorScheme, SafeAreaView } from 'react-native'
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
        <MaterialCommunityIcons name={icon} size={24} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
        <Text style={[styles.addressHeaderText, { color: themeColors.text }]}>{title}</Text>
      </View>
      
      <View style={[styles.addressDetailsContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Package Details */}
        <View style={[styles.sectionContainer, { backgroundColor: themeColors.background }]}>
          <View style={styles.sectionTitleContainer}>
            <MaterialCommunityIcons name="package-variant" size={24} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
            <Text style={[styles.sectionTitleText, { color: themeColors.text }]}>
              Shipment Details
            </Text>
          </View>
          
          <View style={[styles.packageDetailsContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
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
    </SafeAreaView>
  )
}

export default ShippingOptions

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: verticalScale(20),
  },
  container: {
    flex: 1,
    padding: horizontalScale(16),
  },
  sectionContainer: {
    marginBottom: verticalScale(12),
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  sectionTitleText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(20),
    fontWeight: '600',
    marginLeft: horizontalScale(8),
  },
  packageDetailsContainer: {
    padding: horizontalScale(12),
    marginTop: verticalScale(6),
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  packageNameText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(20),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  packageMetaText: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(2),
    opacity: 0.8,
  },
  divider: {
    marginVertical: verticalScale(10),
  },
  addressContainer: {
    marginVertical: verticalScale(6),
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  addressHeaderText: {
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(15),
    lineHeight: moderateScale(20),
    fontWeight: '600',
  },
  addressDetailsContainer: {
    padding: horizontalScale(12),
    marginTop: verticalScale(4),
    marginLeft: horizontalScale(32),
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressNameText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(20),
    fontWeight: '600',
    marginBottom: verticalScale(3),
  },
  addressLocationText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(3),
    opacity: 0.9,
  },
  contactInfoText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(2),
    opacity: 0.8,
  },
  addressConnector: {
    height: verticalScale(12),
    width: horizontalScale(2),
    marginLeft: horizontalScale(40),
    marginVertical: verticalScale(2),
    opacity: 0.3,
  },
  continueButton: {
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(20),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  continueButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600',
  }
})