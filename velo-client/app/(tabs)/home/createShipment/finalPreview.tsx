import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, View, Text, useColorScheme } from 'react-native';
import React,{useState} from 'react';
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';
import { Divider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import axiosInstance from '@/constants/axiosHeader';
import { Colors } from '@/constants/Colors';

const FinalPreview = () => {
  const {
    savedAddressData,
    packageDetail,
    packageDescription,
    accountAddressData,
    deliveryServices,
    itemType,
    finalShipmentData
  } = useShipmentStore();
  const { accountLoginData } = useLoginAccountStore();
  const [laoding, setLoading] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
  const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';

  
  
  
  const handleSendShipmentToDb = async() => {
    console.log('insideeeee');
    
    try {
      console.log(finalShipmentData,'finalShipmentData---in previewwwwwww');
      
      setLoading(true);
      const formData = {
        userId: accountLoginData.id,
        senderName: accountAddressData.userName,
        senderAddressOne: accountAddressData.addressOne,
        senderAddressTwo: accountAddressData.addressTwo,
        senderCity: accountAddressData.city,
        senderState: accountAddressData.state,
        senderEmail: accountAddressData.email,
        senderMobileNumber : `${accountAddressData.countryCode}${accountAddressData.mobileNumber}`, 

        shipmentDate: savedAddressData.shipmentDate,
        deliveryDate: savedAddressData.deliveryDate,

        receiverName: savedAddressData.name,
        receiverAddressOne: savedAddressData.addressOne,
        receiverAddressTwo: savedAddressData.addressTwo,
        receiverCity: savedAddressData.city,
        receiverState: savedAddressData.state,
        receiverEmail: savedAddressData.email,
        receiverMobileNumber: `${savedAddressData.countryCode}${savedAddressData.mobileNumber}`,
        receiverCountryId: savedAddressData.countryId,
        receiverCountryCode: savedAddressData.countryCode,
        receiverResidentAddress: savedAddressData.residentAddress,
        receiverZipCode: savedAddressData.zipCode,

        packageLength: packageDetail.length,
        packageWidth: packageDetail.width,
        packageHeight: packageDetail.height,
        packageWeight: packageDetail.weight,
        packagePieces: packageDetail.numberOfPieces,

        verbalNotificationService: deliveryServices.verbalNotification,
        adultSignatureService: deliveryServices.adultSignature,
        directSignatureService: deliveryServices.directSignature,
        pickupTimeFrom: deliveryServices.deliveryPickupTimeFrom,
        pickupTimeTo: deliveryServices.deliveryPickupTimeTo,
        pickupInstructions: deliveryServices.pickupInstruction,
        pickupSpecialInstructions: deliveryServices.pickupSpecialInstruction,
        openMarketPrice: finalShipmentData.shippingMarket === 'OPEN_MARKET' ? finalShipmentData.totalPrice : 0,

        packageDescription: packageDescription,
        shippingMarket:finalShipmentData.shippingMarket,

        assignedOrganisationId: finalShipmentData.organisationId,
        shipmentType:itemType,
        shipmentStatus: finalShipmentData.shippingMarket === 'OPEN_MARKET' ? 'ORDER_IN_MARKET' : "PAYMENT_PENDING" ,
      }

      console.log(formData,'formData----in final preview');
      
      const sendNewShipment = await axiosInstance.post(`${ipURL}/api/shipment/create-new-shipment`, formData);
      console.log(sendNewShipment.data,'______________________');
      
      setLoading(false);
      if(finalShipmentData.shippingMarket === 'OPEN_MARKET'){
        router.push({pathname:'/(tabs)/home/createShipment/open-market-confrim'});
      }
      else if(finalShipmentData.shippingMarket === 'CLOSED_MARKET'){
      router.push({pathname:'/(tabs)/home/createShipment/payment',params:{shipmentId:sendNewShipment.data.shipmentId}});
      }
    }
    catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', 'Something went wrong, please try again later');
    }
  }

  const renderAddressCard = (title, data) => (
    <View style={[styles.card, { backgroundColor: bgCard }]}>
      <Text style={[styles.cardTitle, { color: textPrimary }]}>{title}</Text>
      <Divider style={[styles.cardDivider, { backgroundColor: borderColor }]} />
      <Text style={[styles.nameText, { color: textPrimary }]}>{data.userName || data.name}</Text>
      <Text style={[styles.detailText, { color: textPrimary }]}>
        {data.addressOne}, {data.addressTwo}
      </Text>
      <Text style={[styles.detailText, { color: textPrimary }]}>
        {data.city}, {data.state}
      </Text>
      <Text style={[styles.detailText, { color: textPrimary }]}>{data.email}</Text>
      <Text style={[styles.detailText, { color: textPrimary }]}>
        {data.countryCode} {data.mobileNumber}
      </Text>
    </View>
  );

  const renderIconHeader = (iconName, title) => (
    <View style={styles.sectionHeader}>
      <Ionicons name={iconName} size={24} color="#FFAC1C" />
      <Text style={[styles.sectionTitle, { color: textPrimary }]}>{title}</Text>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.background }]} showsVerticalScrollIndicator={false}>
      {/* Shipment Details Section */}
      <View style={[styles.section, { backgroundColor: bgCard }]}>
        {renderIconHeader("cube-outline", "Shipment Details")}
        <Divider style={[styles.sectionDivider, { backgroundColor: borderColor }]} />

        <View style={[styles.card, { backgroundColor: bgCard }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Shipping Date</Text>
          <Divider style={[styles.cardDivider, { backgroundColor: borderColor }]} />
          <Text style={styles.highlightText}>
            {savedAddressData.deliveryDate.toDateString()}
          </Text>
        </View>

        {/* Shipping From */}
        {renderAddressCard('Shipping From', accountAddressData)}

        {/* Shipping To */}
        {renderAddressCard('Shipping To', savedAddressData)}

        {/* Package Details */}
        <View style={[styles.card, { backgroundColor: bgCard }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Package Details</Text>
          <Divider style={[styles.cardDivider, { backgroundColor: borderColor }]} />
          <Text style={[styles.detailText, { color: textPrimary }]}>{packageDetail.packageName}</Text>
          {itemType === 'PACKAGE' && <Text style={[styles.detailText, { color: textPrimary }]}>
            Dimensions: {packageDetail.length} x {packageDetail.width} x {packageDetail.height} cm
          </Text>}
          <Text style={[styles.detailText, { color: textPrimary }]}>
            {packageDetail.numberOfPieces} Piece(s) • {packageDetail.weight} kg
          </Text>
        </View>

        {/* Package Description */}
        <View style={[styles.card, { backgroundColor: bgCard }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Package Description</Text>
          <Divider style={[styles.cardDivider, { backgroundColor: borderColor }]} />
          <Text style={[styles.detailText, { color: textPrimary }]}>{packageDescription}</Text>
        </View>
      </View>

      {/* Pickup Details Section */}
      <View style={[styles.section, { backgroundColor: bgCard }]}>
        {renderIconHeader("time-outline", "Pickup Details")}
        <Divider style={[styles.sectionDivider, { backgroundColor: borderColor }]} />

        {/* Pickup Time */}
        <View style={[styles.card, { backgroundColor: bgCard }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Pickup Time</Text>
          <Divider style={[styles.cardDivider, { backgroundColor: borderColor }]} />
          <Text style={styles.highlightText}>
            {deliveryServices.deliveryPickupTimeFrom} - {deliveryServices.deliveryPickupTimeTo}
          </Text>
        </View>

        
        {/* Pickup Services */}

        {/* Pickup Instructions */}
        <View style={[styles.card, { backgroundColor: bgCard }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Pickup Instruction</Text>
          <Divider style={[styles.cardDivider, { backgroundColor: borderColor }]} />
          <Text style={[styles.detailText, { color: textPrimary }]}>
            {deliveryServices.pickupInstruction || 'No specific instructions provided'}
          </Text>
        </View>

        {/* Special Instructions */}
        <View style={[styles.card, { backgroundColor: bgCard }]}>
          <Text style={[styles.cardTitle, { color: textPrimary }]}>Special Instruction</Text>
          <Divider style={[styles.cardDivider, { backgroundColor: borderColor }]} />
          <Text style={[styles.detailText, { color: textPrimary }]}>
            {deliveryServices.pickupSpecialInstruction || 'No special instructions provided'}
          </Text>
        </View>
      </View>
        <TouchableOpacity onPress={handleSendShipmentToDb}>
      <View style={styles.buttonContainer}>
          {
          laoding? <ActivityIndicator size="small" color="#fff" /> : 
          <Text style={styles.finalPreviewText}>Confirm Shipment</Text>
          }
          
      </View>
        </TouchableOpacity>
    </ScrollView>
  );
};

export default FinalPreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(16),
  },
  section: {
    marginBottom: verticalScale(24),
    padding: moderateScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginLeft: horizontalScale(8),
  },
  sectionDivider: {
    marginVertical: verticalScale(12),
  },
  card: {
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(16),
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  cardDivider: {
    marginVertical: verticalScale(8),
  },
  nameText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  detailText: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(4),
  },
  highlightText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#FFAC1C',
  },
  confirmButtonContainer: {
    alignItems: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(32),
    paddingVertical: verticalScale(12),
    backgroundColor: '#FFAC1C',
    borderRadius: moderateScale(10),
  },
  buttonContainer: {
    backgroundColor: '#FFAC1C',
    padding: horizontalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: horizontalScale(24),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(4),
    fontSize: moderateScale(16),
  },
  finalPreviewText: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#FFF',
  },
});
