import { StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React,{useState} from 'react';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import useShipmentStore from '@/store/shipmentStore';
import useLoginAccountStore from '@/store/loginAccountStore';
import { Divider } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import axiosInstance from '@/constants/axiosHeader';

const FinalPreview = () => {
  const {
    savedAddressData,
    packageDetail,
    packageDescription,
    accountAddressData,
    deliveryServices,
    itemType,
  } = useShipmentStore();
  const { accountLoginData } = useLoginAccountStore();
  const [laoding, setLoading] = useState(false);
  console.log(savedAddressData,'savedAddressData');
  console.log(accountAddressData,'accountAddressData');
  
  
  const handleSendShipmentToDb = async() => {
    try {
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

        packageDescription: packageDescription,

      }
      const sendNewShipment = await axiosInstance.post(`${ipURL}/api/shipment/create-new-shipment`, formData);
      console.log(sendNewShipment.data,'______________________');
      
      setLoading(false);
      router.push({pathname:'/(tabs)/home/createShipment/payment',params:{shipmentId:sendNewShipment.data.shipmentId}});

    }
    catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error', 'Something went wrong, please try again later');
    }
  }

  const renderAddressCard = (title, data) => (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>
      <Divider style={styles.cardDivider} />
      <ThemedText style={styles.nameText}>{data.userName || data.name}</ThemedText>
      <ThemedText style={styles.detailText}>
        {data.addressOne}, {data.addressTwo}
      </ThemedText>
      <ThemedText style={styles.detailText}>
        {data.city}, {data.state}
      </ThemedText>
      <ThemedText style={styles.detailText}>{data.email}</ThemedText>
      <ThemedText style={styles.detailText}>
        {data.countryCode} {data.mobileNumber}
      </ThemedText>
    </ThemedView>
  );

  const renderIconHeader = (iconName, title) => (
    <ThemedView style={styles.sectionHeader}>
      <Ionicons name={iconName} size={24} color="#FFAC1C" />
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    </ThemedView>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Shipment Details Section */}
      <ThemedView style={styles.section}>
        {renderIconHeader("cube-outline", "Shipment Details")}
        <Divider style={styles.sectionDivider} />

        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Shipping Date</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.highlightText}>
            {savedAddressData.deliveryDate.toDateString()}
          </ThemedText>
        </ThemedView>

        {/* Shipping From */}
        {renderAddressCard('Shipping From', accountAddressData)}

        {/* Shipping To */}
        {renderAddressCard('Shipping To', savedAddressData)}

        {/* Package Details */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Package Details</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.detailText}>{packageDetail.packageName}</ThemedText>
          {itemType === 'package' && <ThemedText style={styles.detailText}>
            Dimensions: {packageDetail.length} x {packageDetail.width} x {packageDetail.height} cm
          </ThemedText>}
          <ThemedText style={styles.detailText}>
            {packageDetail.numberOfPieces} Piece(s) • {packageDetail.weight} kg
          </ThemedText>
        </ThemedView>

        {/* Package Description */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Package Description</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.detailText}>{packageDescription}</ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Pickup Details Section */}
      <ThemedView style={styles.section}>
        {renderIconHeader("time-outline", "Pickup Details")}
        <Divider style={styles.sectionDivider} />

        {/* Pickup Time */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Pickup Time</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.highlightText}>
            {deliveryServices.deliveryPickupTimeFrom} - {deliveryServices.deliveryPickupTimeTo}
          </ThemedText>
        </ThemedView>

        
        {/* Pickup Services */}

        {/* Pickup Instructions */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Pickup Instruction</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.detailText}>
            {deliveryServices.pickupInstruction || 'No specific instructions provided'}
          </ThemedText>
        </ThemedView>

        {/* Special Instructions */}
        <ThemedView style={styles.card}>
          <ThemedText style={styles.cardTitle}>Special Instruction</ThemedText>
          <Divider style={styles.cardDivider} />
          <ThemedText style={styles.detailText}>
            {deliveryServices.pickupSpecialInstruction || 'No special instructions provided'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
        <TouchableOpacity onPress={handleSendShipmentToDb}>
      <ThemedView style={styles.buttonContainer}>
          {
          laoding? <ActivityIndicator size="small" color="#fff" /> : 
          <ThemedText style={styles.finalPreviewText}>Confirm Shipment</ThemedText>
          }
          
      </ThemedView>
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
  },
});
