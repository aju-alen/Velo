import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, View, Text, useColorScheme } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import Constants from 'expo-constants';
import { moderateScale, verticalScale, horizontalScale } from '@/constants/metrics';

// Store imports
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';

import { ipURL } from '@/constants/backendUrl';
import axiosInstance from '@/constants/axiosHeader';
import StripeProviderWrapper from '@/components/StripeProviderWrapper';
import { Colors } from '@/constants/Colors';

interface TotalAmount {
  totalAmount: number;
  baseAmount: number;
  collectionPrice: number;
  servicesPrice: number;
}

const PaymentContent = () => {
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
  const [fetchAmountError, setFetchAmountError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [presentError, setPresentError] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const configScheme = Constants.expoConfig?.scheme;
  const appScheme = Array.isArray(configScheme)
    ? (configScheme[0] ?? 'velo-international-shipping')
    : (configScheme ?? 'velo-international-shipping');
  const themeColors = Colors[colorScheme];
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
  const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';

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

  const fetchPaymentSheetParams = async (): Promise<{
    paymentIntent: string;
    ephemeralKey: string;
    customer: string;
  }> => {
    const amount = getTotalAmount?.totalAmount ?? 0;
    if (!amount || amount <= 0) {
      throw new Error('Invalid payment amount. Total must be greater than 0.');
    }
    if (!shipmentId || typeof shipmentId !== 'string') {
      throw new Error('Missing shipment information. Please go back and try again.');
    }
    console.log(accountLoginData, 'accountLoginData--in--payment');
    if (!accountLoginData?.id || !accountLoginData?.email) {
      throw new Error('Account information is missing. Please sign in again.');
    }

    const response = await fetch(`${ipURL}/api/stripe/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amount.toFixed(2),
        currency: 'aed',
        accountId: accountLoginData.id,
        addressLineOne: accountAddressData?.addressOne ?? '',
        addressCity: accountAddressData?.city ?? '',
        addressState: accountAddressData?.state ?? '',
        addressCountry: accountAddressData?.countryCode ?? '',
        addressName: accountAddressData?.userName ?? '',
        shipmentId,
        email: accountLoginData.email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.message ?? data?.error ?? `Payment setup failed (${response.status}). Please try again.`;
      throw new Error(message);
    }

    if (!data?.paymentIntent || !data?.ephemeralKey || !data?.customer) {
      throw new Error('Invalid response from payment server. Please try again.');
    }

    return {
      paymentIntent: data.paymentIntent,
      ephemeralKey: data.ephemeralKey,
      customer: data.customer,
    };
  };

  const initializePaymentSheet = async () => {
    setPaymentError(null);
    try {
      const params = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Velo',
        customerId: params.customer,
        customerEphemeralKeySecret: params.ephemeralKey,
        paymentIntentClientSecret: params.paymentIntent,
        defaultBillingDetails: {
          name: accountLoginData.name,
          email: accountLoginData.email,
          address: { country: accountLoginData.mobileCountry },
        },
        returnURL: `${appScheme}://stripe-redirect`,
      });

      if (error) {
        const message =
          error.message ||
          (error.code === 'Failed' ? 'Payment sheet could not be initialized. Please try again.' : `Error: ${error.code}`);
        setPaymentError(message);
        setLoading(false);
        return;
      }
      setLoading(true);
    } catch (err: any) {
      const message = err?.message ?? 'Unable to set up payment. Please try again.';
      setPaymentError(message);
      setLoading(false);
    }
  };

  const openPaymentSheet = async () => {
    setPresentError(null);
    const { error } = await presentPaymentSheet();

    if (error) {
      const userMessage =
        error.code === 'Canceled'
          ? 'Payment was canceled.'
          : error.message || `Payment failed (${error.code}). Please try again.`;
      setPresentError(userMessage);
      Alert.alert('Payment Error', userMessage);
      return;
    }
    resetShipmentData();
    router.replace({
      pathname: '/(tabs)/home/createShipment/paymentSuccess',
      params: { totalAmount: String(getTotalAmount?.totalAmount ?? totalAmount) },
    });
  };

  useEffect(() => {
    const getTotalAmountDB = async () => {
      if (!shipmentId || !finalShipmentData?.organisationId) {
        setFetchAmountError('Missing shipment or organisation information.');
        return;
      }
      setFetchAmountError(null);
      try {
        const response = await axiosInstance.get(
          `${ipURL}/api/shipment/getTotalAmount/${finalShipmentData.organisationId}/${shipmentId}`
        );
        const breakdown = response.data?.priceBreakdown;
        if (!breakdown || typeof breakdown?.totalAmount !== 'number') {
          setFetchAmountError('Invalid payment details received. Please try again.');
          return;
        }
        setGetTotalAmount(breakdown);
      } catch (err: any) {
        const message =
          err?.response?.data?.message ?? err?.message ?? 'Failed to load payment details. Please try again.';
        setFetchAmountError(message);
        setGetTotalAmount(null);
      }
    };

    getTotalAmountDB();
  }, [shipmentId, finalShipmentData?.organisationId]);

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
    <View
      style={[styles.summaryRowContainer, { backgroundColor: bgCard }, isTotal && styles.totalRow]}
    >
      <Text
        style={[styles.summaryText, { color: textPrimary }, isTotal && styles.totalText]}
      >
        {label}
      </Text>
      <Text
        style={[styles.summaryText, { color: textPrimary }, isTotal && styles.totalText]}
      >
        AED {amount}
      </Text>
    </View>
  );

  if (!getTotalAmount && !fetchAmountError) {
    return (
      <View style={[styles.container, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.loadingText, { color: textPrimary }]}>Loading payment information...</Text>
      </View>
    );
  }

  if (fetchAmountError) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: themeColors.background }]}>
        <MaterialIcons name="error-outline" size={48} color="#E53935" style={{ marginBottom: verticalScale(16) }} />
        <Text style={[styles.errorTitle, { color: textPrimary }]}>Unable to load payment</Text>
        <Text style={[styles.errorMessage, { color: textSecondary }]}>{fetchAmountError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setFetchAmountError(null);
            setGetTotalAmount(null);
            const retryFetch = async () => {
              try {
                const response = await axiosInstance.get(
                  `${ipURL}/api/shipment/getTotalAmount/${finalShipmentData.organisationId}/${shipmentId}`
                );
                const breakdown = response.data?.priceBreakdown;
                if (breakdown?.totalAmount != null) setGetTotalAmount(breakdown);
                else setFetchAmountError('Invalid payment details received. Please try again.');
              } catch {
                setFetchAmountError('Failed to load payment details. Please try again.');
              }
            };
            retryFetch();
          }}
        >
          <Text style={styles.retryButtonText}>Try again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      {/* Redesigned Header */}
      <View style={[styles.headerContainer, { backgroundColor: bgCard }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: textPrimary }]}>Payment Summary</Text>
          <MaterialIcons name="payment" size={24} color="#FFAC1C" />
        </View>
      </View>

      {/* Payment / init errors */}
      {(paymentError || presentError) ? (
        <View style={styles.errorBanner}>
          <MaterialIcons name="warning" size={20} color="#E53935" />
          <Text style={styles.errorBannerText}>{paymentError || presentError}</Text>
        </View>
      ) : null}

      {/* Summary Container with Elevated Card Design */}
      <View style={[styles.summaryContainer, { backgroundColor: bgCard }]}>
        <SummaryRow label="Base Price" amount={getTotalAmount.baseAmount} />
        <SummaryRow label="Collection Price" amount={getTotalAmount.collectionPrice} />
        <SummaryRow label="Services Price" amount={getTotalAmount.servicesPrice} />

        <Divider style={[styles.divider, { backgroundColor: borderColor }]} />

        <SummaryRow
          label="Total Amount"
          amount={getTotalAmount.totalAmount}
          isTotal={true}
        />
      </View>

      {/* Payment Button with Improved Design */}
      <TouchableOpacity
        style={[
          styles.paymentButton,
          loading ? styles.paymentButtonActive : styles.paymentButtonDisabled,
        ]}
        onPress={openPaymentSheet}
        disabled={!loading}
      >
        <Text style={[styles.paymentButtonText, { color: loading ? '#000' : textPrimary }]}>
          {loading ? 'Proceed to Payment' : 'Loading...'}
        </Text>
        {loading && <MaterialIcons name="arrow-forward" size={20} color="#000" />}
      </TouchableOpacity>
    </View>
  );
};

const Payment = () => {
  return (
    <StripeProviderWrapper>
      <PaymentContent />
    </StripeProviderWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(24),
  },
  loadingText: {
    fontSize: moderateScale(16),
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginBottom: verticalScale(24),
    lineHeight: moderateScale(20),
  },
  retryButton: {
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(24),
    borderRadius: moderateScale(10),
  },
  retryButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#000',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
    gap: horizontalScale(10),
  },
  errorBannerText: {
    flex: 1,
    fontSize: moderateScale(14),
    color: '#E53935',
    fontWeight: '500',
  },
  headerContainer: {
    marginBottom: verticalScale(24),
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
