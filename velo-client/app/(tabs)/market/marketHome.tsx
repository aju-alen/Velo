import { FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import * as SecureStore from 'expo-secure-store'

const MarketHome = () => {
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
    return `$${price.toLocaleString()}`
  }

  const handleButtonPress = () => {
    if (accountDetails.registerVerificationStatus === 'LOGGED_IN') {
      Alert.alert(
        'Action Disabled',
        'The button has been disabled until you have been verified by the admin team.'
      );
    } else {
      const accountId = accountDetails.id;
      router.push({pathname:'/(tabs)/market/createListing', params:{accountId}});
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFAC1C" />
      </ThemedView>
    )
  }

  const renderMarketplaceCategoryCard = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.cardContainer}
        onPress={() => router.push(`/(tabs)/market/${item.id}`)}
      >
        <ThemedView style={styles.card}>
          <ThemedView style={styles.imageContainer}>
            <MaterialIcons name="directions-car" size={40} color="#FFAC1C" />
          </ThemedView>

          <ThemedView style={styles.contentContainer}>
            <ThemedView style={styles.headerContainer}>
              <ThemedText type="defaultSemiBold" style={styles.title} numberOfLines={1}>
                {item.title}
              </ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.price}>
                {formatPrice(item.price)}
              </ThemedText>
            </ThemedView>

            <ThemedText
              type="default"
              style={styles.description}
              numberOfLines={2}
            >
              {item.description}
            </ThemedText>

            <ThemedView style={styles.footer}>
              <ThemedView style={styles.infoTag}>
                <MaterialIcons name="access-time" size={16} color="#666" />
                <ThemedText type="mini" style={styles.infoText}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </ThemedText>
              </ThemedView>

              <ThemedText type="mini" style={styles.viewButtonText}>
                Condition: {item.condition}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
      <ThemedText type='logoText'>Velo</ThemedText>
      {accountDetails?.role === "AGENT" && (
        <TouchableOpacity

          style={styles.createAdButton}
          onPress={handleButtonPress}
        >
          <ThemedText style={styles.createAdText}>Create an ad</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>

      <ThemedView style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput

          style={styles.searchInput}
          placeholder="Search listings..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#666"
        />
        <TouchableOpacity>
          <MaterialIcons name="filter-list" size={24} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={filteredListings}
        renderItem={renderMarketplaceCategoryCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <ThemedView style={styles.separator} />}
      />
    </ThemedView>
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
    color: '#666',
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
    elevation: 8,
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
    marginRight: horizontalScale(8),
  },
  price: {
    color: '#FFAC1C',
    fontSize: moderateScale(16),
  },
  description: {
    fontSize: moderateScale(14),
    color: '#666',
    lineHeight: moderateScale(20),
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
    color: '#666',
    marginLeft: horizontalScale(4),
  },
  viewButtonText: {
    color: '#FFAC1C',
    marginRight: horizontalScale(4),
  },
  separator: {
    height: verticalScale(8),
  },
});