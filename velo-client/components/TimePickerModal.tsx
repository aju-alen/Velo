import React, { useState } from 'react';
import { Modal, FlatList, Pressable, StyleSheet, View, Text, useColorScheme, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import useShipmentStore from '@/store/shipmentStore';
import { verticalScale, moderateScale, horizontalScale } from '@/constants/metrics';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

const TimePickerModal = ({ openModal, handleCloseModal }) => {
    const { deliveryServices, setDeliveryServices } = useShipmentStore();
    const [mode, setMode] = useState('start');
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];
    const bgCard = colorScheme === 'dark' ? '#181A20' : '#FFF';
    const borderColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';
    const textPrimary = colorScheme === 'dark' ? '#FFF' : '#000';
    const textSecondary = colorScheme === 'dark' ? '#B0B0B0' : '#666';

    // Function to generate time slots
    const generateTimeSlots = (start, end, interval) => {
        const times = [];
        let currentTime = start;

        while (currentTime <= end) {
            const hours = Math.floor(currentTime / 60);
            const minutes = currentTime % 60;
            const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`;
            times.push(formattedTime);
            currentTime += interval;
        }

        return times;
    };
    let timeSlots = [];
    if (mode === 'start') {
        timeSlots = generateTimeSlots(9 * 60 + 30, 17 * 60, 15); // From 9:30 AM to 5:00 PM
    }
    else {
        const [hours, minutes] = deliveryServices.deliveryPickupTimeFrom.split(":").map(Number);
        const totalMinutes = hours * 60 + minutes;
        timeSlots = generateTimeSlots(totalMinutes, 17 * 60, 15); // From 9:30 AM to 5:00 PM
    }


    return (
        <Modal
            animationType="slide"
            visible={openModal}
            onDismiss={handleCloseModal}
            transparent={true}
        >
            <TouchableWithoutFeedback onPress={handleCloseModal}>
                <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.contentContainer, { backgroundColor: bgCard }]}>
                            <View style={styles.modalHeader}>
                                <Text style={[styles.modalTitle, { color: textPrimary }]}>Select {mode === 'start' ? 'Suitable' : 'Latest By'} Time</Text>
                                <TouchableOpacity onPress={handleCloseModal}>
                                    <MaterialIcons name="close" size={24} color={textPrimary} />
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                data={timeSlots}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                style={styles.listContainer}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.timeSlot,
                                            { 
                                                backgroundColor: pressed 
                                                    ? (colorScheme === 'dark' ? 'rgba(255, 172, 28, 0.2)' : 'rgba(255, 172, 28, 0.1)')
                                                    : (colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)'),
                                                borderColor: borderColor 
                                            },
                                        ]}
                                        onPress={() => {
                                            console.log(`Selected time: ${item}`);
                                            if (mode === 'start') {
                                                setDeliveryServices({
                                                    ...deliveryServices,
                                                    deliveryPickupTimeFrom: item,
                                                })
                                                setMode('end');
                                            }
                                            else {
                                                setDeliveryServices({
                                                    ...deliveryServices,
                                                    deliveryPickupTimeTo: item,
                                                })
                                                handleCloseModal();
                                                setMode('start');
                                            }
                                        }}
                                    >
                                        <Text style={[styles.timeText, { color: textPrimary }]}>{item}</Text>
                                    </Pressable>
                                )}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        width: '90%',
        maxHeight: '70%',
        borderRadius: moderateScale(16),
        padding: moderateScale(20),
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(20),
    },
    modalTitle: {
        fontSize: moderateScale(20),
        fontWeight: '700',
        flex: 1,
    },
    listContainer: {
        maxHeight: verticalScale(400),
    },
    timeSlot: {
        paddingVertical: verticalScale(14),
        paddingHorizontal: horizontalScale(16),
        marginBottom: verticalScale(8),
        borderRadius: moderateScale(12),
        alignItems: 'center',
        borderWidth: 1,
    },
    timeText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
});

export default TimePickerModal;
