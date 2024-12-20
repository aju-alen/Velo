import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    FlatList,
    TouchableOpacity,
    LayoutAnimation,
    Alert,
    TextInput
} from 'react-native'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import axiosInstance from '@/constants/axiosHeader'
import useShipmentStore from '@/store/shipmentStore'
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router'
import { Divider } from 'react-native-paper'


const StaticData = ({ onSelect, isSelected }) => {
    const [price, setPrice] = useState('');

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
            <ThemedView style={[
                styles.card,
                isSelected && styles.selectedCard
            ]}>
                <ThemedText style={[styles.minimalDetail, { textAlign: 'center' }]}>
                    Enter Your price and someone will try to match it.
                </ThemedText>
                <TextInput
                    value={price}
                    onChangeText={(text)=>handleSetPrice(text)}
                    style={styles.textInput}
                    placeholder="Enter Your Price"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                />
            </ThemedView>
        </TouchableOpacity>
    );
};


const OrganisationCard = ({ item, onSelect, isSelected }) => {
    const { itemType, packageDetail, deliveryServices } = useShipmentStore()
    const [expanded, setExpanded] = useState(false);

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
            <ThemedView style={[
                styles.card,
                isSelected && styles.selectedCard
            ]}>
                {/* Card Header */}
                <ThemedView style={styles.cardHeader}>
                    <ThemedText style={styles.organisationName} numberOfLines={1}>
                        {item.organisationName || 'Unnamed Organisation'}
                    </ThemedText>
                    <TouchableOpacity 
                        onPress={toggleExpand}
                        style={styles.expandButton}
                    >
                        <ThemedText style={styles.expandButtonText}>
                            {expanded ? 'Show Less' : 'Show More'}
                        </ThemedText>
                        <AntDesign 
                            name={expanded ? 'up' : 'down'} 
                            size={16} 
                            color="#FFAC1C" 
                        />
                    </TouchableOpacity>
                </ThemedView>

                {/* Minimal Initial Details */}
                <ThemedView style={styles.minimalDetailsContainer}>
                    <ThemedView style={styles.minimalDetailItem}>
                        <AntDesign name="clockcircleo" size={14} color="#555" style={styles.minimalDetailIcon} />
                        <ThemedText style={styles.minimalDetail}>
                            Deliver within {item.deliveryTimeline || 'N/A'} days
                        </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.minimalDetailItem}>
                        <AntDesign name="wallet" size={14} color="#555" style={styles.minimalDetailIcon} />
                        <ThemedText style={styles.minimalDetail}>
                            Total AED {(calculateFinalPrice(item)).toFixed(2)}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                {/* Expanded Details */}
                {expanded && (
                    <ThemedView style={styles.expandedDetailsContainer}>
                        <ThemedView style={styles.pricingSection}>
                            <ThemedText style={styles.pricingSectionTitle}>Shipping Details</ThemedText>
                            {itemType === 'DOCUMENT' && 
                            <ThemedView style={styles.pricingRow}>
                                <ThemedText style={styles.pricingLabel}>Document Price</ThemedText>
                                <ThemedText style={styles.pricingValue}>
                                    AED {calculateTotalPrice(item)}
                                </ThemedText>
                            </ThemedView>
                            }
                           {itemType === 'PACKAGE' && 
                           <ThemedView style={styles.pricingRow}>
                                <ThemedText style={styles.pricingLabel}>Package Price:</ThemedText>
                                <ThemedText style={styles.pricingValue}>
                                    AED{calculateTotalPrice(item)}
                                </ThemedText>
                            </ThemedView>
                           }
                          
                            <ThemedView style={styles.pricingRow}>
                                <ThemedText style={styles.pricingLabel}>Collection Price</ThemedText>
                                <ThemedText style={styles.pricingValue}>
                                    AED { calculateCollectionCharge(item) } 
                                </ThemedText>
                            </ThemedView>

                            <ThemedView style={styles.pricingRow}>
                                <ThemedText style={styles.pricingLabel}>Verbal Notification</ThemedText>
                                <ThemedText style={styles.pricingValue}>
                                    AED { deliveryServices.verbalNotification? 10 : 0 } 
                                </ThemedText>
                            </ThemedView>

                            <ThemedView style={styles.pricingRow}>
                                <ThemedText style={styles.pricingLabel}>Adult Signature</ThemedText>
                                <ThemedText style={styles.pricingValue}>
                                    AED { deliveryServices.adultSignature? 20 : 0 } 
                                </ThemedText>
                            </ThemedView>

                            <ThemedView style={styles.pricingRow}>
                                <ThemedText style={styles.pricingLabel}>Direct Signature</ThemedText>
                                <ThemedText style={styles.pricingValue}>
                                    AED { deliveryServices.directSignature? 20 : 0 } 
                                </ThemedText>
                            </ThemedView>

                            <ThemedView style={[styles.pricingRow, styles.totalPricingRow]}>
                                <ThemedText style={styles.totalPricingLabel}>Total</ThemedText>
                                <ThemedText style={styles.totalPricingValue}>
                                    AED {(calculateFinalPrice(item)).toFixed(2)} 
                                </ThemedText>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                )}
            </ThemedView>
        </TouchableOpacity>
    );
};

const ViewShippingOptions = () => {
    const { itemType, setFinalShipmentData,finalShipmentData } = useShipmentStore()

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
            <ThemedView style={styles.container}>
                <ThemedText style={styles.loadingText}>Loading Organisations...</ThemedText>
            </ThemedView>
        )
    }

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Shipping Options</ThemedText>

           

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
            <ThemedView>
                <Divider
                    style={{
                        marginVertical: 15,
                        backgroundColor: '#FFAC1C',
                        height: 2,
                    }}
                />
                <ThemedText
                    style={{
                        textAlign: 'center',
                        fontSize: 22,
                        fontWeight: '700',
                        marginBottom: 10,
                    }}
                >
                    OR
                </ThemedText>

                <StaticData 
                    onSelect={handleItemSelect} 
                    isSelected={selectedItem === null}
                />
            </ThemedView>

            <TouchableOpacity 
                style={styles.selectedItemBanner}
                onPress={()=>router.push('/home/createShipment/finalPreview')}
            >
                <ThemedText style={styles.selectedItemText}>
                    Preview Final Changes
                </ThemedText>
            </TouchableOpacity>
        </ThemedView>
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
        borderColor: '#e0e0e0',
        borderRadius: 10,
        padding: 16,
        fontSize: 15,
        color: '#fff',
    },
});