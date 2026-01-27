import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, View, Text, useColorScheme, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ipURL } from '@/constants/backendUrl'
import axiosInstance from '@/constants/axiosHeader'
import useShipmentStore from '@/store/shipmentStore'
import { Colors } from '@/constants/Colors'
import { horizontalScale, verticalScale, moderateScale } from '@/constants/metrics'

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
            <View style={[styles.detailIcon, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.1)' : 'rgba(255, 172, 28, 0.05)' }]}>
                <Ionicons name={icon} size={20} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
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
            <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFAC1C" />
                    <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
           

            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.shipmentIdContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
                    <Text style={[styles.shipmentId, { color: themeColors.text }]}>
                        Shipment #{orderData.shipmentId}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: orderData.shipmentStatus === 'DELIVERED' ? '#4CAF50' : orderData.shipmentStatus === 'PAYMENT_PENDING' ? '#DB4626' : '#FF9800' }]}>
                        <Text style={styles.statusText}>
                            {orderData.shipmentStatus.replace(/_/g, ' ')}
                        </Text>
                    </View>
                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(16) }]}>Sender Information</Text>
                    {renderDetailRow('person-outline', 'Name', orderData.senderName)}
                    {renderDetailRow('location-outline', 'Address',
                        `${orderData.senderAddressOne}, ${orderData.senderAddressTwo}, 
            ${orderData.senderCity}, ${orderData.senderState}`
                    )}
                    {renderDetailRow('call-outline', 'Contact', orderData.senderMobileNumber)}

                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(16) }]}>Receiver Information</Text>
                    {renderDetailRow('person-outline', 'Name', orderData.receiverName)}
                    {renderDetailRow('location-outline', 'Address',
                        `${orderData.receiverAddressOne}, ${orderData.receiverAddressTwo}, 
            ${orderData.receiverCity}, ${orderData.receiverState}`
                    )}
                    {renderDetailRow('call-outline', 'Contact', orderData.receiverMobileNumber)}
                    {renderDetailRow('mail-outline', 'Email', orderData.receiverEmail)}
                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(16) }]}>Shipment Details</Text>
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

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(16) }]}>Additional Services</Text>
                    <View style={styles.servicesContainer}>
                        {renderServiceTag('Adult Signature', orderData.adultSignatureService)}
                        {renderServiceTag('Direct Signature', orderData.directSignatureService)}
                        {renderServiceTag('Verbal Notification', orderData.verbalNotificationService)}
                    </View>
                </View>

                <View style={[styles.sectionContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
                    <Text style={[styles.sectionTitle, { color: themeColors.text, marginBottom: verticalScale(16) }]}>Payment Details</Text>
                    {renderDetailRow('card-outline', 'Amount', `${orderData.shipmentStatus === 'PAYMENT_PENDING' ? orderData.openMarketPrice : orderData.paymentAmount} `)}
                    {renderDetailRow('checkmark-circle-outline', 'Payment Status',
                        orderData.paymentSuccess ? 'Successful' : 'Pending'
                    )}
                </View>

                {orderData.shipmentStatus === 'PAYMENT_PENDING' &&
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.acceptOrderButton}
                            onPress={()=>handleProceedToPayment(orderData.id)}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Proceed to Payment</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: horizontalScale(20),
    },
    loadingText: {
        marginTop: verticalScale(12),
        fontSize: moderateScale(16),
        fontWeight: '500',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: horizontalScale(20),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(16),
    },
    backButton: {
        padding: 10,
        marginLeft: -10,
    },
    headerPlaceholder: {
        width: 24,
    },
    pageTitle: {
        fontSize: moderateScale(22),
        fontWeight: '700',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(80),
    },
    shipmentIdContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: horizontalScale(20),
        paddingVertical: verticalScale(16),
        marginHorizontal: horizontalScale(20),
        marginTop: verticalScale(12),
        marginBottom: verticalScale(12),
        borderRadius: moderateScale(12),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    sectionContainer: {
        borderRadius: moderateScale(12),
        marginHorizontal: horizontalScale(20),
        marginVertical: verticalScale(12),
        padding: horizontalScale(16),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: moderateScale(18),
        fontWeight: '700',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: verticalScale(16),
    },
    detailIcon: {
        padding: horizontalScale(10),
        borderRadius: moderateScale(12),
        marginRight: horizontalScale(12),
        width: moderateScale(40),
        height: moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailContent: {
        flex: 1,
    },
    detailTitle: {
        fontSize: moderateScale(11),
        fontWeight: '500',
        textTransform: 'uppercase',
        marginBottom: verticalScale(4),
        opacity: 0.7,
        letterSpacing: 0.5,
    },
    detailValue: {
        fontSize: moderateScale(15),
        fontWeight: '600',
        lineHeight: moderateScale(20),
    },
    servicesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: horizontalScale(10),
        marginTop: verticalScale(4),
    },
    serviceTag: {
        paddingHorizontal: horizontalScale(14),
        paddingVertical: verticalScale(8),
        borderRadius: moderateScale(20),
    },
    serviceTagText: {
        fontSize: moderateScale(12),
        fontWeight: '600',
    },
    buttonContainer: {
        paddingHorizontal: horizontalScale(20),
        paddingBottom: verticalScale(20),
        marginTop: verticalScale(12),
    },
    acceptOrderButton: {
        backgroundColor: '#FFAC1C',
        paddingVertical: verticalScale(14),
        paddingHorizontal: horizontalScale(20),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});

export default SingleOrderUser;