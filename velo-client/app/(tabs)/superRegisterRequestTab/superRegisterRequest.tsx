import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity, StyleSheet, Alert, View, Text, useColorScheme, SafeAreaView, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import useLoginAccountStore from '@/store/loginAccountStore'
import axiosInstance from '@/constants/axiosHeader'
import { verticalScale, horizontalScale, moderateScale } from '@/constants/metrics'
import { Colors } from '@/constants/Colors'

interface AppointmentRequest {
  id: string;
  name: string;
  email: string;
  mobileCode: string;
  mobileCountry: string;
  mobileNumber: string;
  appointmentDate?: string;
  registerVerificationStatus: string;
  createdAt: string;
  organisationId?: string;
  organisation?: {
    organisationName?: string;
  };
}

const SuperRegisterRequest = () => {
  const { accountLoginData } = useLoginAccountStore();
  const [appointmentBookedData, setAppointmentBookedData] = useState<AppointmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const getAppointmentRequest = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/test-routes/get-all-appointent-request')
      setAppointmentBookedData(response.data.allAppointmentRequest)
    } catch (e) {
      console.log(e)
      Alert.alert('Error', 'Failed to load appointment requests')
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAppointmentRequest()
  }, [])

  const handleAccept = async(id: string) => {
    console.log(`Accepted request for ID: ${id}`);
    try{
      const response = await axiosInstance.put(`/api/test-routes/approve-agent-appointment/${id}`)
      console.log(response.data);
      
      if(response.data.updateBool){
        Alert.alert('Agent Accepted')
        setAppointmentBookedData(prev=> prev.filter(item => item.id !== id))
  
      }
    }
    catch(e){
      console.log(e)
    } 
  
  }

  const handleDecline = async (id: string) => {
    Alert.alert(
      'Decline Request',
      'Are you sure you want to decline this appointment request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: async () => {
            try {
              // Implement decline API call if available
              console.log(`Declined request for ID: ${id}`)
              setAppointmentBookedData(prev => prev.filter(item => item.id !== id))
              Alert.alert('Request Declined', 'The appointment request has been declined.')
            } catch (e) {
              console.log(e)
              Alert.alert('Error', 'Failed to decline request')
            }
          }
        }
      ]
    )
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  }

  const renderDetailRow = (icon: keyof typeof Ionicons.glyphMap, label: string, value: string) => (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={18} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
      <View style={styles.detailContent}>
        <Text style={[styles.detailLabel, { color: themeColors.text }]}>{label}</Text>
        <Text style={[styles.detailValue, { color: themeColors.text }]}>{value}</Text>
      </View>
    </View>
  )

  const renderAppointmentCard = ({ item }: { item: AppointmentRequest }) => (
    <View style={[styles.card, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
      <View style={styles.cardHeader}>
        <View style={styles.headerContent}>
          <View style={[styles.iconContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.1)' : 'rgba(255, 172, 28, 0.05)' }]}>
            <Ionicons name="person" size={24} color="#FFAC1C" />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: themeColors.text }]}>{item.name}</Text>
            <Text style={[styles.statusBadge, { 
              backgroundColor: item.registerVerificationStatus === 'APPOINTMENT_BOOKED' ? '#FF9800' : '#2196F3',
              color: 'white'
            }]}>
              {item.registerVerificationStatus.replace(/_/g, ' ')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        {renderDetailRow('mail-outline', 'Email', item.email)}
        {renderDetailRow('call-outline', 'Phone', `${item.mobileCode} ${item.mobileNumber}`)}
        {renderDetailRow('calendar-outline', 'Appointment Date', formatDate(item.appointmentDate))}
        {renderDetailRow('time-outline', 'Requested On', formatDate(item.createdAt))}
        {item.organisation?.organisationName && renderDetailRow('business-outline', 'Organisation', item.organisation.organisationName)}
      </View>
        
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.acceptButton]} 
          onPress={() => handleAccept(item.id)}
        >
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.declineButton]} 
          onPress={() => handleDecline(item.id)}
        >
          <Ionicons name="close-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFAC1C" />
          <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading requests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.pageTitle, { color: themeColors.text }]}>Appointment Requests</Text>
        <Text style={[styles.subtitle, { color: themeColors.text }]}>
          {appointmentBookedData.length} {appointmentBookedData.length === 1 ? 'request' : 'requests'}
        </Text>
      </View>
      <FlatList
        data={appointmentBookedData}
        renderItem={renderAppointmentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colorScheme === 'dark' ? '#666' : '#999'} />
            <Text style={[styles.emptyText, { color: themeColors.text }]}>No appointment requests</Text>
            <Text style={[styles.emptySubtext, { color: themeColors.text }]}>
              All appointment requests have been processed
            </Text>
          </View>
        }
      />
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
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  pageTitle: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: moderateScale(14),
    opacity: 0.7,
  },
  listContainer: {
    padding: horizontalScale(20),
    paddingBottom: verticalScale(80),
  },
  card: {
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    padding: horizontalScale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: horizontalScale(12),
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: verticalScale(6),
  },
  statusBadge: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    alignSelf: 'flex-start',
    textTransform: 'capitalize',
  },
  cardContent: {
    padding: horizontalScale(16),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(14),
  },
  detailContent: {
    flex: 1,
    marginLeft: horizontalScale(12),
  },
  detailLabel: {
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
  buttonContainer: {
    flexDirection: 'row',
    padding: horizontalScale(16),
    paddingTop: verticalScale(8),
    gap: horizontalScale(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: verticalScale(12),
    paddingHorizontal: horizontalScale(16),
    borderRadius: moderateScale(10),
    alignItems: 'center',
    justifyContent: 'center',
    gap: horizontalScale(8),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: moderateScale(15),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: verticalScale(80),
  },
  emptyText: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  emptySubtext: {
    fontSize: moderateScale(14),
    opacity: 0.7,
    textAlign: 'center',
  },
})

export default SuperRegisterRequest