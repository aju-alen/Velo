import { FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, TextInput, Alert, View, Text, useColorScheme, SafeAreaView, Platform } from 'react-native'
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
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color="#FFAC1C" />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading listings...</Text>
      </SafeAreaView>
    )
  }

  const renderMarketplaceCategoryCard = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.cardContainer}
        onPress={() => router.push(`/(tabs)/market/${item.id}`)}
      >
        <View style={[
          styles.card,
          {
            backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          }
        ]}>
          {/* Full Width Image Container */}
          <View style={styles.imageWrapper}>
            {item.imageUrl ? (
              <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={[
                styles.imagePlaceholder,
                {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.1)' : 'rgba(255, 172, 28, 0.08)',
                }
              ]}>
                <MaterialIcons name="image" size={48} color="#FFAC1C" />
              </View>
            )}
            
            {/* Gradient Overlay */}
            <View style={styles.imageOverlay}>
              {/* Top Row: Price and Date */}
              <View style={styles.overlayTopRow}>
                <View style={styles.priceBadge}>
                  <Text style={styles.priceText}>
                    {formatPrice(item.price)}
                  </Text>
                </View>
                <View style={styles.dateBadge}>
                  <MaterialIcons 
                    name="access-time" 
                    size={14} 
                    color="#FFF" 
                  />
                  <Text style={styles.dateText}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>

              {/* Bottom: Title */}
              <View style={styles.overlayBottom}>
                <Text style={styles.overlayTitle} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Below Image */}
          <View style={[
            styles.descriptionContainer,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            }
          ]}>
            <Text
              style={[styles.description, { color: themeColors.text }]}
              numberOfLines={3}
            >
              {item.description}
            </Text>
            
            {/* Condition Badge */}
            <View style={styles.footer}>
              <View style={[
                styles.conditionBadge,
                {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.15)' : 'rgba(255, 172, 28, 0.1)',
                }
              ]}>
                <Text style={[styles.conditionText, { color: '#FFAC1C' }]}>
                  {item.condition}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="inventory-2" size={64} color={colorScheme === 'dark' ? themeColors.icon : '#999'} />
      <Text style={[styles.emptyText, { color: themeColors.text }]}>No listings found</Text>
      <Text style={[styles.emptySubtext, { color: themeColors.text }]}>
        {searchQuery ? 'Try adjusting your search' : 'Check back later for new listings'}
      </Text>
    </View>
  )
  console.log(accountDetails,"accountDetails");
  

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.logoText, { color: '#FFAC1C' }]}>Velo</Text>
          {accountDetails?.role === "AGENT" && (
            <TouchableOpacity
              style={styles.createAdButton}
              onPress={handleButtonPress}
              activeOpacity={0.8}
            >
              <MaterialIcons name="add-circle-outline" size={18} color="#FFF" style={{ marginRight: horizontalScale(6) }} />
              <Text style={styles.createAdText}>Create an ad</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[
          styles.searchContainer,
          {
            backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }
        ]}>
          <MaterialIcons 
            name="search" 
            size={20} 
            color={colorScheme === 'dark' ? themeColors.icon : '#666'} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[styles.searchInput, { color: themeColors.text }]}
            placeholder="Search listings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.5)' : '#666'}
          />
          <TouchableOpacity activeOpacity={0.7}>
            <MaterialIcons 
              name="filter-list" 
              size={24} 
              color={colorScheme === 'dark' ? themeColors.icon : '#666'} 
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredListings}
          renderItem={renderMarketplaceCategoryCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContainer,
            filteredListings.length === 0 && styles.emptyListContainer
          ]}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={renderEmptyComponent}
        />
      </View>
    </SafeAreaView>
  )
}

export default MarketHome

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: verticalScale(12),
  },
  loadingText: {
    fontSize: moderateScale(16),
    marginTop: verticalScale(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  logoText: {
    fontSize: moderateScale(32),
    lineHeight: moderateScale(40),
    fontWeight: 'bold',
  },
  createAdButton: {
    backgroundColor: '#FFAC1C',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(10),
    ...Platform.select({
      ios: {
        shadowColor: '#FFAC1C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {

      },  
    }),
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
    borderWidth: 1,
    paddingHorizontal: horizontalScale(16),
    marginBottom: verticalScale(20),
    height: verticalScale(50),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
      },
    }),
  },
  searchIcon: {
    marginRight: horizontalScale(10),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(16),
    marginRight: horizontalScale(10),
  },
  listContainer: {
    paddingBottom: verticalScale(20),
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  cardContainer: {
    marginVertical: verticalScale(8),
  },
  card: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
      },
    }),
  },
  imageWrapper: {
    width: '100%',
    height: verticalScale(250),
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: moderateScale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
    minHeight: verticalScale(120),
  },
  overlayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(8),
  },
  priceBadge: {
    backgroundColor: '#FFAC1C',
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
      },
    }),
  },
  priceText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  dateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(8),
    gap: horizontalScale(4),
  },
  dateText: {
    color: '#FFF',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  overlayBottom: {
    marginTop: 'auto',
  },
  overlayTitle: {
    color: '#FFF',
    fontSize: moderateScale(18),
    fontWeight: '700',
    lineHeight: moderateScale(24),
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  descriptionContainer: {
    padding: moderateScale(16),
  },
  description: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    marginBottom: verticalScale(12),
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  conditionBadge: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(6),
  },
  conditionText: {
    fontSize: moderateScale(11),
    lineHeight: moderateScale(14),
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  separator: {
    height: verticalScale(12),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(60),
    gap: verticalScale(12),
  },
  emptyText: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginTop: verticalScale(8),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: horizontalScale(40),
  },
});