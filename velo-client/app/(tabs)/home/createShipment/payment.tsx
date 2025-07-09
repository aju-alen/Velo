import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useStripe } from '@stripe/stripe-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { moderateScale, verticalScale, horizontalScale } from '@/constants/metrics';

// Store imports
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';

import { ipURL } from '@/constants/backendUrl';
import axiosInstance from '@/constants/axiosHeader';
import StripeProviderWrapper from '@/components/StripeProviderWrapper';

interface TotalAmount {
  totalAmount: number;
  baseAmount: number;
  collectionPrice: number;
  servicesPrice: number;
}

const Payment = () => {
  const { shipmentId } = useLocalSearchParams();
  console.log(shipmentId, 'payment___________');

  const {
    savedAddressData,
    cummilativeExpence,
    setSavedAddressData,
    resetShipmentData,
    packageDetail,
    accountAddressData,
    finalShipmentData,
  } = useShipmentStore();
  const { accountLoginData } = useLoginAccountStore();

  console.log(finalShipmentData, 'finalShipmentData--in--payment');

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [getTotalAmount, setGetTotalAmount] = useState<TotalAmount | null>(null);

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
    finalShipmentData.basePrice +
    finalShipmentData.collectionPrice +
    cummilativeExpence.adultSignature +
    cummilativeExpence.directSignature +
    cummilativeExpence.verbalNotification;

  // Payment sheet initialization
  console.log(getTotalAmount?.totalAmount, 'totalAmount--in--payment');

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${ipURL}/api/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: (getTotalAmount?.totalAmount).toFixed(2) || 0, // Ensure it defaults to 0 if null
        currency: 'aed',
        accountId: accountLoginData.id,
        addressLineOne: accountAddressData.addressOne,
        addressCity: accountAddressData.city,
        addressState: accountAddressData.state,
        addressCountry: accountAddressData.countryCode,
        addressName: accountAddressData.userName,
        shipmentId: shipmentId,
        email: accountLoginData.email,
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
      merchantDisplayName: 'Velo',
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
      router.replace({ pathname: '/(tabs)/home/createShipment/paymentSuccess', params: { totalAmount } });
    }
  };

  useEffect(() => {
    // Call getTotalAmountDB when the component mounts or shipmentId changes
    const getTotalAmountDB = async () => {
      try {
        const response = await axiosInstance.get(
          `${ipURL}/api/shipment/getTotalAmount/${finalShipmentData.organisationId}/${shipmentId}`
        );
        console.log(response.data, 'response.data--getTotalAmountDB');
        setGetTotalAmount(response.data.priceBreakdown); // Update state with the fetched data
      } catch (error) {
        console.error('Error fetching total amount:', error);
      }
    };

    getTotalAmountDB();
  }, []); // Fetch when shipmentId or finalShipmentData change

  // Run initializePaymentSheet only when getTotalAmount is updated
  useEffect(() => {
    if (getTotalAmount && getTotalAmount.totalAmount) { // Ensure totalAmount is available
      initializePaymentSheet();
    }
  }, [getTotalAmount]); // This effect depends on getTotalAmount state

  // Summary Row Component
  const SummaryRow = ({
    label,
    amount,
    isTotal,
  }: {
    label: string;
    amount: number;
    isTotal?: boolean;
  }) => (
    <ThemedView
      style={[styles.summaryRowContainer, isTotal && styles.totalRow]}
    >
      <ThemedText
        style={[styles.summaryText, isTotal && styles.totalText]}
      >
        {label}
      </ThemedText>
      <ThemedText
        style={[styles.summaryText, isTotal && styles.totalText]}
      >
        AED {amount}
      </ThemedText>
    </ThemedView>
  );

  // Show a loading message until getTotalAmount is available
  if (!getTotalAmount) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Loading payment information...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <StripeProviderWrapper>
    <ThemedView style={styles.container}>
      {/* Redesigned Header */}
      <ThemedView style={styles.headerContainer}>
        <ThemedView style={styles.headerTitleContainer}>
          <ThemedText style={styles.headerTitle}>Payment Summary</ThemedText>
          <MaterialIcons name="payment" size={24} color="#FFAC1C" />
        </ThemedView>
      </ThemedView>

      {/* Summary Container with Elevated Card Design */}
      <ThemedView style={styles.summaryContainer}>
        <SummaryRow label="Base Price" amount={getTotalAmount.baseAmount} />
        <SummaryRow label="Collection Price" amount={getTotalAmount.collectionPrice} />
        <SummaryRow label="Services Price" amount={getTotalAmount.servicesPrice} />

        <Divider style={styles.divider} />

        <SummaryRow
          label="Total Amount"
          amount={getTotalAmount.totalAmount}
          isTotal={true}
        />
      </ThemedView>

      {/* Payment Button with Improved Design */}
      <TouchableOpacity
        style={[
          styles.paymentButton,
          loading ? styles.paymentButtonActive : styles.paymentButtonDisabled,
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
    </StripeProviderWrapper>
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
  paymentButtonDisabled: {},
  paymentButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});

export default Payment;
