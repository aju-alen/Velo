import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    LayoutAnimation,
    Alert,
    TextInput,
    View,
    Text,
    useColorScheme
} from 'react-native'
import axiosInstance from '@/constants/axiosHeader'
import useShipmentStore from '@/store/shipmentStore'
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router'
import { Divider } from 'react-native-paper'
import { Colors } from '@/constants/Colors'


const StaticData = ({ onSelect, isSelected }) => {
    const [price, setPrice] = useState('');
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
    const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
    const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
    const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';

    const handleStaticPrice = () => {
        if (!price || isNaN(price) || Number(price) <= 0) {
            Alert.alert('Invalid Input', 'Please enter a valid price.');
            return;
        }
        onSelect(null, Number(price), 0, 0,'OPEN_MARKET');
    };

    const handleSetPrice = (text) => {
        console.log(text,'--__--textttttttt');
        
        setPrice(text);
        onSelect(null, Number(text), 0, 0,'OPEN_MARKET');
    };

    return (
        <TouchableOpacity
            style={[
                styles.cardContainer,
                isSelected && styles.selectedCardContainer
            ]}
            onPress={handleStaticPrice}
            activeOpacity={0.7}
        >
            <View style={[
                styles.card,
                { backgroundColor: bgCard, borderColor: borderColor },
                isSelected && styles.selectedCard
            ]}>
                <Text style={[styles.minimalDetail, { textAlign: 'center', color: textPrimary }]}>
                    Enter Your price and someone will try to match it.
                </Text>
                <TextInput
                    value={price}
                    onChangeText={(text)=>handleSetPrice(text)}
                    style={[styles.textInput, { backgroundColor: bgCard, borderColor: borderColor, color: textPrimary }]}
                    placeholder="Enter Your Price"
                    placeholderTextColor={textSecondary}
                    keyboardType="numeric"
                />
            </View>
        </TouchableOpacity>
    );
};


const OrganisationCard = ({ item, onSelect, isSelected }) => {
    const { itemType, packageDetail, deliveryServices } = useShipmentStore()
    const [expanded, setExpanded] = useState(false);
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
    const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
    const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
    const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    const calculateTotalPrice = (item) => {
        if (itemType === 'DOCUMENT') {
            return (item.documentPricePerPiece * Number(packageDetail.numberOfPieces))
        }
        else if (itemType === 'PACKAGE') {
            let packageWeightPrice = item.packagePricePerKg * Number(packageDetail.weight)
            let packagePiecePrice = item.packagePricePerPiece * Number(packageDetail.numberOfPieces)
            return (packageWeightPrice + packagePiecePrice)
        }
    }

    const calculateCollectionCharge = (item) => {
        return (calculateTotalPrice(item) * 0.1)
    }

    const calculateFinalPrice = (item) => {
        return (
            calculateTotalPrice(item) + calculateCollectionCharge(item) + 
            (deliveryServices.verbalNotification ? 10 : 0) + 
            (deliveryServices.adultSignature ? 20 : 0) + 
            (deliveryServices.directSignature ? 20 : 0)
        )
    }

    const handleCardSelect = () => {
        const finalPrice = calculateFinalPrice(item);
        const basePrice = calculateTotalPrice(item);
        const collectionPrice = calculateCollectionCharge(item);
        onSelect(item.id, finalPrice, basePrice, collectionPrice,"CLOSED_MARKET");
    }

    return (
        <TouchableOpacity 
            style={[
                styles.cardContainer, 
                isSelected && styles.selectedCardContainer
            ]} 
            onPress={handleCardSelect}
            activeOpacity={0.7}
        >
            <View style={[
                styles.card,
                { backgroundColor: bgCard, borderColor: borderColor },
                isSelected && styles.selectedCard
            ]}>
                {/* Card Header */}
                <View style={[styles.cardHeader, { borderBottomColor: borderColor }]}>
                    <Text style={[styles.organisationName, { color: textPrimary }]} numberOfLines={1}>
                        {item.organisationName || 'Unnamed Organisation'}
                    </Text>
                    <TouchableOpacity 
                        onPress={toggleExpand}
                        style={styles.expandButton}
                    >
                        <Text style={styles.expandButtonText}>
                            {expanded ? 'Show Less' : 'Show More'}
                        </Text>
                        <AntDesign 
                            name={expanded ? 'up' : 'down'} 
                            size={16} 
                            color="#FFAC1C" 
                        />
                    </TouchableOpacity>
                </View>

                {/* Minimal Initial Details */}
                <View style={styles.minimalDetailsContainer}>
                    <View style={styles.minimalDetailItem}>
                        <AntDesign name="clockcircleo" size={14} color="#555" style={styles.minimalDetailIcon} />
                        <Text style={[styles.minimalDetail, { color: textPrimary }]}>
                            Deliver within {item.deliveryTimeline || 'N/A'} days
                        </Text>
                    </View>
                    <View style={styles.minimalDetailItem}>
                        <AntDesign name="wallet" size={14} color="#555" style={styles.minimalDetailIcon} />
                        <Text style={[styles.minimalDetail, { color: textPrimary }]}>
                            Total AED {(calculateFinalPrice(item)).toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Expanded Details */}
                {expanded && (
                    <View style={styles.expandedDetailsContainer}>
                        <View style={[styles.pricingSection, { backgroundColor: bgCard }]}>
                            <Text style={[styles.pricingSectionTitle, { color: textPrimary }]}>Shipping Details</Text>
                            {itemType === 'DOCUMENT' && 
                            <View style={styles.pricingRow}>
                                <Text style={[styles.pricingLabel, { color: textPrimary }]}>Document Price</Text>
                                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                                    AED {calculateTotalPrice(item)}
                                </Text>
                            </View>
                            }
                           {itemType === 'PACKAGE' && 
                           <View style={styles.pricingRow}>
                                <Text style={[styles.pricingLabel, { color: textPrimary }]}>Package Price:</Text>
                                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                                    AED{calculateTotalPrice(item)}
                                </Text>
                            </View>
                           }
                          
                            <View style={styles.pricingRow}>
                                <Text style={[styles.pricingLabel, { color: textPrimary }]}>Collection Price</Text>
                                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                                    AED { calculateCollectionCharge(item) } 
                                </Text>
                            </View>

                            <View style={styles.pricingRow}>
                                <Text style={[styles.pricingLabel, { color: textPrimary }]}>Verbal Notification</Text>
                                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                                    AED { deliveryServices.verbalNotification? 10 : 0 } 
                                </Text>
                            </View>

                            <View style={styles.pricingRow}>
                                <Text style={[styles.pricingLabel, { color: textPrimary }]}>Adult Signature</Text>
                                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                                    AED { deliveryServices.adultSignature? 20 : 0 } 
                                </Text>
                            </View>

                            <View style={styles.pricingRow}>
                                <Text style={[styles.pricingLabel, { color: textPrimary }]}>Direct Signature</Text>
                                <Text style={[styles.pricingValue, { color: textPrimary }]}>
                                    AED { deliveryServices.directSignature? 20 : 0 } 
                                </Text>
                            </View>

                            <View style={[styles.pricingRow, styles.totalPricingRow, { borderTopColor: borderColor }]}>
                                <Text style={[styles.totalPricingLabel, { color: textPrimary }]}>Total</Text>
                                <Text style={styles.totalPricingValue}>
                                    AED {(calculateFinalPrice(item)).toFixed(2)} 
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const ViewShippingOptions = () => {
    const { itemType, setFinalShipmentData,finalShipmentData } = useShipmentStore()
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
    const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
    const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
    const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';

    const [allShippingOptions, setAllShippingOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    
    const getallShippingOptions = async () => {
        try {
            const response = await axiosInstance.get(`/api/organisation/get-all-organisation-data`)
            console.log(response.data);

            setAllShippingOptions(response.data)
            setLoading(false)
        }
        catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    useEffect(() => {
        getallShippingOptions()
    }, [])

    

    const handleItemSelect = (itemId, totalPrice, basePrice, collectionPrice,shippingMarket) => {
        console.log(itemId, totalPrice, basePrice, collectionPrice,shippingMarket,'--__--');
        
        const isSelected = selectedItem?.id === itemId;
        setSelectedItem(isSelected ? null : { id: itemId, totalPrice });
        setFinalShipmentData({
            ...finalShipmentData,
            shippingMarket,
            organisationId: itemId,
            totalPrice,
            basePrice,
            collectionPrice
        });
    };
   


    

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: themeColors.background }]}>
                <Text style={[styles.loadingText, { color: textPrimary }]}>Loading Organisations...</Text>
            </View>
        )
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.title, { color: textPrimary }]}>Shipping Options</Text>

           

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
            />
            <View>
                <Divider
                    style={{
                        marginVertical: 15,
                        backgroundColor: '#FFAC1C',
                        height: 2,
                    }}
                />
                <Text
                    style={[
                        {
                            textAlign: 'center',
                            fontSize: 22,
                            fontWeight: '700',
                            marginBottom: 10,
                        },
                        { color: textPrimary }
                    ]}
                >
                    OR
                </Text>

                <StaticData 
                    onSelect={handleItemSelect} 
                    isSelected={selectedItem === null}
                />
            </View>

            <TouchableOpacity 
                style={styles.selectedItemBanner}
                onPress={()=>router.push('/home/createShipment/finalPreview')}
            >
                <Text style={styles.selectedItemText}>
                    Preview Final Changes
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default ViewShippingOptions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 20,
        textAlign: 'center',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
    },
    listContainer: {
        paddingBottom: 20,
    },
    cardContainer: {
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    selectedCardContainer: {
        marginBottom: 15,
        shadowColor: '#FFAC1C',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 6,
    },
    card: {
        borderRadius: 12,
        padding: 15,
        borderWidth: 1,
    },
    selectedCard: {
        borderColor: '#FFAC1C',
    },
    selectedItemBanner: {
        backgroundColor: '#FFAC1C',
        padding: 10,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    selectedItemText: {
        color: 'white',
        fontWeight: '600',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
    },
    organisationName: {
        fontSize: 19,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    expandButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    expandButtonText: {
        color: '#FFAC1C',
        marginRight: 5,
        fontSize: 14,
    },
    minimalDetailsContainer: {
        flexDirection: 'column',
    },
    minimalDetailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    minimalDetailIcon: {
        marginRight: 8,
    },
    minimalDetail: {
        fontSize: 13,
    },
    expandedDetailsContainer: {
        marginTop: 15,
    },
    pricingSection: {
        borderRadius: 8,
        padding: 12,
    },
    pricingSectionTitle: {
        fontWeight: '600',
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
    },
    pricingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
        paddingVertical: 4,
    },
    totalPricingRow: {
        borderTopWidth: 1,
        paddingTop: 8,
        marginTop: 8,
    },
    pricingLabel: {
        fontSize: 13,
    },
    pricingValue: {
        fontWeight: '500',
    },
    totalPricingLabel: {
        fontSize: 15,
        fontWeight: '600',
    },
    totalPricingValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFAC1C',
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 16,
        fontSize: 15,
    },
});