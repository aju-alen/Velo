import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, RefreshControl, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { router } from 'expo-router';
import axiosInstance from '@/constants/axiosHeader';

const AdminOrderDetailMain = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getAdminPendingOrders = async () => {
    try {
      setRefreshing(true);
      const response = await axiosInstance.get(`${ipURL}/api/shipment/agent/get-all-pending-shipments`);
      setPendingOrders(response.data);
      setRefreshing(false);
    } catch (err) {
      console.error(err);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAdminPendingOrders();
  }, []);

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
      <ThemedView style={styles.headerContainer}>
        <ThemedText style={styles.pageTitle}>Pending Shipments</ThemedText>
        <TouchableOpacity>
          <Ionicons name="filter" size={24} color="#4A4A4A" />
        </TouchableOpacity>
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
    fontSize: 26,
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
});

export default AdminOrderDetailMain;