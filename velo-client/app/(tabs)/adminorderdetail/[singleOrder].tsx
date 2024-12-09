import { StyleSheet, ScrollView, TouchableOpacity,ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { useLocalSearchParams, useRouter } from 'expo-router'
import axios from 'axios'
import { ipURL } from '@/constants/backendUrl'
import axiosInstance from '@/constants/axiosHeader'

const SingleOrder = () => {
    const router = useRouter();
    const { singleOrder } = useLocalSearchParams();
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const getAdminSingleOrderData = async () => {
        try {
            const response = await axiosInstance.get(`${ipURL}/api/shipment/agent/get-single-pending-shipments/${singleOrder}`);
            setOrderData(response.data);
            console.log(response.data,'single order data');

        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAdminSingleOrderData();
    }, [])

    const handleAcceptShipment = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.put(`${ipURL}/api/shipment/agent-update-shipment-status/${singleOrder}`, );
            console.log(response.data);
            setLoading(false);
            router.push('/(tabs)/adminorderdetail/adminOrderDetailMain');
        }
        catch (err) {

        }
    }

    const renderDetailRow = (icon: string, title: string, value: string) => (
        <ThemedView style={styles.detailRow}>
            <ThemedView style={styles.detailIcon}>
                <Ionicons name={icon} size={20} color="#4A4A4A" />
            </ThemedView>
            <ThemedView style={styles.detailContent}>
                <ThemedText style={styles.detailTitle}>{title}</ThemedText>
                <ThemedText style={styles.detailValue}>{value}</ThemedText>

            </ThemedView>
        </ThemedView>
    );

    const renderServiceTag = (label: string, active: boolean) => (
        <ThemedView
            style={[
                styles.serviceTag,

            ]}
        >
            <ThemedText
                style={[
                    styles.serviceTagText,
                    { color: active ? '#2196F3' : '#9E9E9E' }
                ]}
            >
                {label}
            </ThemedText>
        </ThemedView>
    );

    if (!orderData) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText>Loading...</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.headerContainer}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#2C3E50" />
                </TouchableOpacity>
                <ThemedText style={styles.pageTitle}>Shipment Details</ThemedText>
                <ThemedView style={styles.headerPlaceholder} />
            </ThemedView>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <ThemedView style={styles.shipmentIdContainer}>
                    <ThemedText style={styles.shipmentId}>
                        Shipment #{orderData.shipmentId}
                    </ThemedText>
                    <ThemedText style={styles.shipmentStatus}>
                        {orderData.shipmentStatus.replace('_', ' ')}
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Sender Information</ThemedText>
                    {renderDetailRow('person-outline', 'Name', orderData.senderName)}
                    {renderDetailRow('location-outline', 'Address',
                        `${orderData.senderAddressOne}, ${orderData.senderAddressTwo}, 
            ${orderData.senderCity}, ${orderData.senderState}`
                    )}
                    {renderDetailRow('call-outline', 'Contact', orderData.senderMobileNumber)}

                </ThemedView>

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Receiver Information</ThemedText>
                    {renderDetailRow('person-outline', 'Name', orderData.receiverName)}
                    {renderDetailRow('location-outline', 'Address',
                        `${orderData.receiverAddressOne}, ${orderData.receiverAddressTwo}, 
            ${orderData.receiverCity}, ${orderData.receiverState}`
                    )}
                    {renderDetailRow('call-outline', 'Contact', orderData.receiverMobileNumber)}
                    {renderDetailRow('mail-outline', 'Email', orderData.receiverEmail)}
                </ThemedView>

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Shipment Details</ThemedText>
                    {renderDetailRow('cube-outline', 'Package Description', orderData.packageDescription)}
                    {renderDetailRow('scale-outline', 'Package Weight', `${orderData.packageWeight} kg`)}
                    {renderDetailRow('layers-outline', 'Package Pieces', orderData.packagePieces)}
                    {renderDetailRow('calendar-outline', 'Shipment Date',
                        new Date(orderData.shipmentDate).toLocaleDateString()
                    )}
                    {renderDetailRow('calendar-outline', 'Delivery Date',
                        new Date(orderData.deliveryDate).toLocaleDateString()
                    )}
                    {renderDetailRow('location-outline', 'Pickup Time', `${orderData.pickupTimeFrom}-${orderData.pickupTimeTo}`)}
                </ThemedView>

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Additional Services</ThemedText>
                    <ThemedView style={styles.servicesContainer}>
                        {renderServiceTag('Adult Signature', orderData.adultSignatureService)}
                        {renderServiceTag('Direct Signature', orderData.directSignatureService)}
                        {renderServiceTag('Verbal Notification', orderData.verbalNotificationService)}
                    </ThemedView>
                </ThemedView>

                <ThemedView style={styles.sectionContainer}>
                    <ThemedText style={styles.sectionTitle}>Payment Details</ThemedText>
                    {renderDetailRow('card-outline', 'Amount', `${orderData.paymentAmount} ${orderData.paymentCurrency.toUpperCase()}`)}
                    {renderDetailRow('checkmark-circle-outline', 'Payment Status',
                        orderData.paymentSuccess ? 'Successful' : 'Failed'
                    )}
                </ThemedView>
              {orderData.shipmentStatus === 'ORDER_PLACED'?  <TouchableOpacity style={styles.acceptOrderButton} onPress={handleAcceptShipment}>
                    {loading?(
                        <ActivityIndicator size="small" color="#fff" />
                    ):
                    <ThemedText>Accept Shipment</ThemedText>}
                </TouchableOpacity> :
                <TouchableOpacity style={styles.acceptOrderButton} disabled>
                    <ThemedText>Update Shipping Status</ThemedText>
                </TouchableOpacity>
                }
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        padding: 10,
        marginLeft: -10,
    },
    headerPlaceholder: {
        width: 24,
    },
    pageTitle: {
        fontSize: 20,
        fontWeight: '700',

    },
    scrollContainer: {
        flex: 1,
    },
    shipmentIdContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,

    },
    shipmentId: {
        fontSize: 18,
        fontWeight: '700',

    },
    shipmentStatus: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4CAF50',
        textTransform: 'capitalize',
    },
    sectionContainer: {

        borderRadius: 15,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',

        marginBottom: 15,
        borderBottomWidth: 1,

        paddingBottom: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailIcon: {

        padding: 10,
        borderRadius: 15,
        marginRight: 15,
    },
    detailContent: {
        flex: 1,
    },
    detailTitle: {
        fontSize: 12,

        textTransform: 'uppercase',
        marginBottom: 5,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',

    },
    servicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    serviceTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    serviceTagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    acceptOrderButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        margin: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
});

export default SingleOrder;