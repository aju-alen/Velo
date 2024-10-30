import { Button, SafeAreaView, StyleSheet, Platform, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomButton from '@/components/CustomButton';
import axios from 'axios';
import { ipURL } from '@/constants/backendUrl';
import { router, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

const setAppointment = () => {
    console.log('This is setAppointment Page');
    
    const params = useLocalSearchParams();
    console.log(params, 'params--');
    const {accountId} = params;
    
    const colorScheme = useColorScheme();
    console.log(colorScheme, 'colorScheme--');


    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(true);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const handleConfirmBooking = async () => {
        try {
            const postData = {
                appointmentDate: date,
                agentId: accountId,

            }
            const setAppointmentDate = await axios.post(`${ipURL}/api/auth/book-appointment`,postData)
            console.log(setAppointmentDate.data.agentInfo, 'setAppointmentDate--');
            await SecureStore.setItemAsync('registerDetail', JSON.stringify(setAppointmentDate.data.agentInfo))
            router.replace('/(tabs)/home')

        }
        catch (err) {
            console.log(err, 'err--');
        }
    }

    return (
        <ThemedView style={styles.container}>
            <SafeAreaView>
                <ThemedText type='title' style={{ textAlign: 'center' }}>
                    Book Appointment
                </ThemedText>
                <ThemedText type='defaultSemiBold'>
                    Select a date and time for your appointment
                </ThemedText>
                <ThemedView style={styles.dateTimeContainer}>
                    <ThemedView style={styles.buttonDateContainer}>
                        <TouchableOpacity onPress={showDatepicker} >
                            <ThemedText type='link'>Select Date</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={showTimepicker} >
                            <ThemedText type='link'>Select Time</ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode={mode}
                            is24Hour={true}
                            onChange={onChange}
                            display="spinner"
                            themeVariant={colorScheme}
                            minimumDate={new Date()}
                            maximumDate={new Date(new Date().setDate(new Date().getDate() + 365))}

                        />
                    )}

                </ThemedView>
                <ThemedText>Appointment Date {date.toLocaleString()}</ThemedText>

                <CustomButton handlePress={handleConfirmBooking} buttonText='Book Appointment' buttonWidth={300} />
            </SafeAreaView>
        </ThemedView>
    )
}

export default setAppointment

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateTimeContainer: {

        width: '100%',
        marginTop: 20
    },

    buttonDateContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20
    }
})