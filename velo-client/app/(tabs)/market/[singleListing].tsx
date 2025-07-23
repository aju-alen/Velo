import { StyleSheet, ScrollView, TouchableOpacity, FlatList, Image,ActivityIndicator} from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useLocalSearchParams, router } from 'expo-router'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'

const SingleListing = () => {
  const [listing, setListing] = useState(null)
  const [similarListings, setSimilarListings] = useState([])
  const [loading, setLoading] = useState(true)
  const { singleListing } = useLocalSearchParams()

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
    return `$${price.toLocaleString()}`
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
      <ThemedView style={styles.similarItemCard}>
        <MaterialIcons name="directions-car" size={40} color="#FFAC1C" />
        <ThemedView style={styles.similarItemContent}>
          <ThemedText type="defaultSemiBold" style={styles.similarItemTitle} numberOfLines={1}>
            {item.title}
          </ThemedText>
          <ThemedText type="defaultSemiBold" style={styles.similarItemPrice}>
            {formatPrice(item.price)}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  )

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFAC1C" />
      </ThemedView>
    )
  }

  if (!listing) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText>Unable to load listing details</ThemedText>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <ThemedText type="logoText">Details</ThemedText>
        <TouchableOpacity>
          <MaterialIcons name="share" size={24} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.imageContainer}>
          <Image source={{uri:listing.imageUrl}} style={styles.image} />
        </ThemedView>

        <ThemedView style={styles.contentContainer}>
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.title}>
              {listing.title}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.price}>
              {formatPrice(listing.price)}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.infoContainer}>
            <ThemedView style={styles.infoItem}>
              <MaterialIcons name="star" size={20} color="#FFAC1C" />
              <ThemedText style={styles.infoText}>Condition: {listing.condition}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <MaterialIcons name="access-time" size={20} color="#FFAC1C" />
              <ThemedText style={styles.infoText}>Listed on: {formatDate(listing.createdAt)}</ThemedText>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.descriptionContainer}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Description
            </ThemedText>
            <ThemedText style={styles.description}>
              {listing.description}
            </ThemedText>
          </ThemedView>

          <TouchableOpacity style={styles.contactButton}>
            <MaterialIcons name="bookmark" size={24} color="#FFF" />
            <ThemedText style={styles.contactButtonText}>View Shippers</ThemedText>
          </TouchableOpacity>

          <ThemedView style={styles.similarItemsContainer}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Similar Items
            </ThemedText>
            <FlatList
              data={similarListings}
              renderItem={renderSimilarItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.similarItemsList}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(20),
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
    marginBottom: verticalScale(8),
  },
  price: {
    fontSize: moderateScale(24),
    color: '#FFAC1C',
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
    color: '#666',
  },
  descriptionContainer: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    marginBottom: verticalScale(8),
  },
  description: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: '#666',
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
    textAlign: 'center',
  },
  similarItemPrice: {
    fontSize: moderateScale(16),
    color: '#FFAC1C',
    marginTop: verticalScale(4),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
})