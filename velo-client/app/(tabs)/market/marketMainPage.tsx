import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

const Market = () => {
  return (
    <ThemedView style={styles.container}>
        <ThemedText type='logoText' style={styles.logoText}>Velo</ThemedText>
        </ThemedView>
)
}

export default Market

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20,
    },
    logoText: {
        marginTop: 60,
    },
})