import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native'
import React from 'react'
import { MaterialIcons, Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import * as SecureStore from 'expo-secure-store'

const guestOnboarding = () => {
  const colorScheme = useColorScheme() ?? 'light'
  const themeColors = Colors[colorScheme]
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF'
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0'

  type AvailableFeatures = {
    icon: keyof typeof MaterialIcons.glyphMap
    title: string
    description: string
    available: boolean
  }

  const availableFeatures: AvailableFeatures[] = [
    {
      icon: 'visibility',
      title: 'Browse Market',
      description: 'View available listings and products',
      available: true
    },
    {
      icon: 'info',
      title: 'View Product Details',
      description: 'See detailed information about items',
      available: true
    },
    {
      icon: 'shopping-cart',
      title: 'Create Shipments',
      description: 'Book and manage your shipments',
      available: false
    },
    {
      icon: 'history',
      title: 'Order History',
      description: 'View your shipping history',
      available: false
    },
    {
      icon: 'account-circle',
      title: 'Profile Management',
      description: 'Manage your account settings',
      available: false
    }
  ]

  const handleContinue = async () => {
    await SecureStore.setItemAsync('registerDetail', JSON.stringify({
      role: 'GUEST',
      registerVerificationStatus: 'GUEST',
    }));
    router.replace('/(tabs)/home/homeMainPage')
  }

  const handleSignUp = () => {
    router.replace('/(auth)/chooseRole')
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: themeColors.tint }]}>
            <MaterialIcons name="person-outline" size={moderateScale(40)} color="#FFF" />
          </View>
          <Text style={[styles.title, { color: themeColors.text }]}>
            Guest Mode
          </Text>
          <Text style={[styles.subtitle, { color: themeColors.text }]}>
            You're browsing as a guest
          </Text>
        </View>

        {/* Info Card */}
        <View style={[styles.infoCard, { backgroundColor: bgCard, borderColor }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle" size={moderateScale(24)} color={themeColors.tint} />
            <Text style={[styles.infoTitle, { color: themeColors.text }]}>
              Limited Access
            </Text>
          </View>
          <Text style={[styles.infoText, { color: themeColors.text }]}>
            As a guest, you have limited access to features. To unlock all functionality, 
            please create an account or sign in.
          </Text>
        </View>

       

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: themeColors.tint }]}
            onPress={handleContinue}
          >
            <Text style={styles.primaryButtonText}>
              Continue as Guest
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.secondaryButton, { borderColor: themeColors.tint }]}
            onPress={handleSignUp}
          >
            <Text style={[styles.secondaryButtonText, { color: themeColors.tint }]}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default guestOnboarding

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(40),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  iconContainer: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(16),
    opacity: 0.7,
  },
  infoCard: {
    padding: horizontalScale(20),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    marginBottom: verticalScale(30),
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  infoTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginLeft: horizontalScale(10),
  },
  infoText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    opacity: 0.8,
  },
  featuresContainer: {
    marginBottom: verticalScale(30),
  },
  featuresTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    marginBottom: verticalScale(20),
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: horizontalScale(16),
    borderRadius: moderateScale(8),
    borderWidth: 1,
    marginBottom: verticalScale(12),
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12),
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  featureDescription: {
    fontSize: moderateScale(12),
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
  },
  statusText: {
    color: '#FFF',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  buttonContainer: {
    gap: verticalScale(16),
  },
  primaryButton: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
})