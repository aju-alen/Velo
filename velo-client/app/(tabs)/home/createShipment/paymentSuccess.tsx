import { StyleSheet } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

const paymentSuccess = () => {
  return (
    <ThemedView>
        <ThemedText>Payment Success</ThemedText>
    </ThemedView>
  )
}

export default paymentSuccess

const styles = StyleSheet.create({})