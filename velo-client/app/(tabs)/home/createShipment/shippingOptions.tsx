import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale } from '@/constants/metrics'
import useShipmentStore from '@/store/shipmentStore'
import useLoginAccountStore from '@/store/loginAccountStore'
import { Divider } from 'react-native-paper'


const shippingOptions = () => {
  const { savedAddressData, packageDetail, packageDescription, accountAddressData } = useShipmentStore()
  const { accountLoginData } = useLoginAccountStore()
  console.log(savedAddressData, packageDetail, packageDescription, 'zustand component');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type='defaultSemiBold' style={styles.headerText}>Your shipment details</ThemedText>
        <ThemedText type='default'>{packageDetail.packageName}</ThemedText>
        <ThemedText type='default'>{`${packageDetail.length} x ${packageDetail.width} x ${packageDetail.height}(cm)`}</ThemedText>
        <ThemedText type='default'>{`${packageDetail.numberOfPieces} Piece(s), ${packageDetail.weight} kg`}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.shippingDetailContainer}>
        <ThemedText type='defaultSemiBold'>Shipping from/to</ThemedText>
        <ThemedText type='default'>{`From:${accountLoginData.name},${accountAddressData.state},${accountAddressData.country.name}`}</ThemedText>
        <ThemedText type='default'>{accountLoginData.email}</ThemedText>
        <ThemedText type='default'>{`${accountLoginData.mobileCode}${accountLoginData.mobileNumber}`}</ThemedText>
        <ThemedText type='default'>{`To:${savedAddressData.name},${savedAddressData.state}`}</ThemedText>
        <ThemedText type='default'>{savedAddressData.email}</ThemedText>
        <ThemedText type='default'>{`${savedAddressData.countryCode}${savedAddressData.mobileNumber}`}</ThemedText>
      </ThemedView>
      <Divider/>
      <ThemedView style={styles.shippingDetailContainer}>
        <ThemedText type='defaultSemiBold'>Select a shipping option</ThemedText>
        
      </ThemedView>


    </ThemedView>
  )
}

export default shippingOptions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(60),
    paddingLeft: verticalScale(20),
    paddingRight: verticalScale(20),
  },
  headerContainer: {

    justifyContent: 'space-between',
    marginBottom: verticalScale(24),
  },
  headerText: {
  },
  shippingDetailContainer:{

  }
})