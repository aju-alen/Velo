import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ipURL } from '@/constants/backendUrl';
import { router } from 'expo-router';
import axiosInstance from '@/constants/axiosHeader';
import { useColorScheme } from '@/hooks/useColorScheme';
import useLoginAccountStore from '@/store/loginAccountStore';

const cardData = [
  {
    title: 'Open Market',
    status: 'pending',
  },
  {
    title: 'Assigned Shipment',
    status: 'accepted'
  },
  {
    title: 'Completed Shipment',
    status: 'completed'
  }
];

const AdminOrderDetailMain = () => {
  const colorScheme = useColorScheme();
  const {accountLoginData} = useLoginAccountStore();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [orderStatus, setOrderStatus] = useState('pending');

  const getAdminPendingOrders = async () => {
    try {
      console.log('------__________-----------',pendingOrders);
      console.log(accountLoginData,'accountLoginData');
      
      
      setRefreshing(true);
      if(orderStatus === 'pending') {
        const response = await axiosInstance.get(`/api/shipment/agent/get-all-open-market-shipments`);
        setPendingOrders(response.data);
      }
      if(orderStatus === 'accepted') {
        const response = await axiosInstance.get(`/api/shipment/agent/get-all-accepted-shipments/${accountLoginData.id}`);
        setPendingOrders(response.data);
      }
      
      setRefreshing(false);
    } catch (err) {
      console.error(err);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAdminPendingOrders();
  }, [orderStatus]);

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/(tabs)/adminorderdetail/${item.id}`)}
    >
      <ThemedView style={styles.cardHeader}>
        <ThemedText style={styles.shipmentId}>
          Shipment #{item.shipmentId}
        </ThemedText>
        <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <ThemedText style={styles.statusText}>
            {item.shipmentStatus}
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.cardContent}>
        <ThemedView style={styles.senderContainer}>
          <ThemedView style={styles.senderIcon}>
            <Ionicons name="person-outline" size={24} color="#4A4A4A" />
          </ThemedView>
          <ThemedView style={styles.senderDetails}>
            <ThemedText style={styles.senderTitle}>Sender</ThemedText>
            <ThemedText style={styles.senderText}>
              {item.senderName}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.locationContainer}>
          <ThemedView style={styles.locationIcon}>
            <Ionicons name="location-outline" size={24} color="#4A4A4A" />
          </ThemedView>
          <ThemedView style={styles.locationDetails}>
            <ThemedText style={styles.locationTitle}>Shipping Route</ThemedText>
            <ThemedText style={styles.locationText}>
              {item.senderCity}, {item.senderState} → {item.receiverCity}, {item.receiverState}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.locationContainer}>
          <ThemedView style={styles.locationIcon}>
            <Ionicons name="cash" size={24} color="#4A4A4A" />
          </ThemedView>
          <ThemedView style={styles.locationDetails}>
            <ThemedText style={styles.locationTitle}> {item.shippingMarket === "OPEN_MARKET" ? "SUGGESTED AMOUNT" : "PAID AMOUNT"}</ThemedText>
            <ThemedText style={styles.locationText}>
              {item.shippingMarket === "OPEN_MARKET" ? item.openMarketPrice : item.paymentAmount}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#FF6B6B';
      case 'processing': return '#4ECDC4';
      case 'shipped': return '#45B7D1';
      default: return '#A0A0A0';
    }
  };

  return (
    <ThemedView style={styles.container}>
     {accountLoginData.registerVerificationStatus === "LOGGED_IN"? <ThemedView >
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.pageTitle}>Pending Shipments</ThemedText>
      </ThemedView>

      <ThemedView >
        <FlatList
          data={cardData}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setOrderStatus(item.status)}
              style={[styles.statusCardContainer, {
                backgroundColor: orderStatus === item.status ? '#4CAF50' : 'transparent', 
              }]} >
              <ThemedView >
                <ThemedText type='mini' style={{ backgroundColor: orderStatus === item.status ? '#4CAF50' :'transparent' }}>
                  {item.title}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        />
      </ThemedView>

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
              tintColor="#4A4A4A"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <ThemedView style={styles.emptyStateContainer}>
          <Ionicons name="cube-outline" size={64} color="#E0E0E0" />
          <ThemedText style={styles.emptyStateText}>
            No shipments in progress
          </ThemedText>
        </ThemedView>
      )}
      </ThemedView> :
      <ThemedView style={{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
        }}>
        <ThemedText>
          You are not verified
        </ThemedText>
        </ThemedView>
      }
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',

  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,

  },
  shipmentId: {
    fontSize: 16,
    fontWeight: '700',

  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardContent: {
    padding: 15,
    gap: 15,
  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  senderIcon: {

    padding: 10,
    borderRadius: 15,
  },
  senderDetails: {
    flex: 1,
  },
  senderTitle: {
    fontSize: 12,
    color: '#7B8794',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  senderText: {
    fontSize: 15,
    fontWeight: '600',

  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  locationIcon: {
    padding: 10,
    borderRadius: 15,
  },
  locationDetails: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 12,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  statusCardContainer: {

    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 15,
    marginRight: 15,

  },
});

export default AdminOrderDetailMain;