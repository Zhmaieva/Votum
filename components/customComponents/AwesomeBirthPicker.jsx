import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, {Color} from "./AwesomeButton";

const AwesomeBirthPicker = ({ dateOfBirth, setDateOfBirth }) => {
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [tempDate, setTempDate] = useState(dateOfBirth);

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    const handleSave = () => {
        setDateOfBirth(tempDate);
        setPickerVisible(false);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>{dateOfBirth ? dateOfBirth.toDateString() : 'Select Date'}</Text>
            </TouchableOpacity>
            {isPickerVisible && (
                <Modal transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <DateTimePicker
                            value={tempDate || new Date()}
                            mode="date"
                            display="spinner"
                            onChange={handleDateChange}
                        />
                        <View style={styles.buttonContainer}>
                            <AwesomeButton text='Save' color={Color.GREEN} additionalFunc={handleSave}/>
                        </View>
                        <View style={styles.buttonContainer}>
                            <AwesomeButton text='Cancel' color={Color.BLACK} additionalFunc={() => setPickerVisible(false)}/>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    dateButton: {
        padding: 10,
        backgroundColor: Colors.green,
        alignItems: 'center',
        width: '100%'
    },
    dateText: {
        color: Colors.white,
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    buttonContainer: {
        width: '83%',
        marginBottom: 15
    },
});

export default AwesomeBirthPicker;