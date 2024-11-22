import React, { useEffect, useRef } from 'react'
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Animated 
} from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { router } from 'expo-router'
import useShipmentStore from '@/store/shipmentStore'
import { useLocalSearchParams } from 'expo-router'

const { width, height } = Dimensions.get('window')

const PaymentSuccess = () => {
  const {totalAmount} = useLocalSearchParams();
  // Animation values
  const scaleValue = useRef(new Animated.Value(0)).current
  const fadeValue = useRef(new Animated.Value(0)).current
  const translateYValue = useRef(new Animated.Value(50)).current

  // Get shipment details from store
  const { savedAddressData, packageDetail,deliveryServices } = useShipmentStore()

  useEffect(() => {
    // Parallel animation sequence
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.spring(translateYValue, {
        toValue: 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true
      })
    ]).start()
  }, [])

  const navigateToHome = () => {
    router.replace('/(tabs)/home/homeMainPage')
  }

  const AnimatedDetailsRow = ({ icon, label, value }) => (
    <ThemedView style={styles.detailRow}>
      <MaterialIcons name={icon} size={24} color="#FFAC1C" />
      <ThemedView style={styles.detailTextContainer}>
        <ThemedText style={styles.detailLabel}>{label}</ThemedText>
        <ThemedText style={styles.detailValue}>{value}</ThemedText>
      </ThemedView>
    </ThemedView>
  )

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        style={[
          styles.successContainer,
          {
            transform: [
              { scale: scaleValue },
              { translateY: translateYValue }
            ],
            opacity: fadeValue
          }
        ]}
      >
        {/* Success Icon */}
        <Animated.View 
          style={[
            styles.successIconContainer,
            {
              transform: [{ scale: scaleValue }]
            }
          ]}
        >
          <MaterialIcons name="check-circle" size={100} color="#FFAC1C" />
        </Animated.View>

        {/* Success Title */}
        <ThemedText style={styles.successTitle}>
          Payment Successful!
        </ThemedText>

        {/* Details Section */}
        <ThemedView style={styles.detailsSection}>
          <AnimatedDetailsRow 
            icon="local-shipping" 
            label="Shipment Date" 
            value={new Date(savedAddressData.shipmentDate).toLocaleDateString()} 
          />
          <AnimatedDetailsRow 
            icon="category" 
            label="Package Weight" 
            value={`${packageDetail.weight} kg`} 
          />
          <AnimatedDetailsRow 
            icon="account-balance-wallet" 
            label="Payment Amount" 
            value={`AED ${totalAmount}`} 
          />
          <AnimatedDetailsRow 
            icon="account-balance-wallet" 
            label="Payment Amount" 
            value={`AED ${totalAmount}`} 
          />
        </ThemedView>

        {/* Home Button */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={navigateToHome}
        >
          <ThemedText style={styles.homeButtonText}>
            Back to Home
          </ThemedText>
          <MaterialIcons name="home" size={20} color='black' />
        </TouchableOpacity>
      </Animated.View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  successContainer: {
    width: width * 0.9,

    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  successIconContainer: {
    marginBottom: 20,
    borderRadius: 60,
    padding: 10,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailsSection: {
    width: '100%',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
  },
  detailTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    flexDirection: 'row',
    backgroundColor: '#FFAC1C',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 8,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})

export default PaymentSuccess