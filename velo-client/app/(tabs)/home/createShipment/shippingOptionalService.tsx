import { StyleSheet, TouchableOpacity,ScrollView } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { SafeAreaView } from 'react-native-safe-area-context'
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics'
import { Divider } from 'react-native-paper'
import Checkbox from 'expo-checkbox'
import useShipmentStore from '@/store/shipmentStore'
import { router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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
  console.log(cummilativeExpence, 'cummilativeExpence');
  

  const ServiceCard = ({ service }) => (
    <ThemedView style={styles.serviceCard}>
      <ThemedView style={styles.checkboxWrapper}>
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
      </ThemedView>
      
      <ThemedView style={styles.serviceContent}>
        <ThemedView style={styles.serviceHeader}>
          <MaterialCommunityIcons name={service.icon} size={24} color="#666" />
          <ThemedText type='defaultSemiBold' style={styles.serviceName}>
            {service.name}
          </ThemedText>
        </ThemedView>
        
        <ThemedText type='default' style={styles.serviceDescription}>
          {service.description}
        </ThemedText>
        
        <ThemedView style={styles.priceContainer}>
          <ThemedText type='defaultSemiBold' style={styles.priceText}>
            AED {service.price}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  )

  return (
    <ScrollView style={styles.container}>
    <ThemedView >
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerContent}>
            
            <ThemedText type='defaultSemiBold' style={styles.headerTitle}>
              Optional Services
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.headerDescription}>
            Select additional services you want for your shipment. Charges are mentioned below.
          </ThemedText>
        </ThemedView>

        <Divider style={styles.divider} />

        <ThemedView >
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Available Services
          </ThemedText>

          <ThemedView style={styles.servicesList}>
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </ThemedView>
        </ThemedView>

        <TouchableOpacity 
          style={styles.buttonContainer}
          onPress={() => router.push('/(tabs)/home/createShipment/shipmentSchedulePickup')}
        >
          <ThemedText style={styles.buttonText}>
            Continue
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
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
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
})