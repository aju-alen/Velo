import { FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert, View, Text, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as SecureStore from 'expo-secure-store'
import { Colors } from '@/constants/Colors';

const MarketHome = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const [accountDetails, setAccountDetails] = useState(null);

  const [getCatIdListing, setGetCatIdListing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { catId } = useLocalSearchParams();

  useEffect(() => {
    const checkUser = async () => {
      let account = await SecureStore.getItemAsync('registerDetail');
      setAccountDetails(JSON.parse(account));

    }
    checkUser();
  }, []);
  console.log(accountDetails, 'accountDetails------');
  

  useEffect(() => {
    const getLisitingFromCatId = async () => {
      setGetCatIdListing([]);
      setLoading(true);
      const getCatIdListing = await axios.get(`${ipURL}/api/listing/get-listing-by-category/${catId}`);
      setGetCatIdListing(getCatIdListing.data.listingData);
    }
    getLisitingFromCatId();
    setLoading(false);
  }, [catId]);

  const filteredListings = getCatIdListing.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price) => {
    return `AED ${price.toLocaleString()}`
  }

  const handleButtonPress = () => {
    if (accountDetails.registerVerificationStatus === 'APPOINTMENT_BOOKED') {
      Alert.alert(
        'Action Disabled',
        'The button has been disabled until you have been verified by the admin team.'
      );
    } else if(accountDetails.registerVerificationStatus === 'LOGGED_IN'){
      const accountId = accountDetails.id;
      router.push({pathname:'/(tabs)/market/createListing', params:{accountId}});
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color="#FFAC1C" />
      </View>
    )
  }

  const renderMarketplaceCategoryCard = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.cardContainer}
        onPress={() => router.push(`/(tabs)/market/${item.id}`)}
      >
        <View style={[styles.card, { backgroundColor: themeColors.background, elevation: colorScheme === 'dark' ? 8 : 2 }]}>
          <View style={styles.imageContainer}>
            <Image source={{uri:item.imageUrl}} style={styles.image} />
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text style={[styles.title, { color: themeColors.text }]} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={[styles.price, { color: '#FFAC1C' }]}>
                {formatPrice(item.price)}
              </Text>
            </View>

            <Text
              style={[styles.description, { color: themeColors.text }]}
              numberOfLines={2}
            >
              {item.description}
            </Text>

            <View style={styles.footer}>
              <View style={styles.infoTag}>
                <MaterialIcons name="access-time" size={16} color="#666" />
                <Text style={[styles.infoText, { color: themeColors.text }]}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>

              <Text style={[styles.viewButtonText, { color: '#FFAC1C' }]}>
                Condition: {item.condition}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
  console.log(accountDetails,"accountDetails");
  

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
      <Text style={[styles.logoText, { color: '#FFAC1C' }]}>Velo</Text>
      {accountDetails?.role === "AGENT" && (
        <TouchableOpacity

          style={styles.createAdButton}
          onPress={handleButtonPress}
        >
          <Text style={styles.createAdText}>Create an ad</Text>
        </TouchableOpacity>
      )}
    </View>

      <View style={[styles.searchContainer, { backgroundColor: themeColors.background }]}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput

          style={[styles.searchInput, { color: themeColors.text }]}
          placeholder="Search listings..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        <TouchableOpacity>
          <MaterialIcons name="filter-list" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredListings}
        renderItem={renderMarketplaceCategoryCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: themeColors.background }]} />}
      />
    </View>
  )
}

export default MarketHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(60),
    paddingHorizontal: horizontalScale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  logoText: {
    fontSize: moderateScale(40),
    lineHeight: moderateScale(56),
    fontWeight: 'bold',
  },
  createAdButton: {
    backgroundColor: '#FFAC1C',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(8),
  },
  createAdText: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(12),
    marginBottom: verticalScale(20),
    height: verticalScale(44),
  },
  searchIcon: {
    marginRight: horizontalScale(8),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    marginRight: horizontalScale(8),
  },
  listContainer: {
    paddingBottom: verticalScale(20),
  },
  cardContainer: {
    marginVertical: verticalScale(6),
  },
  card: {
    flexDirection: 'row',
    borderRadius: moderateScale(16),
    padding: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  imageContainer: {
    width: horizontalScale(80),
    height: verticalScale(80),
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(4),
  },
  title: {
    flex: 1,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600',
    marginRight: horizontalScale(8),
  },
  price: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600',
  },
  description: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(8),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    marginLeft: horizontalScale(4),
  },
  viewButtonText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    marginRight: horizontalScale(4),
  },
  separator: {
    height: verticalScale(8),
  },
});