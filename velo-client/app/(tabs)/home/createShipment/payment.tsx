import React, { useEffect, useState } from 'react'
import {  StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useStripe } from '@stripe/stripe-react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { Divider } from 'react-native-paper'
import { router,useLocalSearchParams } from 'expo-router'
import { moderateScale,verticalScale,horizontalScale } from '@/constants/metrics'

// Store imports
import useShipmentStore from '@/store/shipmentStore'
import useLoginAccountStore from '@/store/loginAccountStore'
import pricing from '@/constants/temPricing'
import { ipURL } from '@/constants/backendUrl'

const Payment = () => {
  const {shipmentId} = useLocalSearchParams()
  console.log(shipmentId,'payment___________');
  
  const { 
    savedAddressData, 
    cummilativeExpence, 
    setSavedAddressData, 
    resetShipmentData, 
    packageDetail,
    accountAddressData
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

  const stringDate = savedAddressData.deliveryDate.toLocaleDateString('en-US', {
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
        addressLineOne:accountAddressData.addressOne,
        addressCity:accountAddressData.city,
        addressState:accountAddressData.state,
        addressCountry:accountAddressData.countryCode,
        addressName:accountAddressData.userName,
        shipmentId:shipmentId

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
      router.replace({ pathname: '/(tabs)/home/createShipment/paymentSuccess', params: { totalAmount } })
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
    <ThemedView style={[
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
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Redesigned Header */}
      <ThemedView style={styles.headerContainer}>
        <ThemedView style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>Payment Summary</ThemedText>
          <MaterialIcons name="payment" size={24} color="#FFAC1C" />
        </ThemedView>
        
        <ThemedView style={styles.deliveryInfoContainer}>
          <MaterialIcons name="local-shipping" size={20} color="#FFAC1C" />
          <ThemedText style={styles.deliveryDate}>
            Delivery by {stringDate}
          </ThemedText>
        </ThemedView>
      </ThemedView>

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
    padding: moderateScale(16),
  },
  headerContainer: {
    marginBottom: verticalScale(24),
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
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
    marginBottom: verticalScale(12),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: '600',
  },
  deliveryInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    padding: moderateScale(12),
    borderRadius: moderateScale(8),
  },
  deliveryDate: {
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(14),
  },
  summaryContainer: {
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: verticalScale(16),
  },
  summaryRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  summaryText: {
    fontSize: moderateScale(14),
  },
  totalRow: {
    marginTop: verticalScale(8),
  },
  totalText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  divider: {
    marginVertical: verticalScale(8),
  },
  paymentButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(8),
    gap: moderateScale(8),
  },
  paymentButtonActive: {
    backgroundColor: '#FFAC1C',
  },
  paymentButtonDisabled: {
  },
  paymentButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default Payment;