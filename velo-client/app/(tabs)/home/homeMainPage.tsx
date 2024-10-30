import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import CustomButton from '@/components/CustomButton';
import * as SecureStore from 'expo-secure-store';
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

const HomeMainPage = () => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const getCategoryData = async () => {
      const getCategory = await axios.get(`${ipURL}/api/category/get-all-categories`);
      setCategoryData(getCategory.data);
    };
    getCategoryData();
  }, []);

  const handleDelete = async () => {
    await SecureStore.deleteItemAsync('registerDetail');
  };

  const renderMarketplaceCategoryCard = ({ item }) => {

    const catId = item.id
    return (
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push({ pathname:'/(tabs)/market/marketHome',params:{catId}})}>
        <ThemedView style={styles.marketplaceCardContainer}>
          <ThemedView style={styles.iconContainer}>
            <MaterialIcons name={item.categoryImgUrl} size={28} color="#FFAC1C" />
          </ThemedView>
          <ThemedText style={styles.categoryText} type='catText'>
            {item.name}
          </ThemedText>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedText type='subtitle' style={styles.marketplaceTitle}>Marketplace</ThemedText>
      <TouchableOpacity>
        <ThemedText style={styles.viewAllText}>View All</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.topBar}>
        <ThemedText type='logoText'>Home</ThemedText>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <MaterialIcons name="delete-outline" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.marketplaceContainer}>
        <FlatList
          ListHeaderComponent={ListHeader}
          style={styles.marketplaceFlatlistContainer}
          data={categoryData}
          renderItem={renderMarketplaceCategoryCard}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default HomeMainPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(60),
    paddingHorizontal: horizontalScale(20),
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  deleteButton: {
    padding: 8,
  },
  marketplaceContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  marketplaceTitle: {

  },
  viewAllText: {
    color: '#FFAC1C',
  },
  marketplaceCardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: verticalScale(16),
    margin: moderateScale(6),
    borderRadius: moderateScale(16),
    shadowColor: 'rgba(0, 0, 0, 0.12)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    
    elevation: 8,
    borderWidth: moderateScale(1),
    minHeight: verticalScale(100),
  },
  iconContainer: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  categoryText: {
    textAlign: 'center',
    marginTop: verticalScale(4),
  },
  marketplaceFlatlistContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: verticalScale(20),
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});