import { StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, ScrollView, Modal, View, Text, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics';
import CustomButton from '@/components/CustomButton';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Chip, Divider, RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import useLoginAccountStore from '@/store/loginAccountStore';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

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
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
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
      <View style={[styles.outerContainer, { backgroundColor: bgOuter }]}> 
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, width: '100%' }}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={chipSelected} />
            </View>
          ) : (
            <View style={{ flex: 1, width: '100%' }}>
              <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: verticalScale(40) }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={[styles.card, { backgroundColor: bgCard, shadowColor: colorScheme === 'dark' ? '#000' : '#000' }]}> 
                  <View style={styles.headerContainer}>
                    <View style={[styles.iconContainer, { backgroundColor: colorScheme === 'dark' ? '#23242A' : '#FFF3E0' }]}> 
                      <Text style={[styles.icon, { color: textPrimary }]}>📝</Text>
                    </View>
                    <Text style={[styles.title, { color: textPrimary }]}>Final Steps</Text>
                    <Text style={[styles.subtitle, { color: textSecondary }]}>Complete your registration</Text>
                  </View>
                  {accountRole === 'USER' && (
                    <>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>Address 1</Text>
                        <TextInput
                          placeholder="Enter Address 1"
                          placeholderTextColor={textSecondary}
                          value={addressOne}
                          onChangeText={setAddressOne}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>Address 2</Text>
                        <TextInput
                          placeholder="Enter Address 2"
                          placeholderTextColor={textSecondary}
                          value={addressTwo}
                          onChangeText={setAddressTwo}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>State</Text>
                        <TextInput
                          placeholder="Enter Your State"
                          placeholderTextColor={textSecondary}
                          value={state}
                          onChangeText={setState}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>City</Text>
                        <TextInput
                          placeholder="Enter Your City"
                          placeholderTextColor={textSecondary}
                          value={city}
                          onChangeText={setCity}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>Zip Code</Text>
                        <TextInput
                          placeholder="Enter Your Zipcode"
                          placeholderTextColor={textSecondary}
                          value={zipCode}
                          onChangeText={setZipCode}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>Country</Text>
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
                              <Text style={{ color: country ? textPrimary : textSecondary, flex: 1 }}>
                                {country
                                  ? (countryList.find((item) => String(item.id) === country)?.name || '--Select--')
                                  : '--Select--'}
                              </Text>
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
                      </View>
                    </>
                  )}
                  {accountRole === 'AGENT' && (
                    <>
                      <View style={styles.sectionContainer}>
                        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Countries of Operation</Text>
                        <Divider style={[styles.divider, { backgroundColor: borderColor }]} />
                        <View style={styles.chipGrid}>
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
                        </View>
                      </View>
                      <View style={styles.sectionContainer}>
                        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Categories</Text>
                        <Divider style={[styles.divider, { backgroundColor: borderColor }]} />
                        <View style={styles.chipGrid}>
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
                        </View>
                      </View>
                      <View style={styles.sectionContainer}>
                        <Text style={[styles.sectionTitle, { color: textPrimary }]}>Mode of Work</Text>
                        <Divider style={[styles.divider, { backgroundColor: borderColor }]} />
                        <View style={styles.rowContainer}>
                          <TouchableOpacity onPress={() => setModeOfWork('SOLO')} style={styles.radioButtonRow}>
                            <RadioButton
                              value="SOLO"
                              status={modeOfWork === 'SOLO' ? 'checked' : 'unchecked'}
                              onPress={() => setModeOfWork('SOLO')}
                            />
                            <Text style={{ color: textPrimary }}>SOLO</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setModeOfWork('ORGANISATION')} style={styles.radioButtonRow}>
                            <RadioButton
                              value="ORGANISATION"
                              status={modeOfWork === 'ORGANISATION' ? 'checked' : 'unchecked'}
                              onPress={() => setModeOfWork('ORGANISATION')}
                            />
                            <Text style={{ color: textPrimary }}>Organisation</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>Organisation Name</Text>
                        <TextInput
                          placeholder={modeOfWork === 'SOLO' ? 'Create a Velo company name' : 'Enter Organisation Name'}
                          placeholderTextColor={textSecondary}
                          value={organisationName}
                          onChangeText={setOrganisationName}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>Organisation Address 1</Text>
                        <TextInput
                          placeholder={modeOfWork === 'SOLO' ? 'Input your address' : 'Enter Organisation Address'}
                          placeholderTextColor={textSecondary}
                          value={organisationAddress}
                          onChangeText={setOrganisationAddress}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </View>
                      <View style={styles.inputContainer}>
                        <Text style={[styles.inputLabel, { color: textPrimary }]}>Organisation Website URL</Text>
                        <TextInput
                          placeholder={modeOfWork === 'SOLO' ? 'Enter your website URL' : 'Enter Organisation Website URL'}
                          placeholderTextColor={textSecondary}
                          value={organisationWebsiteUrl}
                          onChangeText={setOrganisationWebsiteUrl}
                          style={[styles.input, { backgroundColor: inputBg, color: textPrimary, borderColor }]}
                        />
                      </View>
                    </>
                  )}
                  <CustomButton
                    buttonText="Complete Registration"
                    handlePress={handleFinalRegisterForm}
                    disableButton={buttonDisable}
                  />
                </View>
              </ScrollView>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default FinalRegisterForm;