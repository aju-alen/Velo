import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useStripe } from '@stripe/stripe-react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Divider } from 'react-native-paper'
import { router } from 'expo-router'

// Store imports
import useShipmentStore from '@/store/shipmentStore'
import useLoginAccountStore from '@/store/loginAccountStore'
import pricing from '@/constants/temPricing'
import { ipURL } from '@/constants/backendUrl'

const Payment = () => {
  const { 
    savedAddressData, 
    cummilativeExpence, 
    setSavedAddressData, 
    resetShipmentData, 
    packageDetail 
  } = useShipmentStore();
  const { accountLoginData } = useLoginAccountStore();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  // Date calculation logic
  const originalDate = new Date(savedAddressData.shipmentDate);
  const newDate = new Date(originalDate.setDate(originalDate.getDate() + 1));

  useEffect(() => {
    setSavedAddressData({
      ...savedAddressData,
      shipmentDate: newDate,
    });
  }, []);

  const stringDate = newDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  // Total amount calculation
  const totalAmount = 
    pricing.transport + 
    pricing.fuel + 
    cummilativeExpence.adultSignature + 
    cummilativeExpence.directSignature + 
    cummilativeExpence.verbalNotification +
    18 * Number(packageDetail.weight);

  // Payment sheet initialization
  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${ipURL}/api/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalAmount,
        currency: 'aed',
        accountId: accountLoginData.id,
      }),
    });
    return await response.json();
  };

  const initializePaymentSheet = async () => {
    const {
      paymentIntent,
      ephemeralKey,
      customer,
    } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Velo",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: accountLoginData.name,
        email: accountLoginData.email,
        address: {
          country: accountLoginData.mobileCountry,
        },
      },
      defaultShippingDetails: {
        name: accountLoginData.name,
      },
      returnURL: 'myapp://home',
    });
    
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      resetShipmentData();
      router.replace('/(tabs)/home/createShipment/paymentSuccess')
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  // Summary Row Component
  const SummaryRow = ({ label, amount, isTotal } : { 
    label: string, 
    amount: number, 
    isTotal?: boolean 
  }) => (
    <View style={[
      styles.summaryRowContainer,
      isTotal && styles.totalRow
    ]}>
      <ThemedText style={[
        styles.summaryText,
        isTotal && styles.totalText
      ]}>
        {label}
      </ThemedText>
      <ThemedText style={[
        styles.summaryText,
        isTotal && styles.totalText
      ]}>
        AED {amount}
      </ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Redesigned Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>Payment Summary</ThemedText>
          <MaterialIcons name="payment" size={24} color="#FFAC1C" />
        </View>
        
        <View style={styles.deliveryInfoContainer}>
          <MaterialIcons name="local-shipping" size={20} color="#FFAC1C" />
          <ThemedText style={styles.deliveryDate}>
            Delivery by {stringDate}
          </ThemedText>
        </View>
      </View>

      {/* Summary Container with Elevated Card Design */}
      <ThemedView style={styles.summaryContainer}>
        <SummaryRow label="Transportation Charges" amount={pricing.transport} />
        <SummaryRow label="Fuel Charge" amount={pricing.fuel} />
        <SummaryRow label="Weight Charges" amount={18 * Number(packageDetail.weight)} />
        <SummaryRow label="Adult Signature" amount={cummilativeExpence.adultSignature} />
        <SummaryRow label="Direct Signature" amount={cummilativeExpence.directSignature} />
        <SummaryRow label="Verbal Notification" amount={cummilativeExpence.verbalNotification} />
        
        <Divider style={styles.divider} />
        
        <SummaryRow 
          label="Total Amount" 
          amount={totalAmount} 
          isTotal={true}
        />
      </ThemedView>

      {/* Payment Button with Improved Design */}
      <TouchableOpacity
        style={[
          styles.paymentButton,
          loading ? styles.paymentButtonActive : styles.paymentButtonDisabled
        ]}
        onPress={openPaymentSheet}
        disabled={!loading}
      >
        <ThemedText style={styles.paymentButtonText}>
          {loading ? 'Proceed to Payment' : 'Loading...'}
        </ThemedText>
        {loading && <MaterialIcons name="arrow-forward" size={20} color="#000" />}
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: 12,
    borderRadius: 8,
  },
  deliveryDate: {
    marginLeft: 8,
    fontSize: 14,
  },
  summaryContainer: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  summaryRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  summaryText: {
    fontSize: 14,
  },
  totalRow: {
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 8,
  },
  paymentButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  paymentButtonActive: {
    backgroundColor: '#FFAC1C',
  },
  paymentButtonDisabled: {
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Payment;