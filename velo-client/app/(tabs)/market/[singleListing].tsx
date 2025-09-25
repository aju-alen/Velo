import { StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, ActivityIndicator, View, Text, useColorScheme } from 'react-native'
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
    >
      <View style={[styles.similarItemCard, { backgroundColor: themeColors.background }]}>
        <MaterialIcons name="directions-car" size={40} color="#FFAC1C" />
        <View style={styles.similarItemContent}>
          <Text style={[styles.similarItemTitle, { color: themeColors.text }]} numberOfLines={1}>
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
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color="#FFAC1C" />
      </View>
    )
  }

  if (!listing) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.errorText, { color: themeColors.text }]}>Unable to load listing details</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text style={[styles.logoText, { color: '#FFAC1C' }]}>Details</Text>
        <TouchableOpacity>
          <MaterialIcons name="share" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{uri:listing.imageUrl}} style={styles.image} />
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

          <View style={[styles.infoContainer, { backgroundColor: themeColors.background }]}>
            <View style={styles.infoItem}>
              <MaterialIcons name="star" size={20} color="#FFAC1C" />
              <Text style={[styles.infoText, { color: themeColors.text }]}>Condition: {listing.condition}</Text>
            </View>
            <View style={styles.infoItem}>
              <MaterialIcons name="access-time" size={20} color="#FFAC1C" />
              <Text style={[styles.infoText, { color: themeColors.text }]}>Listed on: {formatDate(listing.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: themeColors.text }]}>
              {listing.description}
            </Text>
          </View>

          <TouchableOpacity style={styles.contactButton}>
            <MaterialIcons name="bookmark" size={24} color="#FFF" />
            <Text style={styles.contactButtonText}>View Shippers</Text>
          </TouchableOpacity>

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
        </View>
      </ScrollView>
    </View>
  )
}

export default SingleListing

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
  },
  logoText: {
    fontSize: moderateScale(40),
    lineHeight: moderateScale(56),
    fontWeight: 'bold',
  },
  imageContainer: {
    height: verticalScale(200),
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  contentContainer: {
    paddingHorizontal: horizontalScale(20),
  },
  titleContainer: {
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(22),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  price: {
    fontSize: moderateScale(24),
    lineHeight: moderateScale(22),
    fontWeight: '600',
  },
  infoContainer: {
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: verticalScale(24),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  infoText: {
    marginLeft: horizontalScale(8),
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
  },
  descriptionContainer: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(22),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  description: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
  },
  contactButton: {
    backgroundColor: '#FFAC1C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(32),
  },
  contactButtonText: {
    color: '#FFF',
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginLeft: horizontalScale(8),
  },
  similarItemsContainer: {
    marginTop: verticalScale(32),
  },
  similarItemsList: {
    paddingRight: horizontalScale(20),
  },
  similarItemContainer: {
    marginRight: horizontalScale(12),
  },
  similarItemCard: {
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    width: horizontalScale(150),
    alignItems: 'center',
  },
  similarItemContent: {
    marginTop: verticalScale(8),
  },
  similarItemTitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
    fontWeight: '600',
    textAlign: 'center',
  },
  similarItemPrice: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(22),
    fontWeight: '600',
    marginTop: verticalScale(4),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})