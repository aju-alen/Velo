import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  TextInput,
  View,
  Text,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import axiosInstance from '@/constants/axiosHeader';
import useShipmentStore from '@/store/shipmentStore';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router, useFocusEffect } from 'expo-router';
import { Divider } from 'react-native-paper';
import { Colors } from '@/constants/Colors';
import { horizontalScale, moderateScale, verticalScale } from '@/constants/metrics';
import { SafeAreaView } from 'react-native-safe-area-context';

const StaticData = ({ onSelect, isSelected, error }) => {
  const [price, setPrice] = useState('');
  const colorScheme = useColorScheme() ?? 'light';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
  const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';

  const handleStaticPrice = () => {
    const numPrice = Number(price);
    if (!price.trim() || isNaN(numPrice) || numPrice <= 0) {
      return;
    }
    onSelect(null, numPrice, 0, 0, 'OPEN_MARKET');
  };

  const handleSetPrice = (text) => {
    setPrice(text);
    const num = Number(text);
    onSelect(null, isNaN(num) ? 0 : num, 0, 0, 'OPEN_MARKET');
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, isSelected && styles.selectedCardContainer]}
      onPress={handleStaticPrice}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.02)',
          },
          isSelected && styles.selectedCard,
        ]}
      >
        <Text
          style={[
            styles.minimalDetail,
            { textAlign: 'center', color: textPrimary, marginBottom: verticalScale(12) },
          ]}
        >
          Enter Your price and someone will try to match it.
        </Text>
        <TextInput
          value={price}
          onChangeText={handleSetPrice}
          style={[
            styles.textInput,
            {
              backgroundColor:
                colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: error ? '#E53935' : borderColor,
              borderWidth: error ? 2 : 1,
              color: textPrimary,
            },
          ]}
          placeholder="Enter Your Price (AED)"
          placeholderTextColor={textSecondary}
          keyboardType="numeric"
        />
        {error ? <Text style={styles.fieldError}>{error}</Text> : null}
      </View>
    </TouchableOpacity>
  );
};

/** Quote comes from /shipping-quotes — use server totals, do not recompute client-side. */
const OrganisationCard = ({ item, onSelect, isSelected }) => {
  const { deliveryServices } = useShipmentStore();
  const [expanded, setExpanded] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';
  const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const total = Number(item.totalPrice) || 0;
  const base = Number(item.basePrice) || 0;
  const collection = Number(item.collectionPrice) || 0;

  const handleCardSelect = () => {
    onSelect(item.id, total, base, collection, 'CLOSED_MARKET');
  };

  return (
    <TouchableOpacity
      style={[styles.cardContainer, isSelected && styles.selectedCardContainer]}
      onPress={handleCardSelect}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor:
              colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.02)',
          },
          isSelected && styles.selectedCard,
        ]}
      >
        <View style={[styles.cardHeader, { borderBottomColor: borderColor }]}>
          <Text style={[styles.organisationName, { color: textPrimary }]} numberOfLines={1}>
            {item.organisationName || 'Unnamed Organisation'}
          </Text>
          <TouchableOpacity onPress={toggleExpand} style={styles.expandButton}>
            <Text style={styles.expandButtonText}>{expanded ? 'Show Less' : 'Show More'}</Text>
            <AntDesign name={expanded ? 'up' : 'down'} size={16} color="#FFAC1C" />
          </TouchableOpacity>
        </View>

        <View style={styles.minimalDetailsContainer}>
          <View style={styles.minimalDetailItem}>
            <AntDesign
              name="clock-circle"
              size={16}
              color={colorScheme === 'dark' ? '#FFAC1C' : '#666'}
              style={styles.minimalDetailIcon}
            />
            <Text style={[styles.minimalDetail, { color: textPrimary }]}>
              Deliver within {item.deliveryTimeline || 'N/A'} days
            </Text>
          </View>
          <View style={styles.minimalDetailItem}>
            <AntDesign
              name="wallet"
              size={16}
              color={colorScheme === 'dark' ? '#FFAC1C' : '#666'}
              style={styles.minimalDetailIcon}
            />
            <Text style={[styles.minimalDetail, { color: textPrimary }]}>
              Total AED {total.toFixed(2)}
            </Text>
          </View>
        </View>

        {expanded && (
          <View style={styles.expandedDetailsContainer}>
            <View
              style={[
                styles.pricingSection,
                {
                  backgroundColor:
                    colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.01)',
                },
              ]}
            >
              <Text style={[styles.pricingSectionTitle, { color: textPrimary }]}>
                Shipping Details
              </Text>

              {item.itemType === 'DOCUMENT' ? (
                <View style={styles.pricingRow}>
                  <Text style={[styles.pricingLabel, { color: textPrimary }]}>
                    Document ({item.pieces} × AED {Number(item.documentPricePerPiece).toFixed(2)})
                  </Text>
                  <Text style={[styles.pricingValue, { color: textPrimary }]}>
                    AED {base.toFixed(2)}
                  </Text>
                </View>
              ) : (
                <>
                  <View style={styles.pricingRow}>
                    <Text style={[styles.pricingLabel, { color: textPrimary }]}>
                      Weight ({item.weight} kg × AED {Number(item.packagePricePerKg).toFixed(2)})
                    </Text>
                    <Text style={[styles.pricingValue, { color: textPrimary }]}>
                      AED{' '}
                      {(
                        (Number(item.packagePricePerKg) || 0) * (Number(item.weight) || 0)
                      ).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.pricingRow}>
                    <Text style={[styles.pricingLabel, { color: textPrimary }]}>
                      Pieces ({item.pieces} × AED {Number(item.packagePricePerPiece).toFixed(2)})
                    </Text>
                    <Text style={[styles.pricingValue, { color: textPrimary }]}>
                      AED{' '}
                      {(
                        (Number(item.packagePricePerPiece) || 0) * (Number(item.pieces) || 0)
                      ).toFixed(2)}
                    </Text>
                  </View>
                </>
              )}

              <View style={styles.pricingRow}>
                <Text style={[styles.pricingLabel, { color: textPrimary }]}>
                  Collection (10%)
                </Text>
                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                  AED {collection.toFixed(2)}
                </Text>
              </View>

              <View style={styles.pricingRow}>
                <Text style={[styles.pricingLabel, { color: textPrimary }]}>
                  Verbal Notification
                </Text>
                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                  AED {deliveryServices.verbalNotification ? 10 : 0}
                </Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={[styles.pricingLabel, { color: textPrimary }]}>Adult Signature</Text>
                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                  AED {deliveryServices.adultSignature ? 20 : 0}
                </Text>
              </View>
              <View style={styles.pricingRow}>
                <Text style={[styles.pricingLabel, { color: textPrimary }]}>Direct Signature</Text>
                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                  AED {deliveryServices.directSignature ? 20 : 0}
                </Text>
              </View>

              <View
                style={[styles.pricingRow, styles.totalPricingRow, { borderTopColor: borderColor }]}
              >
                <Text style={[styles.totalPricingLabel, { color: textPrimary }]}>Total</Text>
                <Text style={styles.totalPricingValue}>AED {total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ViewShippingOptions = () => {
  const { setFinalShipmentData, finalShipmentData } = useShipmentStore();
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
  const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';

  const [allShippingOptions, setAllShippingOptions] = useState([]);
  const [quoteError, setQuoteError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const hasLoadedOnce = React.useRef(false);

  const isOrganisationSelected = selectedItem != null && selectedItem.id != null;
  const isOpenMarketSelected =
    selectedItem != null && (selectedItem.id == null || selectedItem.id === undefined);
  const isOpenMarketPriceValid =
    selectedItem?.totalPrice != null &&
    Number.isFinite(Number(selectedItem.totalPrice)) &&
    Number(selectedItem.totalPrice) > 0;
  const isFormValid =
    selectedItem != null &&
    (isOrganisationSelected || (isOpenMarketSelected && isOpenMarketPriceValid));

  const openMarketError =
    isOpenMarketSelected && !isOpenMarketPriceValid
      ? 'Please enter a valid price (greater than 0 AED).'
      : null;
  const selectionError =
    showErrors && selectedItem == null
      ? 'Please select a shipping option above or enter your price in the Open Market section.'
      : null;

  const getallShippingOptions = useCallback(async () => {
    try {
      if (!hasLoadedOnce.current) setLoading(true);
      setQuoteError(null);

      const store = useShipmentStore.getState();
      const itemType = store.itemType;
      const pieces = Number(store.packageDetail.numberOfPieces) || 0;
      const weight = Number(store.packageDetail.weight) || 0;
      const ds = store.deliveryServices;

      if (itemType !== 'DOCUMENT' && itemType !== 'PACKAGE') {
        setAllShippingOptions([]);
        setQuoteError('Shipment type is missing. Go back and choose Document or Package.');
        return;
      }
      if (itemType === 'DOCUMENT' && pieces < 1) {
        setAllShippingOptions([]);
        setQuoteError('Document piece count is missing. Go back and complete package details.');
        return;
      }
      if (itemType === 'PACKAGE' && (pieces < 1 || weight <= 0)) {
        setAllShippingOptions([]);
        setQuoteError('Package weight or pieces are missing. Go back and complete package details.');
        return;
      }

      const params = new URLSearchParams({
        itemType,
        pieces: String(pieces),
        weight: String(weight),
        verbal: ds.verbalNotification ? '1' : '0',
        adult: ds.adultSignature ? '1' : '0',
        direct: ds.directSignature ? '1' : '0',
        t: String(Date.now()),
      });

      const response = await axiosInstance.get(
        `/api/organisation/shipping-quotes?${params.toString()}`
      );
      const quotes = Array.isArray(response.data?.quotes) ? response.data.quotes : [];
      setAllShippingOptions(quotes);
      hasLoadedOnce.current = true;

      const priorOrgId = store.finalShipmentData.organisationId;
      const market = store.finalShipmentData.shippingMarket;
      if (priorOrgId && market === 'CLOSED_MARKET') {
        const match = quotes.find((o) => String(o.id) === String(priorOrgId));
        if (match) {
          setSelectedItem({ id: match.id, totalPrice: match.totalPrice });
          store.setFinalShipmentData({
            shippingMarket: 'CLOSED_MARKET',
            organisationId: String(match.id),
            totalPrice: match.totalPrice,
            basePrice: match.basePrice,
            collectionPrice: match.collectionPrice,
          });
        } else {
          setSelectedItem(null);
          store.setFinalShipmentData({
            organisationId: '',
            totalPrice: 0,
            basePrice: 0,
            collectionPrice: 0,
            shippingMarket: '',
          });
        }
      }
    } catch (e) {
      console.log(e);
      setAllShippingOptions([]);
      setQuoteError('Could not load live carrier rates. Pull back and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getallShippingOptions();
    }, [getallShippingOptions])
  );

  const handleItemSelect = (itemId, totalPrice, basePrice, collectionPrice, shippingMarket) => {
    const isSelected = selectedItem?.id === itemId;
    setSelectedItem(isSelected ? null : { id: itemId, totalPrice });
    setFinalShipmentData({
      ...finalShipmentData,
      shippingMarket,
      organisationId: itemId != null ? String(itemId) : '',
      totalPrice,
      basePrice,
      collectionPrice,
    });
  };

  const handleContinue = () => {
    if (!isFormValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    router.push('/home/createShipment/finalPreview');
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFAC1C" />
          <Text style={[styles.loadingText, { color: textPrimary }]}>Loading live rates…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      {quoteError ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{quoteError}</Text>
        </View>
      ) : null}

      <FlatList
        data={allShippingOptions}
        renderItem={({ item }) => (
          <OrganisationCard
            item={item}
            onSelect={handleItemSelect}
            isSelected={selectedItem?.id === item.id}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyMessage, { color: textPrimary }]}>
              {quoteError
                ? 'No quotes available yet.'
                : 'No agents have set pricing for this shipment type.'}
            </Text>
            <Text style={[styles.emptySubMessage, { color: textSecondary }]}>
              Try the open market below so someone can accept.
            </Text>
          </View>
        }
      />

      <View style={styles.openMarketSection}>
        <Divider style={styles.divider} />
        <Text style={[styles.orText, { color: textPrimary }]}>OR</Text>
        <StaticData
          onSelect={handleItemSelect}
          isSelected={isOpenMarketSelected}
          error={openMarketError}
        />
      </View>

      {selectionError ? (
        <Text style={[styles.selectionError, { color: themeColors.text }]}>{selectionError}</Text>
      ) : null}

      <TouchableOpacity
        style={[styles.selectedItemBanner, !isFormValid && styles.selectedItemBannerDisabled]}
        onPress={handleContinue}
        activeOpacity={0.8}
        disabled={!isFormValid}
      >
        <Text style={[styles.selectedItemText, !isFormValid && styles.selectedItemTextDisabled]}>
          Preview Final Changes
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ViewShippingOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(12),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  errorBanner: {
    marginTop: verticalScale(8),
    marginHorizontal: horizontalScale(4),
    padding: moderateScale(12),
    borderRadius: 10,
    backgroundColor: 'rgba(229, 57, 53, 0.12)',
  },
  errorBannerText: {
    color: '#C62828',
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  listContainer: {
    paddingVertical: verticalScale(12),
    paddingBottom: verticalScale(8),
  },
  cardContainer: {
    marginBottom: verticalScale(12),
    borderRadius: moderateScale(12),
  },
  selectedCardContainer: {
    borderWidth: 2,
    borderColor: '#FFAC1C',
  },
  card: {
    borderRadius: moderateScale(12),
    padding: moderateScale(14),
  },
  selectedCard: {
    borderColor: '#FFAC1C',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: verticalScale(10),
    marginBottom: verticalScale(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  organisationName: {
    flex: 1,
    fontSize: moderateScale(17),
    fontWeight: '700',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandButtonText: {
    color: '#FFAC1C',
    fontWeight: '600',
    fontSize: moderateScale(13),
  },
  minimalDetailsContainer: {
    gap: verticalScale(6),
  },
  minimalDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  minimalDetailIcon: {
    marginRight: 8,
  },
  minimalDetail: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  expandedDetailsContainer: {
    marginTop: verticalScale(12),
  },
  pricingSection: {
    borderRadius: 10,
    padding: moderateScale(12),
    gap: 8,
  },
  pricingSectionTitle: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: 4,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  pricingLabel: {
    flex: 1,
    fontSize: moderateScale(13),
  },
  pricingValue: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  totalPricingRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  totalPricingLabel: {
    fontSize: moderateScale(15),
    fontWeight: '700',
  },
  totalPricingValue: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    color: '#FFAC1C',
  },
  emptyContainer: {
    paddingVertical: verticalScale(32),
    paddingHorizontal: horizontalScale(16),
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubMessage: {
    marginTop: 8,
    fontSize: moderateScale(13),
    textAlign: 'center',
  },
  openMarketSection: {
    paddingBottom: verticalScale(8),
  },
  divider: {
    marginVertical: verticalScale(8),
  },
  orText: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: verticalScale(8),
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: moderateScale(16),
  },
  fieldError: {
    color: '#E53935',
    marginTop: 8,
    fontSize: moderateScale(12),
  },
  selectionError: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: moderateScale(13),
  },
  selectedItemBanner: {
    backgroundColor: '#FFAC1C',
    paddingVertical: verticalScale(14),
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  selectedItemBannerDisabled: {
    opacity: 0.55,
  },
  selectedItemText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: moderateScale(16),
  },
  selectedItemTextDisabled: {
    color: '#fff',
  },
});
