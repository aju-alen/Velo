import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale } from '@/constants/metrics'

const shippingOptions = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.headerContainer}>
        <ThemedText type='defaultSemiBold' style={styles.headerText}>Your shipment details</ThemedText>
      </ThemedView>
      
    </ThemedView>
  )
}

export default shippingOptions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:verticalScale(60),
        paddingLeft:verticalScale(20),
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(24),
    },
    headerText: {
    },
})