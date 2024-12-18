import { SafeAreaView, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomButton from '@/components/CustomButton';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import useLoginAccountStore from '@/store/loginAccountStore';

const SetAppointment = () => {
  const { setAccountLoginData } = useLoginAccountStore();
  const params = useLocalSearchParams();
  const { accountId } = params;
  const colorScheme = useColorScheme();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(Platform.OS === 'ios'? true : false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
    setShow(Platform.OS === 'ios'? true : false);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const handleConfirmBooking = async () => {
    try {
      const postData = {
        appointmentDate: date,
        agentId: accountId,
      };
      const setAppointmentDate = await axios.post(
        `${ipURL}/api/auth/book-appointment`,
        postData
      );
      setAccountLoginData({
        id: setAppointmentDate.data.agentInfo.id,
        mobileCode: setAppointmentDate.data.agentInfo.mobileCode,
        mobileCountry: setAppointmentDate.data.agentInfo.mobileCountry,
        mobileNumber: setAppointmentDate.data.agentInfo.mobileNumber,
        name: setAppointmentDate.data.agentInfo.name,
        password: setAppointmentDate.data.agentInfo.password,
        registerVerificationStatus: setAppointmentDate.data.agentInfo.registerVerificationStatus,
        role: setAppointmentDate.data.agentInfo.role,
        updatedAt: setAppointmentDate.data.agentInfo.updatedAt,
        token: setAppointmentDate.data.agentInfo.token,
        modeOfWork: setAppointmentDate.data.agentInfo.modeOfWork? setAppointmentDate.data.agentInfo.modeOfWork : null,
      })
      await SecureStore.setItemAsync(
        'registerDetail',
        JSON.stringify(setAppointmentDate.data.agentInfo)
      );
      router.replace('/(auth)/agentRestriction');
    } catch (err) {
      console.log(err, 'err--');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        {/* Header Section */}
        <ThemedView style={styles.headerSection}>
          <ThemedText type="title" style={styles.headerTitle}>
            Book Appointment
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.headerSubtitle}>
            Select a date and time for your appointment
          </ThemedText>
        </ThemedView>

        {/* Date Time Selection Section */}
        <ThemedView style={styles.dateTimeSection}>
          <ThemedView style={styles.selectionButtons}>
            <TouchableOpacity 
              onPress={() => showMode('date')}
              style={[styles.selectionButton, mode === 'date' && styles.activeButton]}
            >
              <ThemedText type="link" style={[styles.buttonText, mode === 'date' && styles.activeButtonText]}>
                Select Date
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => showMode('time')}
              style={[styles.selectionButton, mode === 'time' && styles.activeButton]}
            >
              <ThemedText type="link" style={[styles.buttonText, mode === 'time' && styles.activeButtonText]}>
                Select Time
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Selected DateTime Display */}
          <ThemedView style={styles.selectedDateContainer}>
            <ThemedText style={styles.selectedDateLabel}>Selected Date & Time</ThemedText>
            <ThemedText style={styles.selectedDateTime}>
              {date.toLocaleString([], {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </ThemedText>
          </ThemedView>

          {/* DateTime Picker */}
          {show && (
            <ThemedView style={styles.pickerContainer}>
              <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode={mode}
                is24Hour={true}
                onChange={onChange}
                display="spinner"
                themeVariant={colorScheme}
                minimumDate={new Date()}
                maximumDate={new Date(new Date().setDate(new Date().getDate() + 365))}
              />
            </ThemedView>
          )}
        </ThemedView>

        {/* Confirm Button */}
        <ThemedView style={styles.buttonContainer}>
          <CustomButton
            handlePress={handleConfirmBooking}
            buttonText="Confirm Appointment"
            buttonWidth={300}
          />
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
};

export default SetAppointment;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: 'center',
  },
  dateTimeSection: {
    flex: 1,
    width: '100%',
  },
  selectionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  selectionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeButton: {
    backgroundColor: 'rgba(255, 172, 28, 0.2)',
    borderColor: '#FFAC1C',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  activeButtonText: {
    color: '#FFAC1C',
  },
  selectedDateContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedDateLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 8,
  },
  selectedDateTime: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
});