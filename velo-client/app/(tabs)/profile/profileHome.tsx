import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'

const ProfileHome = () => {
  return (
    <ThemedView style={styles.container}>
        <ThemedText>Profile Home</ThemedText>
    </ThemedView>
  )
}

export default ProfileHome

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
})