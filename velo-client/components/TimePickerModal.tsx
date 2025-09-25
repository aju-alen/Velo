import React, { useState } from 'react';
import { Modal, FlatList, Pressable, StyleSheet, View, Text, useColorScheme } from 'react-native';
import useShipmentStore from '@/store/shipmentStore';
import { verticalScale, moderateScale, horizontalScale } from '@/constants/metrics';
import { Colors } from '@/constants/Colors';

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
            <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                <View style={[styles.contentContainer, { backgroundColor: bgCard }]}>
                    <Text style={[styles.modalTitle, { color: textPrimary }]}>Select {mode === 'start' ? 'Suitable' : 'Latest By'} Time</Text>
                    <FlatList
                        data={timeSlots}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.timeSlot,
                                    { backgroundColor: bgCard, borderColor: borderColor },
                                    pressed && styles.timeSlotPressed,
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
                    <Pressable
                        style={styles.closeButton}
                        onPress={handleCloseModal}
                    >
                        <Text style={[styles.closeButtonText, { color: '#FFF' }]}>Close</Text>
                    </Pressable>
                </View>
            </View>
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
        height: '50%',
        borderRadius: moderateScale(15),
        padding: moderateScale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: moderateScale(20),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: verticalScale(15),
    },
    timeSlot: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: horizontalScale(16),
        marginBottom: verticalScale(10),
        borderRadius: moderateScale(10),
        alignItems: 'center',
        borderWidth: 1,
    },
    timeSlotPressed: {
        backgroundColor: '#d0e8fc',
    },
    timeText: {
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    closeButton: {
        marginTop: verticalScale(20),
        paddingVertical: verticalScale(12),
        alignItems: 'center',
        backgroundColor: '#FFAC1C',
        borderRadius: moderateScale(10),
    },
    closeButtonText: {
        fontSize: moderateScale(16),
        fontWeight: 'bold',
    },
});

export default TimePickerModal;
