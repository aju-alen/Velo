import { StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions, ActivityIndicator, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import * as SecureStore from 'expo-secure-store';
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import useLoginAccountStore from '@/store/loginAccountStore';
import useShipmentStore from '@/store/shipmentStore';
import axiosInstance, { setAuthorizationHeader } from '@/constants/axiosHeader';
import { signOut, getAuth } from '@react-native-firebase/auth';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - horizontalScale(40) - horizontalScale(32)) / 3;

const HomeMainPage = () => {
  const {setEditData} = useShipmentStore()
  const {accountLoginData,resetAccountLoginData} = useLoginAccountStore();
  console.log(accountLoginData,'accountLoginData----11----');
  
  const [categoryData, setCategoryData] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(true);
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  useEffect(() => {
    
    const getCategoryData = async () => {
      console.log('getCategoryData entered here');
      
      const getAccountDetails = await SecureStore.getItemAsync('registerDetail');
      console.log(getAccountDetails,'getAccountDetails----11----');
      
      setAccountName(JSON.parse(getAccountDetails).name);

      setAuthorizationHeader(accountLoginData.token);
      const getCategory = await axios.get(`${ipURL}/api/category/get-all-categories`);
      setCategoryData(getCategory.data);
      setLoading(false);
    };
    getCategoryData();
  }, []);

  const handleLogout = async () => {
    try{
      await SecureStore.deleteItemAsync('registerDetail');
      try {
        await signOut(getAuth());
      } catch (e) {
        
      }
      resetAccountLoginData();
      router.replace('/(auth)/login');
    }
    catch(err){
      console.log(err);
    }
    
  };

  const renderMarketplaceCategoryCard = ({ item, index }) => {
    const catId = item.id;
    
    // Generate different gradient colors based on index
    const gradientColors = getGradientColors(9) as [string, string];
    
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => router.push({ pathname:'/(tabs)/market/marketHome', params:{catId}})}
      >
        <View style={[styles.marketplaceCardContainer, { backgroundColor: themeColors.background }]}>
          <LinearGradient
            colors={gradientColors as [string, string]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name={item.categoryImgUrl} size={28} color="#FFAC1C" />
            </View>
            <Text style={[styles.categoryText, { color: themeColors.text }]} type ='catText' >
              {item.name}
            </Text>
          </LinearGradient>
        </View>
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
    <View style={[styles.header, { backgroundColor: themeColors.background }]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.marketplaceTitle, { color: themeColors.text }]}>Marketplace</Text>
        <Text style={[styles.subTitle, { color: themeColors.text }]}>Explore categories</Text>
      </View>
      <TouchableOpacity style={styles.viewAllButton} onPress={()=>router.push({pathname:'/(tabs)/market/marketHome',params:{catId:'undefined'}})}>
        <Text style={styles.viewAllText}>View All</Text>
        <MaterialIcons name="arrow-forward-ios" size={16} color="#FFAC1C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>

      {loading?
        <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color="gray" />
        </View>
      :
      <>
      <View style={[styles.topBar, { backgroundColor: themeColors.background }]}>
        <View>
          <Text style={[styles.logoText, { color: '#FFAC1C' }]}>Home</Text>
          <Text style={[styles.welcomeText, { color: themeColors.text }]}>Welcome {accountName}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.deleteButton}>
          <MaterialIcons name="logout" size={24} color="#FF6B6B" />
        </TouchableOpacity>
      </View>

      {/* Create Shipment Section */}
      <TouchableOpacity onPress={()=>{
        setEditData(false)
        router.push('/(tabs)/home/createShipment/createShipmentHome')}} activeOpacity={0.7}>

       {accountLoginData.role === "USER" && <View style={[styles.createShipmentContainer, { backgroundColor: themeColors.background }]}>

          <LinearGradient
            colors={getGradientColors(9) as [string, string]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="local-shipping" size={60} color="#FFAC1C" />
            <Text style={[styles.marketplaceTitle, { color: themeColors.text }]}>Create a Shipment</Text>
            <Text style={[styles.subTitle, { color: themeColors.text }]}>Ship your items with ease</Text>
            </LinearGradient>
        </View>}
      </TouchableOpacity>

        <TouchableOpacity onPress={()=>{
        setEditData(false)
        router.push('/(tabs)/home/createShipment/createShipmentHome')}} activeOpacity={0.7}>

       {accountLoginData.role === "USER" && <View style={[styles.createShipmentContainer, { backgroundColor: themeColors.background }]}>

          <LinearGradient
            colors={getGradientColors(9) as [string, string]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialIcons name="local-shipping" size={60} color="#FFAC1C" />
            <Text style={[styles.marketplaceTitle, { color: themeColors.text }]}>Create a Shipment</Text>
            <Text style={[styles.subTitle, { color: themeColors.text }]}>Ship your items with ease</Text>
            </LinearGradient>
        </View>}
      </TouchableOpacity>

      
      {/* Marketplace Section */}
      <View style={[styles.marketplaceContainer, { backgroundColor: themeColors.background }]}>
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
      </View>
      </>}

    </View>
  );
};

export default HomeMainPage;

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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  logoText: {
    fontSize: moderateScale(40),
    lineHeight: moderateScale(56),
    fontWeight: 'bold',
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
    lineHeight: moderateScale(16),
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