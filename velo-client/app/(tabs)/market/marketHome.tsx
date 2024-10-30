import { FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import { router, useLocalSearchParams } from 'expo-router'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

const MarketHome = () => {
  const [getCatIdListing, setGetCatIdListing] = useState([]);
  const { catId } = useLocalSearchParams();

  

  useEffect(() => {
    const getLisitingFromCatId = async () => {
      const getCatIdListing = await axios.get(`${ipURL}/api/listing/get-listing-by-category/${catId}`);
      setGetCatIdListing(getCatIdListing.data.listingData);
    }
    getLisitingFromCatId();
  }, [catId]);

  const formatPrice = (price) => {
    return `${price.toLocaleString()}`
  }

  const renderMarketplaceCategoryCard = ({ item }) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.85}
        style={styles.cardContainer}
        onPress={() => router.push("/(tabs)/market/123")}
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
              
              <TouchableOpacity style={styles.viewButton}>
                <ThemedText type="mini" style={styles.viewButtonText}>
                  View Details
                </ThemedText>
                <MaterialIcons name="arrow-forward-ios" size={12} color="#FFAC1C" />
              </TouchableOpacity>
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
        <TouchableOpacity>
          <MaterialIcons name="filter-list" size={24} color="#666" />
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={getCatIdListing}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
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
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFAC1C',
    marginRight: horizontalScale(4),
  },
  separator: {
    height: verticalScale(8),
  },
});