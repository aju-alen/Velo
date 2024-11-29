import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  View, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { horizontalScale, verticalScale } from '@/constants/metrics';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import useLoginAccountStore from '@/store/loginAccountStore';

const { width } = Dimensions.get('window');

const OrderHistoryMainPage = () => {
    const {accountLoginData} = useLoginAccountStore();
  const [orderHistory, setOrderHistory] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4CAF50';
      case 'In Transit': return '#FF9800';
      case 'Pending': return '#2196F3';
      default: return '#9E9E9E';
    }
  };

  const getPaidOrderHistory = async () => {
    try{
        const getOrder = await axios.get(`${ipURL}/api/shipment/get-all-paid-shipments/${accountLoginData.id}`);
        console.log(getOrder.data,'order datqa ______');
        setOrderHistory(getOrder.data);
        

    }
    catch(err){
        console.log(err)
    }
}
  useEffect(() => {
    getPaidOrderHistory();
  }, []);

  const renderOrderCard = (order) => (
    <TouchableOpacity 
      key={order.id} 
      style={styles.card}
      activeOpacity={0.7}
    >
      {/* Card Header */}
      <ThemedView style={styles.cardHeader}>
        <ThemedView style={styles.headerContent}>
          <ThemedView style={styles.headerTop}>
            <ThemedText style={styles.receiverName} numberOfLines={1}>
              {order.receiverName}
            </ThemedText>
            <ThemedView 
              style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(order.shipmentStatus) }
              ]}
            >
              <ThemedText style={styles.statusText}>
              In Transit
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedText style={styles.trackingNumber}>
              ABC-TKS772-927
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Card Content */}
      <ThemedView style={styles.cardContent}>
        <ThemedView style={styles.detailRow}>
          <ThemedView style={styles.detailItem}>
            <Ionicons name="cube-outline" size={20} color="#666" />
            <ThemedText style={styles.detailLabel}>Dimensions</ThemedText>
            <ThemedText style={styles.detailValue}>
              {`${order.packageLength === ''?0:order.packageLength} × ${order.packageWidth === ''?0:order.packageWidth} × ${order.packageHeight === ''?0:order.packageHeight} cm`}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailItem}>
            <Ionicons name="scale-outline" size={20} color="#666" />
            <ThemedText style={styles.detailLabel}>Weight</ThemedText>
            <ThemedText style={styles.detailValue}>
              {order.packageWeight} kg
            </ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Delivery Dates */}
        <ThemedView style={styles.dateContainer}>
          <ThemedView style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <ThemedText style={styles.dateText}>
              Order Date: {order.shipmentDate}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <ThemedText style={styles.dateText}>
              Est. Delivery: {order.deliveryDate}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.pageTitle}>Order History</ThemedText>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#666" />
        </TouchableOpacity>
      </ThemedView>
      
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {orderHistory.length > 0 ? (
          orderHistory.map(renderOrderCard)
        ) : (
          <ThemedText style={styles.noOrdersText}>
            No order history found
          </ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(60),
    paddingHorizontal: horizontalScale(20),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollViewContent: {
    paddingBottom: verticalScale(20),
  },
  card: {

    borderRadius: 16,
    marginBottom: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderWidth: 0.4,

    overflow: 'hidden',
  },
  cardHeader: {

    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(12),
  },
  headerContent: {
    gap: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiverName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  trackingNumber: {
    fontSize: 12,

  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardContent: {
    paddingHorizontal: horizontalScale(15),
    paddingVertical: verticalScale(15),
    gap: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  detailItem: {
    flex: 1,

    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: 12,

    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  dateContainer: {

    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 12,

  },
  noOrdersText: {
    textAlign: 'center',
    marginTop: verticalScale(50),

  },
});

export default OrderHistoryMainPage;