import { StyleSheet, Modal, TouchableOpacity, Dimensions, ScrollView, Platform, View, Text, useColorScheme, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState,useCallback } from 'react'
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import SaveAddressForm from '@/components/SaveAddressForm'
import SelectPackage from '@/components/SelectPackage'
import ShipmentDetailPayment from '@/components/ShipmentDetailPayment'
import { router, useFocusEffect } from 'expo-router'
import useShipmentStore from '@/store/shipmentStore'
import { Colors } from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlowProgress } from '@/components/wizard/FlowProgress'
import { SelectableRow } from '@/components/forms/SelectableRow'
import { AppText } from '@/components/AppText'
import { SHIPMENT_STEPS, shipmentStepKeyAt } from '@/constants/flowSteps'
import CustomButton from '@/components/CustomButton'
import { Spacing } from '@/constants/Colors'
import { goToShipmentStep } from '@/utils/resumeShipmentWizard'



const { width } = Dimensions.get('window')

const CreateShipmentHome = () => {
  const {
    setPackageDetail,
    setPackageDescription,
    savedAddressData,
    setSavedAddressData,
    resetShipmentData,
    accountAddressData,
    setAccountAddressData,
    setItemType,
    setCreateShipment,
    editData,
    draftId,
    itemType,
    packageDetail,
    packageDescription,
  } = useShipmentStore();

  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const [userSecureStorage, setUserSecureStorage] = useState(false)

  const [userAddress, setUserAddress] = useState('')
  const [modalVisible, setModalVisible] = useState(true)
  const [addressModalVisible, setAddressModalVisible] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(Platform.OS === 'ios' ? true : false);
  const [checked, setChecked] = useState('false');
  const [buttonClick, setButtonClick] = useState(false);
  const [formErrors, setFormErrors] = useState<{ package?: string; description?: string }>({});

  const handleGetDescription = (description) => {
    setPackageDescription(description)
  }

  const handlePackagedetail = (dimension, piece, weight) => {
    setPackageDetail({
      length: dimension.length,
      height: dimension.height,
      width: dimension.width,
      numberOfPieces: piece,
      weight: (Number(weight) * Number(piece)).toString(),
    })
    
  }
  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused
      setButtonClick(false)
      setSavedAddressData({
        ...savedAddressData,
        gotDetails: false
      })
    }, [])
  )


  useEffect(()=>{
    if(editData){
      setModalVisible(false)
      if (itemType === 'DOCUMENT' || itemType === 'PACKAGE') {
        setChecked(itemType)
      }
      // Ensure address/package sections stay visible when resuming a draft
      if (!savedAddressData.gotDetails && (savedAddressData.name || packageDetail.numberOfPieces)) {
        setSavedAddressData({ gotDetails: true })
      }
    }
  },[editData, itemType])

  const clearPackageFieldsOnly = () => {
    setPackageDetail({
      packageName: '',
      length: '',
      height: '',
      width: '',
      numberOfPieces: '1',
      weight: '',
    })
    setPackageDescription('')
  }

  const validateForm = (): { valid: boolean; errors: { package?: string; description?: string } } => {
    const errors: { package?: string; description?: string } = {};
    if (checked === 'DOCUMENT') {
      const num = Number(packageDetail?.numberOfPieces);
      if (!packageDetail?.numberOfPieces?.trim() || isNaN(num) || num < 1) {
        errors.package = 'Please enter number of document(s) (at least 1).';
      }
    } else if (checked === 'PACKAGE') {
      const len = Number(packageDetail?.length);
      const wdt = Number(packageDetail?.width);
      const hgt = Number(packageDetail?.height);
      const pieces = Number(packageDetail?.numberOfPieces);
      const w = Number(packageDetail?.weight);
      const hasValidDimensions =
        packageDetail?.length?.trim() && !isNaN(len) && len > 0 &&
        packageDetail?.width?.trim() && !isNaN(wdt) && wdt > 0 &&
        packageDetail?.height?.trim() && !isNaN(hgt) && hgt > 0;
      const hasValidPieces = packageDetail?.numberOfPieces?.trim() && !isNaN(pieces) && pieces >= 1;
      const hasValidWeight = packageDetail?.weight?.trim() && !isNaN(w) && w > 0;
      if (!hasValidDimensions || !hasValidPieces || !hasValidWeight) {
        errors.package = 'Please complete all package details (dimensions, number of pieces, and weight).';
      }
    }
    const desc = (packageDescription ?? '').trim();
    if (!desc) {
      errors.description = 'Please enter a description for your shipment.';
    }
    return { valid: Object.keys(errors).length === 0, errors };
  };

  const handleContinuePackageDetail = () => {
    setButtonClick(true);
    const { valid, errors } = validateForm();
    if (!valid) {
      setFormErrors(errors);
      return;
    }
    // Critical: itemType must be in the store before carrier quotes are fetched
    if (checked === 'DOCUMENT' || checked === 'PACKAGE') {
      setItemType(checked);
    }
    setFormErrors({});
    setAccountAddressData({
      ...accountAddressData,
      userName: userSecureStorage['name'],
      email: userSecureStorage['email'],
      mobileNumber: userSecureStorage['mobileNumber'],
      countryCode: userSecureStorage['mobileCode'],
    });
    setSavedAddressData({
      ...savedAddressData,
      shipmentDate: date,
      deliveryDate: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
    });
    router.push('/home/createShipment/shippingOptions');
  };


  const handleCloseSaveAddressModal = () => {
    setAddressModalVisible(false)
  }
  

  useEffect(() => {
    const checkUser = async () => {
      let user = await SecureStore.getItemAsync('registerDetail')
      if (!user) return
      const userData = JSON.parse(user)

      setUserSecureStorage(userData)      
    }
    checkUser()
  }, [])
  console.log(userSecureStorage, 'userSecureStorage------');
  

  

  useEffect(() => {
    const getUserAddress = async () => {
      const userAddress = await axios.get(`${ipURL}/api/address/get-user-address/${userSecureStorage['id']}`)
      setUserAddress(userAddress.data.data[0])

      console.log(userAddress.data.data[0], 'userAddress.data.data[0]------');
      
      setAccountAddressData({
        ...accountAddressData,
        addressOne: userAddress.data.data[0].addressOne,
        addressTwo: userAddress.data.data[0].addressTwo,
        city: userAddress.data.data[0].city,
        countryId: userAddress.data.data[0].countryId,
        state: userAddress.data.data[0].state,
        country: userAddress.data.data[0].country
      })
    }
    if (checked === 'DOCUMENT' || checked === 'PACKAGE') {
      getUserAddress();
    }
  }, [checked])

  const handleOptionSelect = (option) => {
    setSelectedOption(option)
    setModalVisible(false)
    resetShipmentData()
    setCreateShipment(true)

  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);

    
    setSavedAddressData({
      ...savedAddressData,
      shipmentDate: currentDate
    })
    setShow(Platform.OS === 'ios' ? true : false);
  };

  const onChangeAndroid = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeAndroid,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };
  




  const PaymentOption = ({ title, description, buttonText, isSecondary, onPress }) => (
    <View style={styles.paymentOptionContainer}>
      <View style={styles.paymentOptionHeader}>
        <AppText variant="h3">{title}</AppText>
        <AppText variant="bodySmall" secondary style={{ marginTop: 6 }}>{description}</AppText>
      </View>
      <TouchableOpacity
        style={[styles.paymentOptionButton, isSecondary && styles.paymentOptionSecondaryButton]}
        onPress={onPress}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={buttonText}
      >
        <Text style={[styles.paymentOptionButtonText, isSecondary && styles.paymentOptionSecondaryButtonText, { color: isSecondary ? '#FFAC1C' : 'white' }]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  )


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      
      {/* Modal component remains unchanged */}
     {!editData &&  <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
            <View style={styles.shippingMethodHeadContainer}>
              <AppText variant="h2" style={styles.headTitle}>
                How will you pay?
              </AppText>
              <AppText variant="bodySmall" secondary style={styles.headSubtitle}>
                You can change this later before confirming.
              </AppText>
            </View>

            <PaymentOption
              title="Pay online"
              description="Card or digital wallet when you confirm the shipment."
              buttonText="Pay online"
              isSecondary={false}
              onPress={() => handleOptionSelect({ id: 1, text: 'Online Payment' })}
            />

            <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

            <PaymentOption
              title="Pay on collection"
              description="Cash or card when the package is picked up."
              buttonText="Pay later"
              isSecondary
              onPress={() => handleOptionSelect({ id: 2, text: 'Payment during pickup' })}
            />
          </View>
        </View>
      </Modal>}
      <SaveAddressForm
        addressModalVisible={addressModalVisible}
        onClose={handleCloseSaveAddressModal}
        userId={userSecureStorage['id']}
      />

{(!modalVisible || editData) && (
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            contentContainerStyle={{ paddingHorizontal: Spacing.md, paddingBottom: Spacing.xxxl }}
          >
      <FlowProgress
        step={1}
        total={SHIPMENT_STEPS.length}
        label={SHIPMENT_STEPS[0].label}
        nextLabel={SHIPMENT_STEPS[1].label}
        onStepPress={
          editData || draftId
            ? (n) => {
                const key = shipmentStepKeyAt(n);
                if (key) goToShipmentStep(key);
              }
            : undefined
        }
      />
      <AppText variant="h1" style={{ marginBottom: Spacing.sm }}>Shipment details</AppText>
      <AppText variant="body" secondary style={{ marginBottom: Spacing.xl }}>
        Set the date, type, addresses, and package info.
      </AppText>
      <View>
        {/* Shipping Date Section */}

        {Platform.OS === 'ios' && (
          <View style={[styles.section, { backgroundColor: themeColors.background }]}>
            <AppText variant="label" style={{ marginBottom: Spacing.sm }}>
              Shipping date
            </AppText>
            <View
              style={[
                styles.iosDatePickerContainer,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
            >
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={savedAddressData.shipmentDate || date}
                  mode="date"
                  display="spinner"
                  themeVariant={colorScheme === 'dark' ? 'dark' : 'light'}
                  onChange={onChange}
                  minimumDate={new Date()}
                  maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
                  style={styles.iosDatePicker}
                />
              )}
            </View>
          </View>
        )}

        {Platform.OS === 'android' && (
          <View style={[styles.section, { backgroundColor: themeColors.background }]}>
            <AppText variant="label" style={{ marginBottom: Spacing.sm }}>
              Shipping date
            </AppText>
            <TouchableOpacity
              onPress={showDatepicker}
              style={styles.androidDateButton}
              accessibilityRole="button"
            >
              <Text style={styles.androidDateButtonText} numberOfLines={1}>
                {date.toDateString()}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Shipping Type Section */}
        <View style={[styles.section, { backgroundColor: themeColors.background, gap: 12 }]}>
          <AppText variant="label">What are you shipping?</AppText>
          <SelectableRow
            title="Document"
            description="Letters, IDs, and paperwork"
            selected={checked === 'DOCUMENT'}
            onPress={() => {
              if (checked === 'DOCUMENT') return;
              setChecked('DOCUMENT');
              setItemType('DOCUMENT');
              // Never call resetShipmentData here — it wipes itemType and draft state
              clearPackageFieldsOnly();
              setCreateShipment(true);
              setFormErrors((e) => ({ ...e, package: undefined }));
            }}
          />
          <SelectableRow
            title="Package"
            description="Boxes and parcels with dimensions"
            selected={checked === 'PACKAGE'}
            onPress={() => {
              if (checked === 'PACKAGE') return;
              setChecked('PACKAGE');
              setItemType('PACKAGE');
              clearPackageFieldsOnly();
              setCreateShipment(true);
              setFormErrors((e) => ({ ...e, package: undefined }));
            }}
          />
        </View>

        {/* Shipping route: From → To */}
        {checked !== 'false' && (
          <View style={styles.section}>
            <AppText variant="label" style={{ marginBottom: Spacing.sm }}>
              Route
            </AppText>

            <View
              style={[
                styles.routeCard,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
            >
              {/* FROM */}
              <View style={styles.routeBlock}>
                <View style={styles.routeLabelRow}>
                  <View style={[styles.routeBadge, { backgroundColor: themeColors.tintMuted }]}>
                    <AppText variant="caption" color={themeColors.tint}>
                      From
                    </AppText>
                  </View>
                  <AppText variant="caption" muted style={styles.routeLabelHint}>
                    Your pickup address
                  </AppText>
                </View>
                {accountAddressData?.addressOne ? (
                  <>
                    <AppText variant="h3" style={styles.routeName}>
                      {userSecureStorage?.['name'] || accountAddressData.userName || 'You'}
                    </AppText>
                    <AppText variant="bodySmall" secondary style={styles.routeLineText}>
                      {[accountAddressData.addressOne, accountAddressData.addressTwo]
                        .filter(Boolean)
                        .join(', ')}
                    </AppText>
                    <AppText variant="bodySmall" secondary style={styles.routeLineText}>
                      {[
                        accountAddressData.city,
                        accountAddressData.state,
                        accountAddressData.country?.name,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </AppText>
                    <AppText variant="caption" muted style={styles.routeMeta}>
                      {[
                        userSecureStorage?.['email'] || accountAddressData.email,
                        [
                          userSecureStorage?.['mobileCode'] || accountAddressData.countryCode,
                          userSecureStorage?.['mobileNumber'] || accountAddressData.mobileNumber,
                        ]
                          .filter(Boolean)
                          .join(' '),
                      ]
                        .filter(Boolean)
                        .join('  ·  ')}
                    </AppText>
                  </>
                ) : (
                  <AppText variant="bodySmall" secondary>
                    Loading your address…
                  </AppText>
                )}
              </View>

              <View style={[styles.routeDivider, { backgroundColor: themeColors.borderSubtle }]}>
                <View style={[styles.routeDot, { backgroundColor: themeColors.tint }]} />
                <View style={[styles.routeLine, { backgroundColor: themeColors.border }]} />
                <View
                  style={[
                    styles.routeDot,
                    {
                      backgroundColor: savedAddressData.gotDetails
                        ? themeColors.tint
                        : themeColors.border,
                    },
                  ]}
                />
              </View>

              {/* TO */}
              <View style={styles.routeBlock}>
                <View style={styles.routeLabelRow}>
                  <View style={[styles.routeBadge, { backgroundColor: themeColors.tintMuted }]}>
                    <AppText variant="caption" color={themeColors.tint}>
                      To
                    </AppText>
                  </View>
                  <AppText variant="caption" muted style={styles.routeLabelHint}>
                    Delivery address
                  </AppText>
                </View>

                {savedAddressData.gotDetails ? (
                  <>
                    <AppText variant="h3" style={styles.routeName}>
                      {savedAddressData.name}
                    </AppText>
                    {savedAddressData.companyName ? (
                      <AppText variant="bodySmall" secondary style={styles.routeLineText}>
                        {savedAddressData.companyName}
                      </AppText>
                    ) : null}
                    <AppText variant="bodySmall" secondary style={styles.routeLineText}>
                      {[savedAddressData.addressOne, savedAddressData.addressTwo]
                        .filter(Boolean)
                        .join(', ')}
                    </AppText>
                    <AppText variant="bodySmall" secondary style={styles.routeLineText}>
                      {[
                        savedAddressData.city,
                        savedAddressData.state,
                        savedAddressData.zipCode ? `ZIP ${savedAddressData.zipCode}` : null,
                      ]
                        .filter(Boolean)
                        .join(', ')}
                    </AppText>
                    <AppText variant="caption" muted style={styles.routeMeta}>
                      {[
                        savedAddressData.email,
                        [savedAddressData.countryCode, savedAddressData.mobileNumber]
                          .filter(Boolean)
                          .join(' '),
                      ]
                        .filter(Boolean)
                        .join('  ·  ')}
                    </AppText>
                    <TouchableOpacity
                      onPress={() => setAddressModalVisible(true)}
                      accessibilityRole="button"
                      accessibilityLabel="Change delivery address"
                      hitSlop={8}
                      style={styles.changeLink}
                    >
                      <AppText variant="link" color={themeColors.tint}>
                        Change delivery address
                      </AppText>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => setAddressModalVisible(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Add delivery address"
                    style={[
                      styles.emptyTo,
                      {
                        borderColor: themeColors.border,
                        backgroundColor: themeColors.background,
                      },
                    ]}
                  >
                    <AppText variant="bodyStrong" color={themeColors.tint}>
                      Add delivery address
                    </AppText>
                    <AppText variant="caption" secondary style={{ marginTop: 4 }}>
                      Enter recipient details or pick a saved address
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

       
       
       {savedAddressData.gotDetails && <SelectPackage itemType={checked} getPackageDetail={handlePackagedetail} onButtonclick={buttonClick} />}
       {formErrors.package ? (
          <Text style={styles.fieldError}>{formErrors.package}</Text>
        ) : null}

        {savedAddressData.gotDetails && <ShipmentDetailPayment itemType={checked} onGetData={handleGetDescription} onButtonclick={buttonClick} />}
        {formErrors.description ? (
          <Text style={styles.fieldError}>{formErrors.description}</Text>
        ) : null}

       {savedAddressData.gotDetails && (
          <CustomButton buttonText="Continue to addresses" handlePress={handleContinuePackageDetail} />
        )}
      </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
    
  )
}

const styles = StyleSheet.create({
  // Keeping existing modal styles unchanged
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    width: width * 0.9,
    paddingVertical: verticalScale(24),
    paddingHorizontal: horizontalScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  shippingMethodHeadContainer: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: Spacing.sm,
    marginBottom: verticalScale(20),
  },
  headTitle: {
    flexShrink: 1,
  },
  headSubtitle: {
    flexShrink: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    marginBottom: verticalScale(20),
    marginTop: verticalScale(4),
  },
  iosDatePickerContainer: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iosDatePicker: {
    width: '100%',
    height: 140,
  },
  androidDateButtonText: {
    color: 'white',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  sectionHeader: {
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  actionButton: {
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(16),
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFAC1C',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',

  },
  secondaryButtonText: {
    fontWeight: '600',
  },
  continueButton: {
    marginTop: verticalScale(24),
  },
  fieldError: {
    color: '#E53935',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(18),
    marginTop: verticalScale(4),
    marginBottom: verticalScale(12),
    flexShrink: 1,
  },
  divider: {
    height: 1,
    marginVertical: verticalScale(16),
  },

  // New and enhanced styles
  container: {
    flex: 1,
  },
  keyboardAvoidingRoot: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  androidDateButton:{
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    minWidth: horizontalScale(120),
    borderRadius: moderateScale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeaderText: {
    fontSize: 17,
    fontWeight: '600',

  },

  shippingTypeContainer: {
    flexDirection: 'row',
    gap: horizontalScale(12),
  },
  shippingTypeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: horizontalScale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
  },
  shippingTypeSelected: {
    borderColor: '#FFAC1C',
    borderWidth: 2,
  },
  shippingTypeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  addressCard: {
    padding: horizontalScale(16),
    marginTop: verticalScale(12),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  routeBlock: {
    gap: 4,
    minWidth: 0,
  },
  routeLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  routeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
    flexShrink: 0,
  },
  routeLabelHint: {
    flexShrink: 1,
  },
  routeName: {
    marginBottom: 2,
    flexShrink: 1,
  },
  routeLineText: {
    flexShrink: 1,
  },
  routeMeta: {
    marginTop: Spacing.sm,
    flexShrink: 1,
  },
  routeDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
    minWidth: 0,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  routeLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  emptyTo: {
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: Spacing.lg,
  },
  changeLink: {
    marginTop: Spacing.md,
    alignSelf: 'flex-start',
  },
  addressName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  addressText: {
    fontSize: 16,
    lineHeight: 24,

  },
  contactInfo: {
    marginTop: verticalScale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    opacity: 0.3,
  },
  contactText: {
    fontSize: 14,

    marginBottom: verticalScale(4),
  },
  addAddressContainer: {
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    minHeight: verticalScale(50),
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countryList: {
    padding: moderateScale(14),
  },

  countryCode: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },

  input: {
    height: verticalScale(50),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(15),
    marginBottom: verticalScale(15),
    fontSize: moderateScale(16),
    color: '#666',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(25),
    overflow: 'hidden',
    height: verticalScale(130),
  },
  picker: {
    color: '#fff',
  },
  title: {
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  titleUnderline: {
    width: horizontalScale(60),
    height: verticalScale(4),
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(2),
  },
  paymentOptionContainer: {
    marginBottom: verticalScale(16),
  },
  paymentOptionHeader: {
    marginBottom: verticalScale(12),
  },
  paymentOptionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  paymentOptionDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
  },
  paymentOptionButton: {
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentOptionSecondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFAC1C',
  },
  paymentOptionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  paymentOptionSecondaryButtonText: {
    fontWeight: '600',
  },
});

export default CreateShipmentHome