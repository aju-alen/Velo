import {
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Pressable,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';
import axiosInstance from '@/constants/axiosHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppTheme } from '@/hooks/useAppTheme';
import { Spacing, Radius } from '@/constants/Colors';
import { AppText } from '@/components/AppText';
import { FormField } from '@/components/forms/FormField';
import CustomButton from '@/components/CustomButton';

const { height: windowHeight } = Dimensions.get('window');

type SaveAddressFormProps = {
  addressModalVisible: boolean;
  onClose: () => void;
  userId: string;
};

const SaveAddressForm = ({ addressModalVisible, onClose, userId }: SaveAddressFormProps) => {
  const { setSavedAddressData, resetShipmentData } = useShipmentStore();
  const savedAddressData = useShipmentStore((state) => state.savedAddressData);
  const { accountLoginData } = useLoginAccountStore();
  const { colors, brand, radius } = useAppTheme();
  const insets = useSafeAreaInsets();
  const sheetMaxHeight = Math.round(windowHeight * 0.94);

  const [countryList, setCountryList] = useState<any[]>([]);
  const [contactModal, setContactModal] = useState(false);
  const [savedContact, setSavedContact] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!savedAddressData.countryCode) {
      setSavedAddressData({ countryCode: '+971' });
    }
  }, []);

  useEffect(() => {
    const getAllSavedAddress = async () => {
      try {
        const savedAddress = await axiosInstance.get(
          `/api/address/get-external-user-address/${accountLoginData.id}`
        );
        setSavedContact(savedAddress.data.data || []);
      } catch (error) {
        console.error('Error fetching saved addresses:', error);
      }
    };
    if (contactModal) getAllSavedAddress();
  }, [contactModal, accountLoginData.id]);

  useEffect(() => {
    if (!addressModalVisible) return;
    const getAllCountries = async () => {
      try {
        const allCountry = await axiosInstance.get(`/api/country/get-all-countries`);
        setCountryList(allCountry.data || []);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    getAllCountries();
  }, [addressModalVisible]);

  const handleClear = () => {
    try {
      resetShipmentData();
    } catch (error) {
      console.error('Error clearing form:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (savedAddressData.saveAddress) {
        const addressData = {
          name: savedAddressData.name,
          companyName: savedAddressData.companyName,
          addressOne: savedAddressData.addressOne,
          addressTwo: savedAddressData.addressTwo,
          city: savedAddressData.city,
          state: savedAddressData.state,
          email: savedAddressData.email,
          mobileNumber: savedAddressData.mobileNumber,
          countryId: savedAddressData.countryId,
          residentAddress: savedAddressData.residentAddress,
          saveAddress: savedAddressData.saveAddress,
          userId,
          countryCode: savedAddressData.countryCode === '' ? '+971' : savedAddressData.countryCode,
          zipCode: savedAddressData.zipCode,
        };
        try {
          await axios.post(`${ipURL}/api/address/save-external-user-address`, addressData);
        } catch (error) {
          console.error('Error saving address:', error);
        }
      }
      setSavedAddressData({ gotDetails: true });
      onClose();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setSaving(false);
    }
  };

  const applySavedContact = (item: any) => {
    setSavedAddressData({
      name: item.name,
      companyName: item.companyName,
      addressOne: item.addressOne,
      addressTwo: item.addressTwo,
      city: item.city,
      state: item.state,
      email: item.email,
      mobileNumber: item.mobileNumber,
      countryId: item.countryId,
      residentAddress: item.residentAddress,
      saveAddress: false,
      countryCode: item.countryCode,
      zipCode: item.zipCode,
    });
    setContactModal(false);
  };

  const ToggleRow = ({
    label,
    value,
    onToggle,
  }: {
    label: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.85}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      style={[
        styles.toggleRow,
        {
          backgroundColor: colors.surface,
          borderColor: value ? brand.amber : colors.border,
          borderRadius: radius.md,
          borderWidth: value ? 2 : 1,
        },
      ]}
    >
      <AppText variant="body" style={styles.toggleLabel}>
        {label}
      </AppText>
      <View
        style={[
          styles.toggleMark,
          {
            borderColor: value ? brand.amber : colors.border,
            backgroundColor: value ? brand.amber : 'transparent',
          },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View>
      <Modal
        animationType="slide"
        transparent
        visible={addressModalVisible}
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.root}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          <View style={styles.overlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={Keyboard.dismiss}
              accessibilityRole="button"
              accessibilityLabel="Dismiss keyboard"
            />
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.background,
                  maxHeight: sheetMaxHeight,
                  paddingBottom: Math.max(insets.bottom, Spacing.md),
                },
              ]}
            >
              <View style={styles.handleWrap}>
                <View style={[styles.handle, { backgroundColor: colors.border }]} />
              </View>

              <View style={styles.header}>
                <View style={styles.headerText}>
                  <AppText variant="h2" accessibilityRole="header">
                    Delivery address
                  </AppText>
                  <AppText variant="bodySmall" secondary>
                    Who should receive this shipment?
                  </AppText>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={12}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <AppText variant="link" color={colors.textSecondary}>
                    Close
                  </AppText>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setContactModal(true)}
                style={[
                  styles.savedBtn,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderRadius: radius.md,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Use a saved address"
              >
                <AppText variant="bodyStrong">Use a saved address</AppText>
                <AppText variant="caption" secondary>
                  {savedContact.length
                    ? `${savedContact.length} saved`
                    : 'Fill faster from contacts you’ve saved'}
                </AppText>
              </TouchableOpacity>

              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
                automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
              >
                <AppText variant="label" style={styles.sectionLabel}>
                  Contact
                </AppText>
                <FormField
                  label="Full name"
                  placeholder="First and last name"
                  value={savedAddressData.name}
                  onChangeText={(text) => setSavedAddressData({ name: text })}
                  autoComplete="name"
                  autoCapitalize="words"
                />
                <FormField
                  label="Company (optional)"
                  placeholder="Company name"
                  value={savedAddressData.companyName}
                  onChangeText={(text) => setSavedAddressData({ companyName: text })}
                />
                <FormField
                  label="Email"
                  placeholder="name@example.com"
                  value={savedAddressData.email}
                  onChangeText={(text) => setSavedAddressData({ email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                <View style={styles.phoneRow}>
                  <View style={styles.codeCol}>
                    <FormField
                      label="Code"
                      placeholder="+971"
                      value={savedAddressData.countryCode}
                      onChangeText={(text) => setSavedAddressData({ countryCode: text })}
                      keyboardType="phone-pad"
                    />
                  </View>
                  <View style={styles.phoneCol}>
                    <FormField
                      label="Mobile number"
                      placeholder="5X XXX XXXX"
                      value={savedAddressData.mobileNumber}
                      onChangeText={(text) => setSavedAddressData({ mobileNumber: text })}
                      keyboardType="phone-pad"
                      maxLength={12}
                    />
                  </View>
                </View>

                <AppText variant="label" style={styles.sectionLabel}>
                  Address
                </AppText>
                <FormField
                  label="Address line 1"
                  placeholder="Street, building, villa"
                  value={savedAddressData.addressOne}
                  onChangeText={(text) => setSavedAddressData({ addressOne: text })}
                />
                <FormField
                  label="Address line 2"
                  placeholder="Apartment, floor, landmark"
                  value={savedAddressData.addressTwo}
                  onChangeText={(text) => setSavedAddressData({ addressTwo: text })}
                />
                <View style={styles.phoneRow}>
                  <View style={styles.half}>
                    <FormField
                      label="City"
                      placeholder="City"
                      value={savedAddressData.city}
                      onChangeText={(text) => setSavedAddressData({ city: text })}
                    />
                  </View>
                  <View style={styles.half}>
                    <FormField
                      label="State"
                      placeholder="State / emirate"
                      value={savedAddressData.state}
                      onChangeText={(text) => setSavedAddressData({ state: text })}
                    />
                  </View>
                </View>
                <FormField
                  label="Zip / postal code"
                  placeholder="Zip code"
                  value={savedAddressData.zipCode}
                  onChangeText={(text) => setSavedAddressData({ zipCode: text })}
                />

                <AppText variant="label" style={styles.sectionLabel}>
                  Country
                </AppText>
                <View
                  style={[
                    styles.pickerWrap,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      borderRadius: radius.md,
                      height: Platform.OS === 'ios' ? 140 : 52,
                    },
                  ]}
                >
                  <Picker
                    selectedValue={savedAddressData.countryId}
                    onValueChange={(itemValue) => setSavedAddressData({ countryId: itemValue })}
                    mode="dropdown"
                    style={{ color: colors.text }}
                    accessibilityLabel="Select country"
                  >
                    <Picker.Item label="Select country" value="" color={colors.textMuted} />
                    {countryList.map((country) => (
                      <Picker.Item
                        key={String(country.id)}
                        label={country.name}
                        value={country.id}
                        color={colors.text}
                      />
                    ))}
                  </Picker>
                </View>

                <AppText variant="label" style={styles.sectionLabel}>
                  Options
                </AppText>
                <ToggleRow
                  label="This is a residential address"
                  value={!!savedAddressData.residentAddress}
                  onToggle={() =>
                    setSavedAddressData({
                      residentAddress: !savedAddressData.residentAddress,
                    })
                  }
                />
                <ToggleRow
                  label="Save this address for next time"
                  value={!!savedAddressData.saveAddress}
                  onToggle={() =>
                    setSavedAddressData({ saveAddress: !savedAddressData.saveAddress })
                  }
                />
              </ScrollView>

              <View
                style={[
                  styles.footer,
                  { borderTopColor: colors.border, backgroundColor: colors.surface },
                ]}
              >
                <TouchableOpacity
                  onPress={handleClear}
                  style={styles.clearBtn}
                  accessibilityRole="button"
                  accessibilityLabel="Clear form"
                >
                  <AppText variant="link" color={colors.textSecondary}>
                    Clear
                  </AppText>
                </TouchableOpacity>
                <View style={styles.saveBtn}>
                  <CustomButton
                    buttonText={saving ? 'Saving…' : 'Use this address'}
                    handlePress={handleSave}
                    disableButton={saving}
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>

        <Modal
          animationType="slide"
          transparent
          visible={contactModal}
          onRequestClose={() => setContactModal(false)}
        >
          <View style={styles.overlay}>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setContactModal(false)}
            />
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.background,
                  maxHeight: sheetMaxHeight * 0.85,
                  paddingBottom: Math.max(insets.bottom, Spacing.md),
                },
              ]}
            >
              <View style={styles.handleWrap}>
                <View style={[styles.handle, { backgroundColor: colors.border }]} />
              </View>
              <View style={styles.header}>
                <AppText variant="h2">Saved addresses</AppText>
                <TouchableOpacity onPress={() => setContactModal(false)} hitSlop={12}>
                  <AppText variant="link" color={colors.textSecondary}>
                    Close
                  </AppText>
                </TouchableOpacity>
              </View>
              <FlatList
                data={savedContact}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.contactList}
                ListEmptyComponent={
                  <AppText variant="body" secondary style={styles.empty}>
                    No saved addresses yet. Fill the form and turn on “Save this address”.
                  </AppText>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => applySavedContact(item)}
                    style={[
                      styles.contactCard,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        borderRadius: radius.md,
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Use address for ${item.name}`}
                  >
                    <AppText variant="h3">{item.name}</AppText>
                    {item.companyName ? (
                      <AppText variant="bodySmall" secondary>
                        {item.companyName}
                      </AppText>
                    ) : null}
                    <AppText variant="bodySmall" secondary>
                      {[item.addressOne, item.city].filter(Boolean).join(', ')}
                    </AppText>
                    <AppText variant="caption" muted>
                      {item.countryCode} {item.mobileNumber}
                    </AppText>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </Modal>
    </View>
  );
};

export default SaveAddressForm;

const styles = StyleSheet.create({
  root: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    overflow: 'hidden',
  },
  handleWrap: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  savedBtn: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    padding: Spacing.lg,
    gap: 4,
  },
  scroll: {
    flexGrow: 1,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  sectionLabel: {
    marginTop: Spacing.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  codeCol: { width: '30%' },
  phoneCol: { flex: 1 },
  half: { flex: 1 },
  pickerWrap: {
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  toggleLabel: { flex: 1 },
  toggleMark: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  clearBtn: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  saveBtn: { flex: 1 },
  contactList: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  contactCard: {
    borderWidth: 1,
    padding: Spacing.lg,
    gap: 4,
    marginBottom: Spacing.md,
  },
  empty: {
    paddingVertical: Spacing.xxl,
    textAlign: 'center',
  },
});
