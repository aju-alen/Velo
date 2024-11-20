import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useStripe } from '@stripe/stripe-react-native'
import { ipURL } from '@/constants/backendUrl'
import useShipmentStore from '@/store/shipmentStore'
import pricing from '@/constants/temPricing'
import { Divider } from 'react-native-paper'
import { router } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'

const Payment = () => {
  const { savedAddressData, deliveryServices, packageDetail, cummilativeExpence } = useShipmentStore();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
 
  const originalDate = new Date(savedAddressData.shipmentDate);
  const newDate = new Date(originalDate.setDate(originalDate.getDate() + 1));
  const stringDate = newDate.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  interface Summary{
    label: string,
    amount: number,
    isTotal?: boolean

  }

  const totalAmount = pricing.transport + 
                     pricing.fuel + 
                     cummilativeExpence.adultSignature + 
                     cummilativeExpence.directSignature + 
                     cummilativeExpence.verbalNotification;

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${ipURL}/api/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalAmount,
        currency: 'aed',
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
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: 'Jane Doe',
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
      Alert.alert('Success', 'Your order is confirmed!');
      router.push('/(tabs)/home/createShipment/paymentSuccess')
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const SummaryRow = ({ label, amount, isTotal } : Summary ) => (
    <ThemedView style={[
      styles.summaryRowContainer,
      isTotal && styles.totalRow
    ]}>
      <ThemedText style={[
        styles.summaryText,
        isTotal && styles.totalText
      ]}>{label}</ThemedText>
      <ThemedText style={[
        styles.summaryText,
        isTotal && styles.totalText
      ]}>AED {amount}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Payment Summary</ThemedText>
        <ThemedView style={styles.deliveryInfo}>
          <MaterialIcons name="local-shipping" size={20} color="#666" />
          <ThemedText style={styles.deliveryDate}>
            Delivery by {stringDate}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.summaryContainer}>
        <SummaryRow label="Transportation Charges" amount={pricing.transport}  />
        <SummaryRow label="Fuel Charge" amount={pricing.fuel} />
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
      </TouchableOpacity>
    </ThemedView>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  deliveryInfo: {
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  paymentButtonActive: {
    backgroundColor: '#FFAC1C',
  },
  paymentButtonDisabled: {
    backgroundColor: '#FFE4B5',
  },
  paymentButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});