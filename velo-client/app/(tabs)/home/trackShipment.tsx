import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import axios from 'axios';
import { Colors } from '@/constants/Colors';
import { ipURL } from '@/constants/backendUrl';
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics';

type TrackingStep = {
  key: string;
  label: string;
  completed: boolean;
  current: boolean;
};

type TrackingResult = {
  shipmentId: string;
  statusLabel: string;
  shipmentDate: string;
  deliveryDate: string;
  from: string;
  to: string;
  timeline: TrackingStep[];
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
};

const TrackShipment = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const lookupShipment = async () => {
    const publicId = trackingNumber.trim();
    if (!publicId) {
      setResult(null);
      setMessage('Enter a tracking number.');
      return;
    }

    setLoading(true);
    setMessage('');
    setResult(null);

    try {
      const response = await axios.get(`${ipURL}/api/shipment/track/${encodeURIComponent(publicId)}`);
      setResult(response.data?.tracking ?? null);
      if (!response.data?.tracking) {
        setMessage('Shipment not found.');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setMessage('No shipment found for that tracking number.');
      } else {
        setMessage('Tracking is unavailable right now.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={themeColors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: themeColors.text }]}>Track a Shipment</Text>
          <Text style={[styles.subtitle, { color: themeColors.text }]}>
            Enter the tracking number from your shipment.
          </Text>

          <TextInput
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            placeholder="Tracking number"
            placeholderTextColor={colorScheme === 'dark' ? '#888' : '#999'}
            autoCapitalize="characters"
            autoCorrect={false}
            style={[
              styles.input,
              {
                color: themeColors.text,
                borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
                backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff',
              },
            ]}
          />

          <TouchableOpacity style={styles.button} onPress={lookupShipment} disabled={loading} activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#11181C" />
            ) : (
              <Text style={styles.buttonText}>Track Shipment</Text>
            )}
          </TouchableOpacity>

          {message ? <Text style={[styles.message, { color: themeColors.text }]}>{message}</Text> : null}

          {result ? (
            <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff' }]}>
              <Text style={[styles.shipmentId, { color: themeColors.text }]}>{result.shipmentId}</Text>
              <Text style={styles.status}>{result.statusLabel}</Text>
              <Text style={[styles.route, { color: themeColors.text }]}>
                {result.from || 'Origin'} to {result.to || 'Destination'}
              </Text>
              <Text style={[styles.dates, { color: themeColors.text }]}>
                Shipped {formatDate(result.shipmentDate)} · Est. delivery {formatDate(result.deliveryDate)}
              </Text>
              <View style={styles.timeline}>
                {result.timeline.map((step) => (
                  <View key={step.key} style={styles.step}>
                    <Ionicons
                      name={step.completed || step.current ? 'checkmark-circle' : 'ellipse-outline'}
                      size={20}
                      color={step.current || step.completed ? '#FFAC1C' : '#9E9E9E'}
                    />
                    <Text
                      style={[
                        styles.stepLabel,
                        { color: themeColors.text, fontWeight: step.current ? '700' : '500' },
                      ]}
                    >
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TrackShipment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(32),
  },
  backButton: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
    width: horizontalScale(36),
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: '700',
  },
  subtitle: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
    fontSize: moderateScale(15),
    opacity: 0.7,
  },
  input: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    fontSize: moderateScale(16),
  },
  button: {
    marginTop: verticalScale(12),
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(48),
  },
  buttonText: {
    color: '#11181C',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  message: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(15),
  },
  card: {
    marginTop: verticalScale(20),
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
  },
  shipmentId: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  status: {
    marginTop: verticalScale(6),
    color: '#FFAC1C',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  route: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(15),
  },
  dates: {
    marginTop: verticalScale(6),
    fontSize: moderateScale(13),
    opacity: 0.7,
  },
  timeline: {
    marginTop: verticalScale(16),
    gap: verticalScale(12),
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(10),
  },
  stepLabel: {
    fontSize: moderateScale(15),
  },
});
