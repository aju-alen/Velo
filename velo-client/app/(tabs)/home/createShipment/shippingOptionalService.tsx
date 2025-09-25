import { StyleSheet, TouchableOpacity,ScrollView, View, Text, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics'
import { Divider } from 'react-native-paper'
import Checkbox from 'expo-checkbox'
import useShipmentStore from '@/store/shipmentStore'
import { router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors';

const services = [
  {
    id: 'verbalNotification',
    name: 'Verbal Notification',
    description: 'Get a call before delivery',
    price: 10,
    icon: 'phone-in-talk'
  },
  {
    id: 'adultSignature',
    name: 'Adult Signature',
    description: 'Item will be delivered to an adult at the specified address',
    price: 20,
    icon: 'account-check'
  },
  {
    id: 'directSignature',
    name: 'Direct Signature',
    description: 'Recipient must be available to sign for the package',
    price: 20,
    icon: 'signature-freehand'
  }
]

const ShippingOptionalService = () => {
  const { deliveryServices, setDeliveryServices,setCuminativeExpence,cummilativeExpence } = useShipmentStore()
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  console.log(cummilativeExpence, 'cummilativeExpence');
  

  const ServiceCard = ({ service }) => (
    <View style={[styles.serviceCard, { backgroundColor: themeColors.background }]}>
      <View style={styles.checkboxWrapper}>
        <Checkbox
          value={deliveryServices[service.id]}
          onValueChange={(value) => {
            console.log('value', value);
            
            setDeliveryServices({ [service.id]: value }); // Update the delivery service value
        
            // Log the service ID and update cumulative expense
            console.log('service.id', service.id);
            setCuminativeExpence({ [service.id]: value ? service.price : 0 });
          }}
          style={styles.checkbox}
        />
      </View>
      
      <View style={styles.serviceContent}>
        <View style={styles.serviceHeader}>
          <MaterialCommunityIcons name={service.icon} size={24} color="#666" />
          <Text style={[styles.serviceName, { color: themeColors.text }]}>
            {service.name}
          </Text>
        </View>
        
        <Text style={[styles.serviceDescription, { color: themeColors.text }]}>
          {service.description}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>
            AED {service.price}
          </Text>
        </View>
      </View>
    </View>
  )

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]}>
    <View >
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
        <View style={[styles.header, { backgroundColor: themeColors.background }]}>
          <View style={styles.headerContent}>
            
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>
              Optional Services
            </Text>
          </View>
          <Text style={[styles.headerDescription, { color: themeColors.text }]}>
            Select additional services you want for your shipment. Charges are mentioned below.
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={{ backgroundColor: themeColors.background }}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
            Available Services
          </Text>

          <View style={styles.servicesList}>
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.buttonContainer}
          onPress={() => router.push('/(tabs)/home/createShipment/shipmentSchedulePickup')}
        >
          <Text style={styles.buttonText}>
            Continue
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
    </ScrollView>
  )
}

export default ShippingOptionalService

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
  },
  header: {
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    lineHeight: moderateScale(22),
    fontWeight: '600',
    marginLeft: horizontalScale(8),
  },
  headerDescription: {

    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
  },
  divider: {
    marginVertical: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(22),
    fontWeight: '600',
    marginBottom: verticalScale(16),
  },
  servicesList: {
    gap: verticalScale(12),
  },
  serviceCard: {
    flexDirection: 'row',

    borderRadius: 12,
    padding: horizontalScale(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  checkboxWrapper: {
    justifyContent: 'center',
    marginRight: horizontalScale(12),
  },
  checkbox: {
    height: verticalScale(22),
    width: horizontalScale(22),
  },
  serviceContent: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  serviceName: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600',
    marginLeft: horizontalScale(8),
  },
  serviceDescription: {

    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(8),
  },
  priceContainer: {
    alignSelf: 'flex-start',

    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(16),
  },
  priceText: {
    color: '#FFAC1C',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    fontWeight: '600',
  },
  buttonContainer: {
    backgroundColor: '#FFAC1C',
    padding: verticalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(24),
    marginBottom: verticalScale(24),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
})