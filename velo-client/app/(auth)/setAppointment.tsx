import { StyleSheet, Platform, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomButton from '@/components/CustomButton';
import StartOverButton from '@/components/StartOverButton';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import useLoginAccountStore from '@/store/loginAccountStore';
import { resetTo } from '@/utils/resetNavigation';
import { AuthScreen } from '@/components/forms/AuthScreen';
import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing } from '@/constants/Colors';
import { AGENT_REG_STEPS } from '@/constants/flowSteps';

const SetAppointment = () => {
  const { setAccountLoginData } = useLoginAccountStore();
  const params = useLocalSearchParams();
  const { accountId } = params;
  const { colors, radius, brand } = useAppTheme();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(Platform.OS === 'ios');
  const [saving, setSaving] = useState(false);

  const onChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) setDate(selectedDate);
    setShow(Platform.OS === 'ios');
  };

  const handleConfirmBooking = async () => {
    try {
      setSaving(true);
      const setAppointmentDate = await axios.post(`${ipURL}/api/auth/book-appointment`, {
        appointmentDate: date,
        agentId: accountId,
      });
      const agentInfo = setAppointmentDate.data.agentInfo;
      setAccountLoginData({
        id: agentInfo.id,
        mobileCode: agentInfo.mobileCode,
        mobileCountry: agentInfo.mobileCountry,
        mobileNumber: agentInfo.mobileNumber,
        name: agentInfo.name,
        password: agentInfo.password,
        registerVerificationStatus: agentInfo.registerVerificationStatus,
        role: agentInfo.role,
        updatedAt: agentInfo.updatedAt,
        token: agentInfo.token,
        modeOfWork: agentInfo.modeOfWork ? agentInfo.modeOfWork : null,
        organisationId: agentInfo.organisationId ? agentInfo.organisationId : '',
      });
      await SecureStore.setItemAsync('registerDetail', JSON.stringify(agentInfo));
      resetTo('/(auth)/agentRestriction');
    } catch (err) {
      console.log(err, 'err--');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthScreen
      title="Book an appointment"
      subtitle="Choose a date and time for verification. You’ll get email confirmation."
      step={5}
      total={AGENT_REG_STEPS.length}
      stepLabel={AGENT_REG_STEPS[4].label}
      footer={
        <>
          <CustomButton
            buttonText="Confirm appointment"
            handlePress={handleConfirmBooking}
            disableButton={saving}
          />
          <StartOverButton />
        </>
      }
    >
      <View style={styles.modeRow}>
        {(['date', 'time'] as const).map((m) => {
          const active = mode === m;
          return (
            <TouchableOpacity
              key={m}
              onPress={() => {
                setMode(m);
                setShow(true);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              style={[
                styles.modeBtn,
                {
                  borderColor: active ? brand.amber : colors.border,
                  backgroundColor: colors.surface,
                  borderRadius: radius.md,
                  borderWidth: active ? 2 : 1,
                },
              ]}
            >
              <AppText variant="label">{m === 'date' ? 'Date' : 'Time'}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={[
          styles.summary,
          { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radius.md },
        ]}
      >
        <AppText variant="label">Selected</AppText>
        <AppText variant="h3">
          {date.toLocaleString([], {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </AppText>
      </View>

      {show ? (
        <DateTimePicker
          value={date}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      ) : null}
    </AuthScreen>
  );
};

export default SetAppointment;

const styles = StyleSheet.create({
  modeRow: { flexDirection: 'row', gap: Spacing.md },
  modeBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  summary: {
    borderWidth: 1,
    padding: Spacing.xl,
    gap: Spacing.sm,
  },
});
