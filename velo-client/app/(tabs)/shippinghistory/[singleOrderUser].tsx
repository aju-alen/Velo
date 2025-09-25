import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, View, Text, useColorScheme } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ipURL } from '@/constants/backendUrl'
import axiosInstance from '@/constants/axiosHeader'
import useShipmentStore from '@/store/shipmentStore'
import { Colors } from '@/constants/Colors'

const SingleOrderUser = () => {
    const {finalShipmentData, setFinalShipmentData} = useShipmentStore();
    const router = useRouter();
    const { singleOrderUser } = useLocalSearchParams();
    const [orderData, setOrderData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const getAdminSingleOrderData = async () => {
        try {
            const response = await axiosInstance.get(`${ipURL}/api/shipment/user/get-single-shipment/${singleOrderUser}`);
            setOrderData(response.data);
            setFinalShipmentData({
                totalPrice: response.data.customPrice? response.data.openMarketPrice : null,
                organisationId:response.data.assignedOrganisationId,
                basePrice:0,
                collectionPrice:0,
                shippingMarket:response.data.shippingMarket
            })

        } catch (err) {
            console.log(err);
        }
    }
    console.log(orderData, 'orderData-- in single order USERRRRR');
    
    useEffect(() => {
        getAdminSingleOrderData();
    }, [])

    const handleProceedToPayment = async (shippingId) => {
        try {
            setLoading(true);
            router.push({pathname:'/(tabs)/home/createShipment/payment',params:{shipmentId:shippingId}});
            setLoading(false);
            
        }
        catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const renderDetailRow = (icon: keyof typeof Ionicons.glyphMap, title: string, value: string) => (
        <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
                <Ionicons name={icon} size={20} color="#4A4A4A" />
            </View>
            <View style={styles.detailContent}>
                <Text style={[styles.detailTitle, { color: themeColors.text }]}>{title}</Text>
                <Text style={[styles.detailValue, { color: themeColors.text }]}>{value}</Text>

            </View>
        </View>
    );

    const renderServiceTag = (label: string, active: boolean) => (
        <View
            style={[
                styles.serviceTag,
                { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
            ]}
        >
            <Text
                style={[
                    styles.serviceTagText,
                    { color: active ? '#2196F3' : '#9E9E9E' }
                ]}
            >
                {label}
            </Text>
        </View>
    );

    if (!orderData) {
        return (
            <View style={[styles.container, { backgroundColor: themeColors.background }]}>
                <Text style={{ color: themeColors.text }}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.headerContainer}>
              
                <Text style={[styles.pageTitle, { color: themeColors.text }]}>Shipment Details</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.shipmentIdContainer}>
                    <Text style={[styles.shipmentId, { color: themeColors.text }]}>
                        Shipment #{orderData.shipmentId}
                    </Text>
                    <Text style={styles.shipmentStatus}>
                        {orderData.shipmentStatus.replace('_', ' ')}
                    </Text>
                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? '#181A20' : '#FFF' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, borderBottomColor: colorScheme === 'dark' ? '#333' : '#E0E0E0' }]}>Sender Information</Text>
                    {renderDetailRow('person-outline', 'Name', orderData.senderName)}
                    {renderDetailRow('location-outline', 'Address',
                        `${orderData.senderAddressOne}, ${orderData.senderAddressTwo}, 
            ${orderData.senderCity}, ${orderData.senderState}`
                    )}
                    {renderDetailRow('call-outline', 'Contact', orderData.senderMobileNumber)}

                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? '#181A20' : '#FFF' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, borderBottomColor: colorScheme === 'dark' ? '#333' : '#E0E0E0' }]}>Receiver Information</Text>
                    {renderDetailRow('person-outline', 'Name', orderData.receiverName)}
                    {renderDetailRow('location-outline', 'Address',
                        `${orderData.receiverAddressOne}, ${orderData.receiverAddressTwo}, 
            ${orderData.receiverCity}, ${orderData.receiverState}`
                    )}
                    {renderDetailRow('call-outline', 'Contact', orderData.receiverMobileNumber)}
                    {renderDetailRow('mail-outline', 'Email', orderData.receiverEmail)}
                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? '#181A20' : '#FFF' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, borderBottomColor: colorScheme === 'dark' ? '#333' : '#E0E0E0' }]}>Shipment Details</Text>
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
                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? '#181A20' : '#FFF' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, borderBottomColor: colorScheme === 'dark' ? '#333' : '#E0E0E0' }]}>Additional Services</Text>
                    <View style={styles.servicesContainer}>
                        {renderServiceTag('Adult Signature', orderData.adultSignatureService)}
                        {renderServiceTag('Direct Signature', orderData.directSignatureService)}
                        {renderServiceTag('Verbal Notification', orderData.verbalNotificationService)}
                    </View>
                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? '#181A20' : '#FFF' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, borderBottomColor: colorScheme === 'dark' ? '#333' : '#E0E0E0' }]}>Payment Details</Text>
                    {renderDetailRow('card-outline', 'Amount', `${orderData.shipmentStatus === 'PAYMENT_PENDING' ? orderData.openMarketPrice : orderData.paymentAmount} `)}
                    {renderDetailRow('checkmark-circle-outline', 'Payment Status',
                        orderData.paymentSuccess ? 'Successful' : 'Pending'
                    )}
                </View>

                {orderData.shipmentStatus === 'PAYMENT_PENDING' &&
                    <TouchableOpacity style={styles.acceptOrderButton}
                        onPress={()=>handleProceedToPayment(orderData.id)}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) :
                            <Text style={styles.buttonText}>Proceed to Payment</Text>}
                    </TouchableOpacity>
                }
            </ScrollView>
        </View>
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
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SingleOrderUser;