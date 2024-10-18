import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const homeMainPage = () => {
  return (
   <ThemedView style={styles.container}>
    <ThemedText >
      Home Main Page
    </ThemedText>
   </ThemedView>
  )
}

export default homeMainPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})