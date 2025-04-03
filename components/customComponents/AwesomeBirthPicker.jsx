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
            <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>{dateOfBirth ? dateOfBirth.toLocaleDateString() : 'Select your date of birth'}</Text>
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
        width: '100%'
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
    },
    dateButton: {
        height: 40,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.black,
        width: '100%',
        marginBottom: 15
    },
    dateText: {
        color: Colors.black,
        fontSize: 14,
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