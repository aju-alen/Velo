import React, { useMemo, useState } from 'react';
import {
  Modal,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useShipmentStore from '@/store/shipmentStore';
import { AppText } from '@/components/AppText';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, Radius } from '@/constants/Colors';

type Props = {
  openModal: boolean;
  handleCloseModal: () => void;
};

function generateTimeSlots(start: number, end: number, interval: number) {
  const times: string[] = [];
  let current = start;
  while (current <= end) {
    const hours = Math.floor(current / 60);
    const minutes = current % 60;
    times.push(`${hours}:${minutes.toString().padStart(2, '0')}`);
    current += interval;
  }
  return times;
}

const TimePickerModal = ({ openModal, handleCloseModal }: Props) => {
  const { deliveryServices, setDeliveryServices } = useShipmentStore();
  const [mode, setMode] = useState<'start' | 'end'>('start');
  const { colors, brand, radius } = useAppTheme();
  const insets = useSafeAreaInsets();

  const timeSlots = useMemo(() => {
    if (mode === 'start') {
      return generateTimeSlots(9 * 60 + 30, 17 * 60, 15);
    }
    const from = deliveryServices.deliveryPickupTimeFrom || '9:30';
    const [hours, minutes] = from.split(':').map(Number);
    const totalMinutes = (hours || 9) * 60 + (minutes || 30);
    return generateTimeSlots(totalMinutes + 15, 17 * 60, 15);
  }, [mode, deliveryServices.deliveryPickupTimeFrom]);

  const closeAndReset = () => {
    setMode('start');
    handleCloseModal();
  };

  return (
    <Modal
      animationType="slide"
      visible={openModal}
      onRequestClose={closeAndReset}
      transparent
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeAndReset} />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: Math.max(insets.bottom, Spacing.md),
            },
          ]}
        >
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>

          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <AppText variant="h2">
                {mode === 'start' ? 'Earliest pickup' : 'Latest pickup'}
              </AppText>
              <AppText variant="bodySmall" secondary>
                {mode === 'start'
                  ? 'When can collection start?'
                  : `Window starts at ${deliveryServices.deliveryPickupTimeFrom}`}
              </AppText>
            </View>
            <TouchableOpacity onPress={closeAndReset} hitSlop={12} accessibilityRole="button">
              <AppText variant="link" color={colors.textSecondary}>
                Close
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.steps}>
            <View
              style={[
                styles.stepChip,
                {
                  backgroundColor: mode === 'start' ? colors.tintMuted : colors.surface,
                  borderColor: mode === 'start' ? brand.amber : colors.border,
                },
              ]}
            >
              <AppText variant="caption" color={mode === 'start' ? brand.amber : colors.textMuted}>
                1 · Start {deliveryServices.deliveryPickupTimeFrom || '—'}
              </AppText>
            </View>
            <View
              style={[
                styles.stepChip,
                {
                  backgroundColor: mode === 'end' ? colors.tintMuted : colors.surface,
                  borderColor: mode === 'end' ? brand.amber : colors.border,
                },
              ]}
            >
              <AppText variant="caption" color={mode === 'end' ? brand.amber : colors.textMuted}>
                2 · End {deliveryServices.deliveryPickupTimeTo || '—'}
              </AppText>
            </View>
          </View>

          <FlatList
            data={timeSlots}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => {
              const selected =
                (mode === 'start' && deliveryServices.deliveryPickupTimeFrom === item) ||
                (mode === 'end' && deliveryServices.deliveryPickupTimeTo === item);
              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${item}`}
                  style={[
                    styles.slot,
                    {
                      backgroundColor: colors.surface,
                      borderColor: selected ? brand.amber : colors.border,
                      borderWidth: selected ? 2 : 1,
                      borderRadius: radius.md,
                    },
                  ]}
                  onPress={() => {
                    if (mode === 'start') {
                      setDeliveryServices({
                        ...deliveryServices,
                        deliveryPickupTimeFrom: item,
                        deliveryPickupTimeTo: '',
                      });
                      setMode('end');
                    } else {
                      setDeliveryServices({
                        ...deliveryServices,
                        deliveryPickupTimeTo: item,
                      });
                      closeAndReset();
                    }
                  }}
                >
                  <AppText variant="bodyStrong">{item}</AppText>
                </Pressable>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default TimePickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    maxHeight: '78%',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  steps: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  stepChip: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  list: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.sm,
  },
  slot: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
});
