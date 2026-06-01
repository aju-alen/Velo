import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl, View, Text, useColorScheme, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ipURL } from '@/constants/backendUrl';
import { router } from 'expo-router';
import axiosInstance from '@/constants/axiosHeader';
import useLoginAccountStore from '@/store/loginAccountStore';
import { Colors } from '@/constants/Colors';
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics';

const cardData = [
  {
    title: 'Open Market',
    status: 'pending',
    icon: 'storefront-outline',
  },
  {
    title: 'Assigned Shipment',
    status: 'accepted',
    icon: 'checkmark-circle-outline',
  },
  {
    title: 'Completed Shipment',
    status: 'completed',
    icon: 'checkmark-done-circle-outline',
  }
];

const AdminOrderDetailMain = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const {accountLoginData} = useLoginAccountStore();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [orderStatus, setOrderStatus] = useState('accepted');

  const getAdminPendingOrders = async () => {
    try {
      setRefreshing(true);
      if(orderStatus === 'pending') {
        const response = await axiosInstance.get(`/api/shipment/agent/get-all-open-market-shipments`);
        setPendingOrders(response.data || []);
      } else if(orderStatus === 'accepted') {
        const response = await axiosInstance.get(`/api/shipment/agent/get-all-accepted-shipments/${accountLoginData.id}`);
        setPendingOrders(response.data || []);
      } else if(orderStatus === 'completed') {
        // Add completed shipments API call here when available
        // const response = await axiosInstance.get(`/api/shipment/agent/get-all-completed-shipments/${accountLoginData.id}`);
        // setPendingOrders(response.data || []);
        setPendingOrders([]);
      }
      
      setRefreshing(false);
    } catch (err) {
      console.error(err);
      setPendingOrders([]);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAdminPendingOrders();
  }, [orderStatus]);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        }
      ]}
      onPress={() => router.push(`/(tabs)/adminorderdetail/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={[styles.cardHeader, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
        <View style={styles.shipmentIdContainer}>
          <Ionicons name="cube-outline" size={18} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
          <Text style={[styles.shipmentId, { color: themeColors.text }]}>
            Shipment #{item.shipmentId}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.shipmentStatus || item.status) }]}>
          <Text style={styles.statusText}>
            {(item.shipmentStatus || item.status)?.replace(/_/g, ' ')}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.senderContainer}>
          <View style={[styles.senderIcon, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.15)' : 'rgba(255, 172, 28, 0.1)' }]}>
            <Ionicons name="person-outline" size={20} color="#FFAC1C" />
          </View>
          <View style={styles.senderDetails}>
            <Text style={[styles.senderTitle, { color: themeColors.text }]}>Sender</Text>
            <Text style={[styles.senderText, { color: themeColors.text }]}>
              {item.senderName || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <View style={[styles.locationIcon, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.15)' : 'rgba(255, 172, 28, 0.1)' }]}>
            <Ionicons name="location-outline" size={20} color="#FFAC1C" />
          </View>
          <View style={styles.locationDetails}>
            <Text style={[styles.locationTitle, { color: themeColors.text }]}>Shipping Route</Text>
            <Text style={[styles.locationText, { color: themeColors.text }]}>
              {item.senderCity || 'N/A'}, {item.senderState || 'N/A'} → {item.receiverCity || 'N/A'}, {item.receiverState || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <View style={[styles.locationIcon, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.15)' : 'rgba(255, 172, 28, 0.1)' }]}>
            <Ionicons name="cash-outline" size={20} color="#FFAC1C" />
          </View>
          <View style={styles.locationDetails}>
            <Text style={[styles.locationTitle, { color: themeColors.text }]}>
              {item.shippingMarket === "OPEN_MARKET" ? "SUGGESTED AMOUNT" : "PAID AMOUNT"}
            </Text>
            <Text style={[styles.locationText, { color: '#FFAC1C', fontWeight: '700' }]}>
              AED {item.shippingMarket === "OPEN_MARKET" ? (item.openMarketPrice || '0') : (item.paymentAmount || '0')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    if (!status) return '#A0A0A0';
    const statusLower = status.toLowerCase().replace(/_/g, '');
    switch (statusLower) {
      case 'paymentpending': return '#FF9800';
      case 'orderinmarket': return '#2196F3';
      case 'orderplaced': return '#9C27B0';
      case 'orderconfirmed': return '#00BCD4';
      case 'shipmentpicked': return '#4CAF50';
      case 'shipmentdropped': return '#8BC34A';
      case 'intransitstart': return '#00ACC1';
      case 'intransitend': return '#0097A7';
      case 'outfordelivery': return '#FFC107';
      case 'delivered': return '#4CAF50';
      case 'pending': return '#FF6B6B';
      case 'processing': return '#4ECDC4';
      case 'shipped': return '#45B7D1';
      default: return '#A0A0A0';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {accountLoginData.registerVerificationStatus === "LOGGED_IN" ? (
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={[styles.pageTitle, { color: themeColors.text }]}>Shipment Orders</Text>
          </View>

          <View style={styles.filterContainer}>
            <FlatList
              data={cardData}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => {
                const isActive = orderStatus === item.status;
                return (
                  <TouchableOpacity
                    onPress={() => setOrderStatus(item.status)}
                    style={[
                      styles.statusCardContainer,
                      {
                        backgroundColor: isActive
                          ? '#FFAC1C'
                          : colorScheme === 'dark'
                          ? 'rgba(255, 255, 255, 0.05)'
                          : 'rgba(0, 0, 0, 0.02)',
                        borderWidth: isActive ? 0 : 1,
                        borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      }
                    ]}
                    activeOpacity={0.7}
                  >
                    <Ionicons 
                      name={item.icon as any} 
                      size={18} 
                      color={isActive ? 'white' : (colorScheme === 'dark' ? '#FFAC1C' : '#666')} 
                      style={{ marginRight: horizontalScale(6) }}
                    />
                    <Text
                      style={[
                        styles.miniText,
                        {
                          color: isActive ? 'white' : themeColors.text,
                          fontWeight: isActive ? '600' : '500',
                        }
                      ]}
                    >
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterListContent}
            />
          </View>

          {pendingOrders.length > 0 ? (
            <FlatList
              data={pendingOrders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderCard}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={getAdminPendingOrders}
                  tintColor={colorScheme === 'dark' ? '#FFAC1C' : '#666'}
                />
              }
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons
                name="cube-outline"
                size={64}
                color={colorScheme === 'dark' ? '#666' : '#E0E0E0'}
              />
              <Text style={[styles.emptyStateText, { color: themeColors.text }]}>
                No shipments found
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: themeColors.text }]}>
                {orderStatus === 'pending'
                  ? 'No open market shipments available'
                  : orderStatus === 'accepted'
                  ? 'No accepted shipments yet'
                  : 'No completed shipments'}
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.notVerifiedContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={64}
            color={colorScheme === 'dark' ? '#666' : '#999'}
          />
          <Text style={[styles.notVerifiedText, { color: themeColors.text }]}>
            You are not verified
          </Text>
          <Text style={[styles.notVerifiedSubtext, { color: themeColors.text }]}>
            Please complete your verification to access this section
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
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
  pageTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
  },
  filterContainer: {
    paddingVertical: verticalScale(16),
  },
  filterListContent: {
    paddingHorizontal: horizontalScale(20),
  },
  statusCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(20),
    marginRight: horizontalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
      },
    }),
  },
  miniText: {
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(80),
  },
  card: {
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    overflow: 'hidden',
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
  shipmentIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: horizontalScale(8),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
  },
  shipmentId: {
    fontSize: moderateScale(18),
    fontWeight: '700',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(16),
  },
  statusText: {
    color: 'white',
    fontSize: moderateScale(11),
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardContent: {
    padding: horizontalScale(16),
  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(14),
  },
  senderIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12),
  },
  senderDetails: {
    flex: 1,
  },
  senderTitle: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginBottom: verticalScale(4),
    textTransform: 'uppercase',
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  senderText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    lineHeight: moderateScale(20),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(14),
  },
  locationIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12),
  },
  locationDetails: {
    flex: 1,
  },
  locationTitle: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginBottom: verticalScale(4),
    textTransform: 'uppercase',
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  locationText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    lineHeight: moderateScale(20),
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(80),
    paddingHorizontal: horizontalScale(40),
  },
  emptyStateText: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: moderateScale(14),
    opacity: 0.7,
    textAlign: 'center',
  },
  notVerifiedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(40),
  },
  notVerifiedText: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  notVerifiedSubtext: {
    fontSize: moderateScale(14),
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
});

export default AdminOrderDetailMain;