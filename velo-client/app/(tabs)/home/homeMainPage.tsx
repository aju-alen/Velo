import { StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions,ActivityIndicator } from 'react-native';
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
import { LinearGradient } from 'expo-linear-gradient';
import useLoginAccountStore from '@/store/loginAccountStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - horizontalScale(40) - horizontalScale(32)) / 3;

const HomeMainPage = () => {
  const {accountLoginData,resetAccountLoginData} = useLoginAccountStore();
  console.log(accountLoginData,'accountLoginData----11----');
  
  const [categoryData, setCategoryData] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const getCategoryData = async () => {
      const getAccountDetails = await SecureStore.getItemAsync('registerDetail');
      setAccountName(JSON.parse(getAccountDetails).name);

      const getCategory = await axios.get(`${ipURL}/api/category/get-all-categories`);
      setCategoryData(getCategory.data);
      setLoading(false);
    };
    getCategoryData();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('registerDetail');
    resetAccountLoginData();
    router.replace('/(auth)/login');
    
  };

  const renderMarketplaceCategoryCard = ({ item, index }) => {
    const catId = item.id;
    
    // Generate different gradient colors based on index
    const gradientColors = getGradientColors(9);
    
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => router.push({ pathname:'/(tabs)/market/marketHome', params:{catId}})}
      >
        <ThemedView style={styles.marketplaceCardContainer}>
          <LinearGradient
            colors={gradientColors}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <ThemedView style={styles.iconContainer}>
              <MaterialIcons name={item.categoryImgUrl} size={28} color="#FFAC1C" />
            </ThemedView>
            <ThemedText style={styles.categoryText} type='catText'>
              {item.name}
            </ThemedText>
          </LinearGradient>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  const getGradientColors = (index) => {
    // Array of gradient color pairs
    const gradients = [
      ['#1a237e10', '#1a237e20'],
      ['#00695c10', '#00695c20'],
      ['#4a148c10', '#4a148c20'],
      ['#bf360c10', '#bf360c20'],
      ['#1b5e2010', '#1b5e2020'],
      ['#4a148c10', '#4a148c20'],
    ];
    return gradients[index % gradients.length];
  };

  const ListHeader = () => (
    <ThemedView style={styles.header}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type='subtitle' style={styles.marketplaceTitle}>Marketplace</ThemedText>
        <ThemedText style={styles.subTitle}>Explore categories</ThemedText>
      </ThemedView>
      <TouchableOpacity style={styles.viewAllButton} onPress={()=>router.push({pathname:'/(tabs)/market/marketHome',params:{catId:'undefined'}})}>
        <ThemedText style={styles.viewAllText}>View All</ThemedText>
        <MaterialIcons name="arrow-forward-ios" size={16} color="#FFAC1C" />
      </TouchableOpacity>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>

      {loading?
        <ThemedView style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large" color="gray" />
        </ThemedView>
      :
      <>
      <ThemedView style={styles.topBar}>
        <ThemedView>
          <ThemedText type='logoText'>Home</ThemedText>
          <ThemedText style={styles.welcomeText}>Welcome {accountName}</ThemedText>
        </ThemedView>
        <TouchableOpacity onPress={handleLogout} style={styles.deleteButton}>
          <MaterialIcons name="logout" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </ThemedView>

      {/* Create Shipment Section */}
      <TouchableOpacity onPress={()=>router.push('/(tabs)/home/createShipment/createShipmentHome')} activeOpacity={0.7}>

       {accountLoginData.role === "USER" && <ThemedView style={styles.createShipmentContainer}>

          <LinearGradient
            colors={getGradientColors(9)}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="local-shipping" size={60} color="#FFAC1C" />
            <ThemedText style={styles.marketplaceTitle}>Create a Shipment</ThemedText>
            <ThemedText style={styles.subTitle}>Ship your items with ease</ThemedText>
            </LinearGradient>
        </ThemedView>}
      </TouchableOpacity>

      
      {/* Marketplace Section */}
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
      </>}

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
  welcomeText: {
    fontSize: moderateScale(14),
    color: '#999',
    marginTop: verticalScale(4),
  },
  deleteButton: {
    padding: moderateScale(8),
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: moderateScale(12),
  },
  marketplaceContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  titleContainer: {
    flex: 1,
  },
  createShipmentContainer: {
    marginBottom: verticalScale(24),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
  },
  marketplaceTitle: {
    fontSize: moderateScale(24),
    fontWeight: '600',
  },
  subTitle: {
    fontSize: moderateScale(14),
    color: '#999',
    marginTop: verticalScale(4),
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
  },
  viewAllText: {
    color: '#FFAC1C',
    marginRight: horizontalScale(4),
    fontSize: moderateScale(14),
  },
  marketplaceCardContainer: {
    width: CARD_WIDTH,
    margin: moderateScale(5),
    borderRadius: moderateScale(16),
    overflow: 'hidden',
  },
  cardGradient: {
    padding: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(120),
  },
  iconContainer: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 172, 28, 0.2)',
  },
  categoryText: {
    textAlign: 'center',
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  marketplaceFlatlistContainer: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: verticalScale(20),
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
});