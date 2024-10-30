import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

const SingleListing = () => {
  return (
    <ThemedView style={styles.mainContainer}>
        <ThemedText>SingleListing</ThemedText>
    </ThemedView>
  )
}

export default SingleListing

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})