import React, { useEffect, useState, useCallback } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  View, 
  TouchableOpacity, 
  Dimensions, 
  RefreshControl,
  Text,
  useColorScheme,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import useLoginAccountStore from '@/store/loginAccountStore';
import axiosInstance from '@/constants/axiosHeader';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const OrderHistoryMainPage = () => {
  const { accountLoginData } = useLoginAccountStore();
  const [orderHistory, setOrderHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // State for refresh control
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const getStatusColor = (status) => {
    switch (status) {

      case 'PAYMENT_PENDING': return '#DB4626';
      case 'ORDER_PLACED': return '#FF9800';
      case 'In Transit': return '#FF9800';
      case 'DELIVERED': return '#4CAF50';
      case 'Pending': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getPaidOrderHistory = async () => {
    try {
      const getOrder = await axiosInstance.get(`${ipURL}/api/shipment/get-all-paid-shipments/${accountLoginData.id}`);
      setOrderHistory(getOrder.data);
    } catch (err) {
      console.log(err);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true); 
    await getPaidOrderHistory();
    setRefreshing(false); 
  }, []);

  useEffect(() => {
    getPaidOrderHistory();
  }, []);

  const renderOrderCard = (order) => (
    <TouchableOpacity 
      key={order.id} 
      style={[styles.card, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
      activeOpacity={0.7}
      onPress={() => router.push( `/shippinghistory/${order.id}` )}
    >
      {/* Card Header */}
      <View style={[styles.cardHeader, { backgroundColor: 'transparent' }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <Text style={[styles.receiverName, { color: themeColors.text }]} numberOfLines={1}>
              {order.receiverName}
            </Text>
            <View 
              style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(order.shipmentStatus) }
              ]}
            >
              <Text style={styles.statusText}>
              {order.shipmentStatus.replace(/_/g, ' ')}
              </Text>
            </View>
          </View>
          <Text style={[styles.trackingNumber, { color: themeColors.text }]}>
              ABC-TKS772-927
          </Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={[styles.cardContent, { backgroundColor: 'transparent' }]}>
        <View style={styles.detailRow}>
          <View style={[styles.detailItem, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)' }]}>
            <Ionicons name="cube-outline" size={20} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
            <Text style={[styles.detailLabel, { color: themeColors.text }]}>Dimensions</Text>
            <Text style={[styles.detailValue, { color: themeColors.text }]}>
              {`${order.packageLength || 0} × ${order.packageWidth || 0} × ${order.packageHeight || 0} cm`}
            </Text>
          </View>

          <View style={[styles.detailItem, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)' }]}>
            <Ionicons name="scale-outline" size={20} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
            <Text style={[styles.detailLabel, { color: themeColors.text }]}>Weight</Text>
            <Text style={[styles.detailValue, { color: themeColors.text }]}>
              {order.packageWeight} kg
            </Text>
          </View>
        </View>

        {/* Delivery Dates */}
        <View style={[styles.dateContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)' }]}>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
            <Text style={[styles.dateText, { color: themeColors.text }]}>
              Order Date: {order.shipmentDate}
            </Text>
          </View>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
            <Text style={[styles.dateText, { color: themeColors.text }]}>
              Est. Delivery: {order.deliveryDate}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.titleContainer, { backgroundColor: themeColors.background }]}>
        <Text style={[styles.pageTitle, { color: themeColors.text }]}>Order History</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={colorScheme === 'dark' ? '#FFAC1C' : '#666'} 
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {orderHistory.length > 0 ? (
          orderHistory.map(renderOrderCard)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={[styles.noOrdersText, { color: themeColors.text }]}>
              No order history found
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    marginBottom: verticalScale(20),
  },
  pageTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
  },
  scrollViewContent: {
    paddingHorizontal: horizontalScale(20),
    paddingBottom: verticalScale(80),
  },
  card: {
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(12),
    padding: horizontalScale(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingBottom: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: verticalScale(12),
  },
  headerContent: {
    gap: verticalScale(8),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiverName: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    flex: 1,
    marginRight: horizontalScale(10),
  },
  trackingNumber: {
    fontSize: moderateScale(12),
    opacity: 0.7,
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
    gap: verticalScale(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: horizontalScale(12),
  },
  detailItem: {
    flex: 1,
    borderRadius: moderateScale(12),
    padding: horizontalScale(12),
    alignItems: 'center',
    gap: verticalScale(6),
  },
  detailLabel: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  detailValue: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    textAlign: 'center',
  },
  dateContainer: {
    borderRadius: moderateScale(12),
    padding: horizontalScale(12),
    paddingVertical: verticalScale(12),
    marginTop: verticalScale(8),
    gap: verticalScale(8),
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
  },
  dateText: {
    fontSize: moderateScale(12),
    opacity: 0.8,
  },
  emptyContainer: {
    paddingVertical: verticalScale(60),
    alignItems: 'center',
    justifyContent: 'center',
  },
  noOrdersText: {
    textAlign: 'center',
    fontSize: moderateScale(16),
    fontWeight: '500',
    opacity: 0.7,
  },
});

export default OrderHistoryMainPage;