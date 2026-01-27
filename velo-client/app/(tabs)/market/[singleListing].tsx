import { StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, ActivityIndicator, View, Text, useColorScheme, SafeAreaView, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import { Colors } from '@/constants/Colors';

const SingleListing = () => {
  const [listing, setListing] = useState(null)
  const [similarListings, setSimilarListings] = useState([])
  const [loading, setLoading] = useState(true)
  const { singleListing } = useLocalSearchParams()
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  useEffect(() => {
    const getSingleListing = async () => {
      try {
        const response = await axios.get(`${ipURL}/api/listing/get-single-listing/${singleListing}`)
        setListing(response.data.listingData)
        setSimilarListings(response.data.similarListings)
      } catch (error) {
        console.error('Error fetching listing:', error)
      } finally {
        setLoading(false)
      }
    }
    getSingleListing()
  }, [singleListing])

  const formatPrice = (price) => {
    return `AED ${price.toLocaleString()}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderSimilarItem = ({ item }) => (
    <TouchableOpacity
      style={styles.similarItemContainer}
      onPress={() => router.push(`/(tabs)/market/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={[
        styles.similarItemCard,
        {
          backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        }
      ]}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.similarItemImage} />
        ) : (
          <View style={[
            styles.similarItemImagePlaceholder,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.1)' : 'rgba(255, 172, 28, 0.08)',
            }
          ]}>
            <MaterialIcons name="image" size={32} color="#FFAC1C" />
          </View>
        )}
        <View style={styles.similarItemContent}>
          <Text style={[styles.similarItemTitle, { color: themeColors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.similarItemPrice, { color: '#FFAC1C' }]}>
            {formatPrice(item.price)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color="#FFAC1C" />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading listing...</Text>
      </SafeAreaView>
    )
  }

  if (!listing) {
    return (
      <SafeAreaView style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
        <MaterialIcons name="error-outline" size={64} color={colorScheme === 'dark' ? themeColors.icon : '#999'} />
        <Text style={[styles.errorText, { color: themeColors.text }]}>Unable to load listing details</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons 
            name="arrow-back" 
            size={24} 
            color={themeColors.icon} 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.text }]}>Listing Details</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <MaterialIcons 
            name="share" 
            size={24} 
            color={themeColors.icon} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          {listing.imageUrl ? (
            <Image source={{ uri: listing.imageUrl }} style={styles.image} />
          ) : (
            <View style={[
              styles.imagePlaceholder,
              {
                backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.1)' : 'rgba(255, 172, 28, 0.08)',
              }
            ]}>
              <MaterialIcons name="image" size={64} color="#FFAC1C" />
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: themeColors.text }]}>
              {listing.title}
            </Text>
            <Text style={[styles.price, { color: '#FFAC1C' }]}>
              {formatPrice(listing.price)}
            </Text>
          </View>

          <View style={[
            styles.infoContainer,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            }
          ]}>
            <View style={styles.infoItem}>
              <View style={[
                styles.infoIconContainer,
                {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.15)' : 'rgba(255, 172, 28, 0.1)',
                }
              ]}>
                <MaterialIcons name="star" size={18} color="#FFAC1C" />
              </View>
              <Text style={[styles.infoText, { color: themeColors.text }]}>
                Condition: <Text style={styles.infoValue}>{listing.condition}</Text>
              </Text>
            </View>
            <View style={styles.infoItem}>
              <View style={[
                styles.infoIconContainer,
                {
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.15)' : 'rgba(255, 172, 28, 0.1)',
                }
              ]}>
                <MaterialIcons name="access-time" size={18} color="#FFAC1C" />
              </View>
              <Text style={[styles.infoText, { color: themeColors.text }]}>
                Listed on: <Text style={styles.infoValue}>{formatDate(listing.createdAt)}</Text>
              </Text>
            </View>
          </View>

          <View style={[
            styles.descriptionContainer,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            }
          ]}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: themeColors.text }]}>
              {listing.description}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.contactButton}
            activeOpacity={0.8}
          >
            <MaterialIcons name="local-shipping" size={22} color="#FFF" />
            <Text style={styles.contactButtonText}>View Shippers</Text>
          </TouchableOpacity>

          {similarListings.length > 0 && (
            <View style={styles.similarItemsContainer}>
              <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
                Similar Items
              </Text>
              <FlatList
                data={similarListings}
                renderItem={renderSimilarItem}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.similarItemsList}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SingleListing

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
    gap: verticalScale(16),
  },
  errorText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FFAC1C',
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(8),
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  imageContainer: {
    width: '100%',
    height: verticalScale(300),
    marginBottom: verticalScale(20),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  titleContainer: {
    marginBottom: verticalScale(20),
  },
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(32),
    fontWeight: '700',
    marginBottom: verticalScale(12),
  },
  price: {
    fontSize: moderateScale(28),
    lineHeight: moderateScale(36),
    fontWeight: '700',
  },
  infoContainer: {
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(24),
    borderWidth: 1,
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  infoIconContainer: {
    width: horizontalScale(36),
    height: verticalScale(36),
    borderRadius: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12),
  },
  infoText: {
    flex: 1,
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
  },
  infoValue: {
    fontWeight: '600',
  },
  descriptionContainer: {
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(24),
    borderWidth: 1,
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
  sectionTitle: {
    fontSize: moderateScale(20),
    lineHeight: moderateScale(28),
    fontWeight: '700',
    marginBottom: verticalScale(12),
  },
  description: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    opacity: 0.9,
  },
  contactButton: {
    backgroundColor: '#FFAC1C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: horizontalScale(20),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(32),
    gap: horizontalScale(8),
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
  contactButtonText: {
    color: '#FFF',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  similarItemsContainer: {
    marginTop: verticalScale(8),
  },
  similarItemsList: {
    paddingRight: horizontalScale(20),
    paddingTop: verticalScale(8),
  },
  similarItemContainer: {
    marginRight: horizontalScale(12),
  },
  similarItemCard: {
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    width: horizontalScale(180),
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
  similarItemImage: {
    width: '100%',
    height: verticalScale(120),
    resizeMode: 'cover',
  },
  similarItemImagePlaceholder: {
    width: '100%',
    height: verticalScale(120),
    justifyContent: 'center',
    alignItems: 'center',
  },
  similarItemContent: {
    padding: moderateScale(12),
  },
  similarItemTitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontWeight: '600',
    marginBottom: verticalScale(6),
    minHeight: verticalScale(40),
  },
  similarItemPrice: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '700',
  },
})