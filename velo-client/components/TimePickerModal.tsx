import React, { useState } from 'react';
import { Modal, FlatList, Pressable, StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import useShipmentStore from '@/store/shipmentStore';
import { verticalScale, moderateScale, horizontalScale } from '@/constants/metrics';

const TimePickerModal = ({ openModal, handleCloseModal }) => {
    const { deliveryServices, setDeliveryServices } = useShipmentStore();
    const [mode, setMode] = useState('start');


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
            <ThemedView style={styles.modalContainer}>
                <ThemedView style={styles.contentContainer}>
                    <ThemedText style={styles.modalTitle}>Select {mode === 'start' ? 'Suitable' : 'Latest By'} Time</ThemedText>
                    <FlatList
                        data={timeSlots}
                        keyExtractor={(item, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <Pressable
                                style={({ pressed }) => [
                                    styles.timeSlot,
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
                                <ThemedText style={styles.timeText}>{item}</ThemedText>
                            </Pressable>
                        )}
                    />
                    <Pressable
                        style={styles.closeButton}
                        onPress={handleCloseModal}
                    >
                        <ThemedText style={styles.closeButtonText}>Close</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
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
        borderColor: '#e0e0e0',
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
