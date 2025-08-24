import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Platform, Pressable, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from '../../utils/colorUtils';
import { getDataService } from '../../shared/common';

const AwesomeBirthPicker = ({ dateOfBirth, setDateOfBirth }) => {
    const today = useMemo(() => new Date(), []);
    const thirteenYearsAgo = useMemo(
        () => new Date(today.getFullYear() - 13, today.getMonth(), today.getDate()),
        [today]
    );
    const earliestAllowedDate = useMemo(() => new Date(1900, 0, 1), []);

    const [show, setShow] = useState(Platform.OS === 'ios');

    const safeValue =
        dateOfBirth instanceof Date && !isNaN(dateOfBirth.getTime())
            ? dateOfBirth
            : new Date(2000, 0, 1);

    const handleDateChange = (event, selected) => {
        if (Platform.OS === 'android') {
            if (event.type !== 'set') {
                setShow(false);
                return;
            }
            setShow(false);
        }

        if (selected && !isNaN(selected.getTime())) {
            const y = selected.getFullYear();
            const m = String(selected.getMonth() + 1).padStart(2, '0');
            const d = String(selected.getDate()).padStart(2, '0');
            const localDateStr = `${y}-${m}-${d}`;

            setDateOfBirth(selected);

            const ds = getDataService();
            const user = ds?.getUser ? ds.getUser() : null;
            if (user) user.birthdate = localDateStr;
        }
    };

    if (Platform.OS === 'ios') {
        return (
            <View style={styles.container}>
                <DateTimePicker
                    value={safeValue}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    maximumDate={thirteenYearsAgo}
                    minimumDate={earliestAllowedDate}
                    accentColor={Colors.green}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable onPress={() => setShow(true)} style={styles.inputLike}>
                <Text>{safeValue.toLocaleDateString()}</Text>
            </Pressable>

            {show && (
                <DateTimePicker
                    value={safeValue}
                    mode="date"
                    display="calendar"
                    onChange={handleDateChange}
                    maximumDate={thirteenYearsAgo}
                    minimumDate={earliestAllowedDate}
                />
            )}
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
    inputLike: {
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 0,
    },
});

export default AwesomeBirthPicker;
