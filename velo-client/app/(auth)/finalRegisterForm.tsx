import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView, Modal, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics';
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Chip, Divider, RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { useColorScheme } from '@/hooks/useColorScheme';
import useLoginAccountStore from '@/store/loginAccountStore';
import { Ionicons } from '@expo/vector-icons';

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(10),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: moderateScale(20),
    padding: horizontalScale(24),
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    alignSelf: 'center',
    marginVertical: verticalScale(30),
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  iconContainer: {
    marginBottom: verticalScale(10),
    width: horizontalScale(60),
    height: verticalScale(60),
    borderRadius: moderateScale(30),
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: moderateScale(32),
  },
  title: {
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: verticalScale(4),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: moderateScale(14),
    textAlign: 'center',
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    marginBottom: verticalScale(18),
    width: '100%',
  },
  inputLabel: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(6),
    fontWeight: '500',
  },
  input: {
    width: '100%',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(16),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerContainer: {
    borderRadius: moderateScale(12),
    borderWidth: 1,
    overflow: 'hidden',
    marginTop: verticalScale(2),
  },
  picker: {
    width: '100%',
    height: verticalScale(44),
  },
  sectionContainer: {
    marginBottom: verticalScale(18),
    width: '100%',
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  divider: {
    marginBottom: verticalScale(10),
    height: 1,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
    marginBottom: verticalScale(8),
  },
  chip: {
    marginBottom: verticalScale(8),
    borderRadius: moderateScale(16),
    borderWidth: 1,
  },
  selectedChip: {
    borderWidth: 1,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
    gap: horizontalScale(16),
  },
  radioButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: horizontalScale(16),
  },
});

const FinalRegisterForm = () => {
  const { accountLoginData, setAccountLoginData } = useLoginAccountStore();
  const colorScheme = useColorScheme();
  const [countryList, setCountryList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [accountRole, setAccountRole] = useState('');
  const [addressOne, setAddressOne] = useState('');
  const [addressTwo, setAddressTwo] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buttonDisable, setButtonDisable] = useState(false);
  const [modeOfWork, setModeOfWork] = useState('SOLO');
  const [organisationName, setOrganisationName] = useState('');
  const [organisationAddress, setOrganisationAddress] = useState('');
  const [organisationWebsiteUrl, setOrganisationWebsiteUrl] = useState('');
  const [iosPickerVisible, setIosPickerVisible] = useState(false);

  const handleChipPress = (countryName, countryId, type) => {
    if (type === 'country') {
      setSelectedCountries((prev) =>
        prev.includes(countryId) ? prev.filter((item) => item !== countryId) : [...prev, countryId]
      );
    } else if (type === 'category') {
      setSelectedCategories((prev) =>
        prev.includes(countryId) ? prev.filter((item) => item !== countryId) : [...prev, countryId]
      );
    }
  };

  useEffect(() => {
    const getCountryFromDB = async () => {
      const getAccInfo = await SecureStore.getItemAsync('registerDetail');
      setAccountId(JSON.parse(getAccInfo).id);
      setAccountRole(JSON.parse(getAccInfo).role);
      const response = await axios.get(`${ipURL}/api/country/get-all-countries`);
      const getCategory = await axios.get(`${ipURL}/api/category/get-all-categories`);
      setCategoryList(getCategory.data);
      setCountryList(response.data);
      setLoading(false);
    };
    getCountryFromDB();
  }, []);

  const handleFinalRegisterForm = async () => {
    try {
      setButtonDisable(true);
      if (accountRole === 'USER') {
        const formData = {
          userId: accountId,
          addressOne,
          addressTwo,
          state,
          city,
          zipCode,
          country,
        };
        const response = await axios.post(`${ipURL}/api/address/create-user-address`, formData);
        setAccountLoginData({
          id: response.data.newUserData.id,
          mobileCode: response.data.newUserData.mobileCode,
          mobileCountry: response.data.newUserData.mobileCountry,
          mobileNumber: response.data.newUserData.mobileNumber,
          name: response.data.newUserData.name,
          password: response.data.newUserData.password,
          registerVerificationStatus: response.data.newUserData.registerVerificationStatus,
          role: response.data.newUserData.role,
          updatedAt: response.data.newUserData.updatedAt,
          token: response.data.newUserData.token,
          modeOfWork: response.data.newUserData.modeOfWork ? response.data.newUserData.modeOfWork : null,
        });
        await SecureStore.setItemAsync('registerDetail', JSON.stringify(response.data.newUserData));
        router.replace('/(tabs)/home' as any);
      } else if (accountRole === 'AGENT') {
        const formData = {
          userId: accountId,
          selectedCountries,
          selectedCategories,
          modeOfWork,
          organisationName,
          organisationAddress,
          organisationWebsiteUrl,
        };
        const response = await axios.post(`${ipURL}/api/address/create-agent-address`, formData);
        router.push({ pathname: '/(auth)/setAppointment', params: { accountId } });
        setButtonDisable(false);
      }
    } catch (e) {
      setButtonDisable(false);
    }
  };

  // Dynamic colors for dark/light mode
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FAFAFA';
  const bgOuter = colorScheme === 'dark' ? '#101014' : '#FFF';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#222';
  const textSecondary = colorScheme === 'dark' ? '#AAA' : '#666';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const inputBg = colorScheme === 'dark' ? '#23242A' : '#FFF';
  const chipBg = colorScheme === 'dark' ? '#23242A' : '#F5F5F5';
  const chipSelected = '#FFAC1C';

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedView style={[styles.outerContainer, { backgroundColor: bgOuter }]}> 
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%' }}
        >
          {loading ? (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={chipSelected} />
            </ThemedView>
          ) : (
            <ThemedView style={{ flex: 1, width: '100%' }}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: verticalScale(40) }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <ThemedView style={[styles.card, { backgroundColor: bgCard, shadowColor: colorScheme === 'dark' ? '#000' : '#000' }]}> 
                  <ThemedView style={styles.headerContainer}>
                    <ThemedView style={[styles.iconContainer, { backgroundColor: colorScheme === 'dark' ? '#23242A' : '#FFF3E0' }]}> 
                      <ThemedText style={[styles.icon, { color: textPrimary }]}>📝</ThemedText>
                    </ThemedView>
                    <ThemedText type="subtitle" style={[styles.title, { color: textPrimary }]}>Final Steps</ThemedText>
                    <ThemedText type="default" style={[styles.subtitle, { color: textSecondary }]}>Complete your registration</ThemedText>
                  </ThemedView>
                  {accountRole === 'USER' && (
                    <>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>Address 1</ThemedText>
                        <TextInput
                          placeholder="Enter Address 1"
                          placeholderTextColor={textSecondary}
                          value={addressOne}
                          onChangeText={setAddressOne}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </ThemedView>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>Address 2</ThemedText>
                        <TextInput
                          placeholder="Enter Address 2"
                          placeholderTextColor={textSecondary}
                          value={addressTwo}
                          onChangeText={setAddressTwo}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </ThemedView>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>State</ThemedText>
                        <TextInput
                          placeholder="Enter Your State"
                          placeholderTextColor={textSecondary}
                          value={state}
                          onChangeText={setState}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </ThemedView>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>City</ThemedText>
                        <TextInput
                          placeholder="Enter Your City"
                          placeholderTextColor={textSecondary}
                          value={city}
                          onChangeText={setCity}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </ThemedView>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>Zip Code</ThemedText>
                        <TextInput
                          placeholder="Enter Your Zipcode"
                          placeholderTextColor={textSecondary}
                          value={zipCode}
                          onChangeText={setZipCode}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </ThemedView>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>Country</ThemedText>
                        {Platform.OS === 'ios' ? (
                          <>
                            <TouchableOpacity
                              style={{
                                borderWidth: 1,
                                borderColor: borderColor,
                                borderRadius: 10,
                                minHeight: 48,
                                justifyContent: 'center',
                                paddingHorizontal: 12,
                                backgroundColor: inputBg,
                                marginVertical: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}
                              onPress={() => setIosPickerVisible(true)}
                              activeOpacity={0.8}
                            >
                              <ThemedText style={{ color: country ? textPrimary : textSecondary, flex: 1 }}>
                                {country
                                  ? (countryList.find((item) => item.id === country)?.name || '--Select--')
                                  : '--Select--'}
                              </ThemedText>
                              <Ionicons
                                name="chevron-down"
                                size={18}
                                color={textPrimary}
                                style={{ marginLeft: 8 }}
                              />
                            </TouchableOpacity>
                            <Modal
                              visible={iosPickerVisible}
                              transparent
                              animationType="slide"
                              onRequestClose={() => setIosPickerVisible(false)}
                            >
                              <TouchableOpacity
                                style={{
                                  flex: 1,
                                  backgroundColor: 'rgba(0,0,0,0.3)',
                                  justifyContent: 'flex-end',
                                }}
                                activeOpacity={1}
                                onPressOut={() => setIosPickerVisible(false)}
                              >
                                <View
                                  style={{
                                    backgroundColor: inputBg,
                                    borderTopLeftRadius: 16,
                                    borderTopRightRadius: 16,
                                    paddingBottom: 24,
                                  }}
                                >
                                  <Picker
                                    selectedValue={country}
                                    onValueChange={(itemValue) => {
                                      setCountry(itemValue);
                                      setIosPickerVisible(false);
                                    }}
                                    style={{ color: textPrimary }}
                                  >
                                    <Picker.Item color={textSecondary} label="--Select--" value="" />
                                    {countryList.map((item, index) => (
                                      <Picker.Item color={textPrimary} key={index} label={item.name} value={item.id} />
                                    ))}
                                  </Picker>
                                </View>
                              </TouchableOpacity>
                            </Modal>
                          </>
                        ) : (
                          <Picker
                            selectedValue={country}
                            onValueChange={setCountry}
                            style={[styles.picker, { color: textPrimary }]}
                            dropdownIconColor={textPrimary}
                          >
                            <Picker.Item color={textSecondary} label="--Select--" value="" />
                            {countryList.map((item, index) => (
                              <Picker.Item color={textPrimary} key={index} label={item.name} value={item.id} />
                            ))}
                          </Picker>
                        )}
                      </ThemedView>
                    </>
                  )}
                  {accountRole === 'AGENT' && (
                    <>
                      <ThemedView style={styles.sectionContainer}>
                        <ThemedText style={[styles.sectionTitle, { color: textPrimary }]}>Countries of Operation</ThemedText>
                        <Divider style={[styles.divider, { backgroundColor: borderColor }]} />
                        <ThemedView style={styles.chipGrid}>
                          {countryList.map((item) => (
                            <Chip
                              key={item.id}
                              icon={selectedCountries.includes(item.id) ? 'check' : 'plus'}
                              style={selectedCountries.includes(item.id) ? [styles.selectedChip, { backgroundColor: chipSelected, borderColor: chipSelected }] : [styles.chip, { backgroundColor: chipBg, borderColor }]}
                              textStyle={{ color: selectedCountries.includes(item.id) ? '#222' : textPrimary }}
                              onPress={() => handleChipPress(item.name, item.id, 'country')}
                            >
                              {item.name}
                            </Chip>
                          ))}
                        </ThemedView>
                      </ThemedView>
                      <ThemedView style={styles.sectionContainer}>
                        <ThemedText style={[styles.sectionTitle, { color: textPrimary }]}>Categories</ThemedText>
                        <Divider style={[styles.divider, { backgroundColor: borderColor }]} />
                        <ThemedView style={styles.chipGrid}>
                          {categoryList.map((item) => (
                            <Chip
                              key={item.id}
                              icon={selectedCategories.includes(item.id) ? 'check' : 'plus'}
                              style={selectedCategories.includes(item.id) ? [styles.selectedChip, { backgroundColor: chipSelected, borderColor: chipSelected }] : [styles.chip, { backgroundColor: chipBg, borderColor }]}
                              textStyle={{ color: selectedCategories.includes(item.id) ? '#222' : textPrimary }}
                              onPress={() => handleChipPress(item.name, item.id, 'category')}
                            >
                              {item.name}
                            </Chip>
                          ))}
                        </ThemedView>
                      </ThemedView>
                      <ThemedView style={styles.sectionContainer}>
                        <ThemedText style={[styles.sectionTitle, { color: textPrimary }]}>Mode of Work</ThemedText>
                        <Divider style={[styles.divider, { backgroundColor: borderColor }]} />
                        <ThemedView style={styles.rowContainer}>
                          <TouchableOpacity onPress={() => setModeOfWork('SOLO')} style={styles.radioButtonRow}>
                            <RadioButton
                              value="SOLO"
                              status={modeOfWork === 'SOLO' ? 'checked' : 'unchecked'}
                              onPress={() => setModeOfWork('SOLO')}
                            />
                            <ThemedText style={{ color: textPrimary }}>SOLO</ThemedText>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setModeOfWork('ORGANISATION')} style={styles.radioButtonRow}>
                            <RadioButton
                              value="ORGANISATION"
                              status={modeOfWork === 'ORGANISATION' ? 'checked' : 'unchecked'}
                              onPress={() => setModeOfWork('ORGANISATION')}
                            />
                            <ThemedText style={{ color: textPrimary }}>Organisation</ThemedText>
                          </TouchableOpacity>
                        </ThemedView>
                      </ThemedView>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>Organisation Name</ThemedText>
                        <TextInput
                          placeholder={modeOfWork === 'SOLO' ? 'Create a Velo company name' : 'Enter Organisation Name'}
                          placeholderTextColor={textSecondary}
                          value={organisationName}
                          onChangeText={setOrganisationName}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </ThemedView>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>Organisation Address 1</ThemedText>
                        <TextInput
                          placeholder={modeOfWork === 'SOLO' ? 'Input your address' : 'Enter Organisation Address'}
                          placeholderTextColor={textSecondary}
                          value={organisationAddress}
                          onChangeText={setOrganisationAddress}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </ThemedView>
                      <ThemedView style={styles.inputContainer}>
                        <ThemedText style={[styles.inputLabel, { color: textPrimary }]}>Organisation Website URL</ThemedText>
                        <TextInput
                          placeholder={modeOfWork === 'SOLO' ? 'Enter your website URL' : 'Enter Organisation Website URL'}
                          placeholderTextColor={textSecondary}
                          value={organisationWebsiteUrl}
                          onChangeText={setOrganisationWebsiteUrl}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </ThemedView>
                    </>
                  )}
                  <CustomButton
                    buttonText="Complete Registration"
                    handlePress={handleFinalRegisterForm}
                    disableButton={buttonDisable}
                  />
                </ThemedView>
              </ScrollView>
            </ThemedView>
          )}
        </KeyboardAvoidingView>
      </ThemedView>
    </TouchableWithoutFeedback>
  );
};

export default FinalRegisterForm;