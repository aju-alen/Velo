import { StyleSheet, Text, TouchableOpacity, View, FlatList, Dimensions, ActivityIndicator, useColorScheme, ScrollView, RefreshControl, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import CustomButton from '@/components/CustomButton';
import * as SecureStore from 'expo-secure-store';
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import useLoginAccountStore from '@/store/loginAccountStore';
import useShipmentStore from '@/store/shipmentStore';
import axiosInstance, { setAuthorizationHeader } from '@/constants/axiosHeader';
import { signOut, getAuth } from '@react-native-firebase/auth';
import { Colors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { resetTo } from '@/utils/resetNavigation';
import { resumeShipmentWizard } from '@/utils/resumeShipmentWizard';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - horizontalScale(40) - horizontalScale(32)) / 3;

const HomeMainPage = () => {
  const { setEditData, resetShipmentData, hydrateFromDraft } = useShipmentStore()
  const {accountLoginData,resetAccountLoginData} = useLoginAccountStore();
  console.log(accountLoginData,'accountLoginData----11----');
  
  const [categoryData, setCategoryData] = useState([]);
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(true);
  const [shipments, setShipments] = useState([]);
  const [shipmentStats, setShipmentStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });
  const [loadingShipments, setLoadingShipments] = useState(false);
  const [agentShipments, setAgentShipments] = useState<any[]>([]);
  const [loadingAgentShipments, setLoadingAgentShipments] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [drafts, setDrafts] = useState<any[]>([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  const getUserShipments = async () => {
    if (accountLoginData.role !== 'USER' || !accountLoginData.id) return;
    
    try {
      setLoadingShipments(true);
      const response = await axiosInstance.get(`${ipURL}/api/shipment/get-all-paid-shipments/${accountLoginData.id}`);
      const allShipments = response.data || [];
      setShipments(allShipments);
      
      // Calculate stats
      const stats = {
        total: allShipments.length,
        active: allShipments.filter(s => 
          ['SHIPMENT_PICKED', 'SHIPMENT_DROPPED', 'IN_TRANSIT_START', 'IN_TRANSIT_END', 'OUT_FOR_DELIVERY'].includes(s.shipmentStatus)
        ).length,
        completed: allShipments.filter(s => s.shipmentStatus === 'DELIVERED').length,
        pending: allShipments.filter(s => s.shipmentStatus === 'PAYMENT_PENDING').length
      };
      setShipmentStats(stats);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoadingShipments(false);
    }
  };

  const getAgentShipments = async () => {
    if (accountLoginData.role !== 'AGENT' || !accountLoginData.organisationId) return;
    try {
      setLoadingAgentShipments(true);
      const response = await axiosInstance.get(`${ipURL}/api/shipment/agent/get-all-accepted-shipments/${accountLoginData.organisationId}`);
      const list = response.data || [];
      setAgentShipments(list);
    } catch (error) {
      console.error('Error fetching agent shipments:', error);
      setAgentShipments([]);
    } finally {
      setLoadingAgentShipments(false);
    }
  };

  const getUserDrafts = async () => {
    if (accountLoginData.role !== 'USER' || !accountLoginData.id) return;
    try {
      setLoadingDrafts(true);
      const response = await axiosInstance.get(`/api/shipment/drafts/${accountLoginData.id}`);
      setDrafts(response.data?.drafts || []);
    } catch (error) {
      console.error('Error fetching drafts:', error);
      setDrafts([]);
    } finally {
      setLoadingDrafts(false);
    }
  };

  const continueDraft = (draft: any) => {
    hydrateFromDraft(draft.payload || {}, draft.id);
    resumeShipmentWizard(draft.currentStep || 'createShipmentHome');
  };

  const deleteDraft = (draftId: string) => {
    Alert.alert('Delete draft', 'Remove this saved shipment draft?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axiosInstance.delete(`/api/shipment/draft/${draftId}`);
            setDrafts((prev) => prev.filter((d) => d.id !== draftId));
          } catch (e) {
            Alert.alert('Error', 'Could not delete draft');
          }
        },
      },
    ]);
  };

  const getCategoryData = async () => {
    const getAccountDetails = await SecureStore.getItemAsync('registerDetail');
    if (getAccountDetails) {
      setAccountName(JSON.parse(getAccountDetails).name);
    }

    setAuthorizationHeader(accountLoginData.token);
    const getCategory = await axios.get(`${ipURL}/api/category/get-all-categories`);
    setCategoryData(getCategory.data);
    setLoading(false);
  };

  const refreshDashboard = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([getCategoryData(), getUserShipments(), getAgentShipments(), getUserDrafts()]);
    } finally {
      setRefreshing(false);
    }
  }, [accountLoginData.id, accountLoginData.role, accountLoginData.organisationId, accountLoginData.token]);

  useEffect(() => {
    getCategoryData();
    getUserShipments();
    getAgentShipments();
    getUserDrafts();
  }, [accountLoginData.id, accountLoginData.role, accountLoginData.organisationId]);

  const handleLogout = async () => {
    try{
      await SecureStore.deleteItemAsync('registerDetail');
      try {
        await signOut(getAuth());
      } catch (e) {
        
      }
      resetAccountLoginData();
      resetTo('/(auth)/login');
    }
    catch(err){
      console.log(err);
    }
    
  };

  const renderMarketplaceCategoryCard = ({ item, index }) => {
    const catId = item.id;
    
    // Generate different gradient colors based on index
    const gradientColors = getGradientColors(9) as [string, string];
    
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => router.push({ pathname:'/(tabs)/market/marketHome', params:{catId}})}
      >
        <View style={[styles.marketplaceCardContainer, { backgroundColor: themeColors.background }]}>
          <LinearGradient
            colors={gradientColors as [string, string]}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name={item.categoryImgUrl} size={28} color="#FFAC1C" />
            </View>
            <Text style={[styles.categoryText, { color: themeColors.text }]} >
              {item.name}
            </Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };

  const getGradientColors = (index) => {
    // Array of gradient color pairs
    const gradients = [
      ['#1a237e10', '#1a237e20'],
      ['#00695c10', '#00695c20'],
      ['#4a148c10', '#4a148c20'],
      ['#bf360c10', '#bf360c20'],
      ['#1b5e2010', '#1b5e2020'],
      ['#4a148c10', '#4a148c20'],
    ];
    return gradients[index % gradients.length];
  };

  const getStatusColor = (status) => {
    if (!status) return '#A0A0A0';
    const statusLower = status.toLowerCase().replace(/_/g, '');
    switch (statusLower) {
      case 'paymentpending': return '#FF9800';
      case 'orderinmarket': return '#2196F3';
      case 'orderplaced': return '#9C27B0';
      case 'orderconfirmed': return '#00BCD4';
      case 'shipmentpicked': return '#4CAF50';
      case 'shipmentdropped': return '#8BC34A';
      case 'intransitstart': return '#00ACC1';
      case 'intransitend': return '#0097A7';
      case 'outfordelivery': return '#FFC107';
      case 'delivered': return '#4CAF50';
      default: return '#A0A0A0';
    }
  };

  const renderStatCard = (icon: string, label: string, value: number, color: string) => (
    <View style={[styles.statCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text style={[styles.statValue, { color: themeColors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: themeColors.text }]}>{label}</Text>
    </View>
  );

  const renderRecentShipment = (item: any, index: number) => (
    <TouchableOpacity
      key={item.id || index}
      style={[styles.recentShipmentCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
      onPress={() => router.push(`/(tabs)/shippinghistory/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.recentShipmentHeader}>
        <View style={styles.recentShipmentIdContainer}>
          <Ionicons name="cube-outline" size={18} color={colorScheme === 'dark' ? '#FFAC1C' : '#666'} />
          <Text style={[styles.recentShipmentId, { color: themeColors.text }]}>
            #{item.shipmentId || 'N/A'}
          </Text>
        </View>
        <View style={[styles.recentStatusBadge, { backgroundColor: getStatusColor(item.shipmentStatus) }]}>
          <Text style={styles.recentStatusText}>
            {item.shipmentStatus?.replace(/_/g, ' ').substring(0, 15) || 'N/A'}
          </Text>
        </View>
      </View>
      <View style={styles.recentShipmentDetails}>
        <View style={styles.recentShipmentDetailRow}>
          <Ionicons name="calendar-outline" size={14} color={colorScheme === 'dark' ? '#999' : '#666'} />
          <Text style={[styles.recentShipmentDate, { color: themeColors.text }]}>
            {item.shipmentDate ? new Date(item.shipmentDate).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
        {item.receiverName && (
          <View style={styles.recentShipmentDetailRow}>
            <Ionicons name="person-outline" size={14} color={colorScheme === 'dark' ? '#999' : '#666'} />
            <Text style={[styles.recentShipmentReceiver, { color: themeColors.text }]}>
              To: {item.receiverName}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderQuickAction = (icon: string, label: string, onPress: () => void, color: string) => (
    <TouchableOpacity
      style={[styles.quickActionCard, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.quickActionIconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon as any} size={28} color={color} />
      </View>
      <Text style={[styles.quickActionLabel, { color: themeColors.text }]}>{label}</Text>
    </TouchableOpacity>
  );


  const recentShipments = shipments
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      {loading ? (
        <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
          <ActivityIndicator size="large" color="#FFAC1C" />
          <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshDashboard}
              tintColor="#FFAC1C"
              colors={['#FFAC1C']}
            />
          }
        >
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View>
              <Text style={[styles.logoText, { color: '#FFAC1C' }]}>Home</Text>
              <Text style={[styles.welcomeText, { color: themeColors.text }]}>Welcome {accountName}</Text>
            </View>
            <TouchableOpacity onPress={handleLogout} style={styles.deleteButton} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/home/trackShipment')}
            activeOpacity={0.7}
          >
            <View style={[styles.createShipmentContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
              <LinearGradient
                colors={['#FFAC1C20', '#FFAC1C10']}
                style={styles.createShipmentGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.createShipmentContent}>
                  <View style={styles.createShipmentIconContainer}>
                    <MaterialIcons name="search" size={48} color="#FFAC1C" />
                  </View>
                  <View style={styles.createShipmentTextContainer}>
                    <Text style={[styles.createShipmentTitle, { color: themeColors.text }]}>Track a Shipment</Text>
                    <Text style={[styles.createShipmentSubtitle, { color: themeColors.text }]}>Look up a tracking number</Text>
                  </View>
                  <Ionicons name="arrow-forward-circle" size={32} color="#FFAC1C" />
                </View>
              </LinearGradient>
            </View>
          </TouchableOpacity>

          {/* Agent: Assigned Shipments quick action */}
          {accountLoginData.role === 'AGENT' && (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/adminorderdetail/adminOrderDetailMain')}
              activeOpacity={0.7}
            >
              <View style={[styles.createShipmentContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
                <LinearGradient
                  colors={['#FFAC1C20', '#FFAC1C10']}
                  style={styles.createShipmentGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.createShipmentContent}>
                    <View style={styles.createShipmentIconContainer}>
                      <MaterialIcons name="local-shipping" size={48} color="#FFAC1C" />
                    </View>
                    <View style={styles.createShipmentTextContainer}>
                      <Text style={[styles.createShipmentTitle, { color: themeColors.text }]}>
                        Assigned Shipments
                      </Text>
                      <Text style={[styles.createShipmentSubtitle, { color: themeColors.text }]}>
                        {loadingAgentShipments
                          ? 'Loading...'
                          : `${agentShipments.length} shipment${agentShipments.length !== 1 ? 's' : ''} to manage`}
                      </Text>
                    </View>
                    <View style={styles.agentQuickActionRight}>
                      {!loadingAgentShipments && agentShipments.length > 0 && (
                        <View style={styles.agentCountBadge}>
                          <Text style={styles.agentCountText}>{agentShipments.length}</Text>
                        </View>
                      )}
                      <Ionicons name="arrow-forward-circle" size={32} color="#FFAC1C" />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          )}

          {accountLoginData.role === "USER" && (
            <>
              {/* Create Shipment Section */}
              <TouchableOpacity
                onPress={() => {
                  resetShipmentData();
                  setEditData(false);
                  router.push('/(tabs)/home/createShipment/createShipmentHome');
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.createShipmentContainer, { backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)' }]}>
                  <LinearGradient
                    colors={['#FFAC1C20', '#FFAC1C10']}
                    style={styles.createShipmentGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.createShipmentContent}>
                      <View style={styles.createShipmentIconContainer}>
                        <MaterialIcons name="local-shipping" size={48} color="#FFAC1C" />
                      </View>
                      <View style={styles.createShipmentTextContainer}>
                        <Text style={[styles.createShipmentTitle, { color: themeColors.text }]}>Create a Shipment</Text>
                        <Text style={[styles.createShipmentSubtitle, { color: themeColors.text }]}>Ship your items with ease</Text>
                      </View>
                      <Ionicons name="arrow-forward-circle" size={32} color="#FFAC1C" />
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>

              {(loadingDrafts || drafts.length > 0) && (
                <View style={styles.draftsSection}>
                  <Text style={[styles.marketplaceTitle, { color: themeColors.text, marginBottom: verticalScale(8) }]}>
                    Saved drafts
                  </Text>
                  {loadingDrafts ? (
                    <ActivityIndicator color="#FFAC1C" />
                  ) : (
                    drafts.map((draft) => {
                      const receiverName = draft.payload?.savedAddressData?.name || 'Untitled shipment';
                      const updated = draft.updatedAt
                        ? new Date(draft.updatedAt).toLocaleString()
                        : '';
                      return (
                        <View
                          key={draft.id}
                          style={[
                            styles.draftCard,
                            {
                              backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                              borderColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                            },
                          ]}
                        >
                          <TouchableOpacity style={{ flex: 1 }} onPress={() => continueDraft(draft)} activeOpacity={0.7}>
                            <Text style={[styles.draftTitle, { color: themeColors.text }]}>{receiverName}</Text>
                            <Text style={[styles.draftMeta, { color: themeColors.text }]}>
                              Step: {draft.currentStep || 'createShipmentHome'}
                            </Text>
                            {!!updated && (
                              <Text style={[styles.draftMeta, { color: themeColors.text }]}>Updated {updated}</Text>
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => deleteDraft(draft.id)} hitSlop={8}>
                            <Ionicons name="trash-outline" size={22} color="#F44336" />
                          </TouchableOpacity>
                        </View>
                      );
                    })
                  )}
                </View>
              )}
            </>
          )}

          {/* Marketplace Section */}
          <View style={styles.marketplaceSection}>
            <View style={styles.marketplaceHeader}>
              <View style={styles.titleContainer}>
                <Text style={[styles.marketplaceTitle, { color: themeColors.text }]}>Marketplace</Text>
                <Text style={[styles.subTitle, { color: themeColors.text }]}>Explore categories</Text>
              </View>
              <TouchableOpacity
                style={styles.viewAllButton}
                onPress={() => router.push({ pathname: '/(tabs)/market/marketHome', params: { catId: 'undefined' } })}
                activeOpacity={0.7}
              >
                <Text style={styles.viewAllText}>View All</Text>
                <MaterialIcons name="arrow-forward-ios" size={16} color="#FFAC1C" />
              </TouchableOpacity>
            </View>
            <View style={styles.marketplaceGrid}>
              {categoryData.map((item, index) => (
                <View key={item.id} style={styles.marketplaceCardWrapper}>
                  {renderMarketplaceCategoryCard({ item, index })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default HomeMainPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: horizontalScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(80),
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  logoText: {
    fontSize: moderateScale(32),
    fontWeight: '700',
  },
  welcomeText: {
    fontSize: moderateScale(14),
    opacity: 0.7,
    marginTop: verticalScale(4),
  },
  deleteButton: {
    padding: moderateScale(12),
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: moderateScale(12),
  },
  createShipmentContainer: {
    marginBottom: verticalScale(24),
    borderRadius: moderateScale(16),
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  createShipmentGradient: {
    padding: horizontalScale(20),
    borderRadius: moderateScale(16),
  },
  createShipmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  createShipmentIconContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: 'rgba(255, 172, 28, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createShipmentTextContainer: {
    flex: 1,
    marginLeft: horizontalScale(16),
  },
  createShipmentTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  createShipmentSubtitle: {
    fontSize: moderateScale(13),
    opacity: 0.7,
  },
  draftsSection: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(16),
  },
  draftCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(12),
    padding: horizontalScale(14),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    marginBottom: verticalScale(10),
  },
  draftTitle: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  draftMeta: {
    fontSize: moderateScale(12),
    opacity: 0.65,
  },
  agentQuickActionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
  },
  agentCountBadge: {
    backgroundColor: '#FFAC1C',
    minWidth: moderateScale(24),
    height: moderateScale(24),
    borderRadius: moderateScale(14),
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(6),
  },
  agentCountText: {
    color: '#FFF',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  statsSection: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: verticalScale(16),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(12),
  },
  statCard: {
    flex: 1,
    minWidth: (Dimensions.get('window').width - horizontalScale(60)) / 2,
    padding: horizontalScale(16),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIconContainer: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(8),
  },
  statValue: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    marginBottom: verticalScale(4),
  },
  statLabel: {
    fontSize: moderateScale(12),
    opacity: 0.7,
    textAlign: 'center',
  },
  recentShipmentsSection: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  viewAllLink: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  recentShipmentsList: {
    gap: verticalScale(12),
  },
  recentShipmentCard: {
    padding: horizontalScale(16),
    borderRadius: moderateScale(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  recentShipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  recentShipmentIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(8),
    flex: 1,
  },
  recentShipmentId: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  recentStatusBadge: {
    paddingHorizontal: horizontalScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
  },
  recentStatusText: {
    color: 'white',
    fontSize: moderateScale(12),
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  recentShipmentDetails: {
    gap: verticalScale(6),
  },
  recentShipmentDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: horizontalScale(6),
  },
  recentShipmentDate: {
    fontSize: moderateScale(12),
    opacity: 0.7,
  },
  recentShipmentReceiver: {
    fontSize: moderateScale(12),
    opacity: 0.7,
  },
  quickActionsSection: {
    marginBottom: verticalScale(24),
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(12),
  },
  quickActionCard: {
    flex: 1,
    minWidth: (Dimensions.get('window').width - horizontalScale(60)) / 2,
    padding: horizontalScale(20),
    borderRadius: moderateScale(12),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  quickActionIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(24),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  quickActionLabel: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    textAlign: 'center',
  },
  marketplaceSection: {
    marginBottom: verticalScale(24),
  },
  marketplaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  titleContainer: {
    flex: 1,
  },
  marketplaceTitle: {
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  subTitle: {
    fontSize: moderateScale(13),
    opacity: 0.7,
    marginTop: verticalScale(4),
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    paddingHorizontal: horizontalScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
  },
  viewAllText: {
    color: '#FFAC1C',
    marginRight: horizontalScale(4),
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  marketplaceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: horizontalScale(12),
  },
  marketplaceCardWrapper: {
    width: CARD_WIDTH,
  },
  marketplaceCardContainer: {
    width: '100%',
    borderRadius: moderateScale(16),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardGradient: {
    padding: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(120),
  },
  iconContainer: {
    width: horizontalScale(50),
    height: verticalScale(50),
    borderRadius: moderateScale(25),
    backgroundColor: 'rgba(255, 172, 28, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: 'rgba(255, 172, 28, 0.2)',
  },
  categoryText: {
    textAlign: 'center',
    fontSize: moderateScale(13),
    lineHeight: moderateScale(16),
    fontWeight: '500',
  },
});