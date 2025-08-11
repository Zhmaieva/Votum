import React from 'react';
import { View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../utils/colorUtils';
import {getDataService} from "../../shared/common";

const AwesomeBirthPicker = ({ dateOfBirth, setDateOfBirth }) => {
    const today = new Date();
    const thirteenYearsAgo = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    const earliestAllowedDate = new Date(1900, 0, 1);

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const localDateStr = `${year}-${month}-${day}`;

            setDateOfBirth(selectedDate);
            console.log(localDateStr);

            if (getDataService().getUser())
                getDataService().getUser().birthdate = localDateStr;
        }
    };

    return (
        <View style={styles.container}>
            <DateTimePicker
                value={dateOfBirth || new Date(2000, 0, 1)}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                maximumDate={thirteenYearsAgo}
                minimumDate={earliestAllowedDate}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default AwesomeBirthPicker;
