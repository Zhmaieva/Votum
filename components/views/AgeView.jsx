// AgeView.tsx
import { Text, View, StyleSheet, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useMemo, useState } from 'react';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import AwesomeBirthPicker from '../customComponents/AwesomeBirthPicker';
import { getDataService } from '../../shared/common';
import { useNavigation } from '@react-navigation/native';
import { updateBirthdate } from '../../shared/api/apiClient';

// Parse any incoming value into a safe Date for Android
// put this above your component in AgeView.jsx
function toValidDate(input) {
    const fallback = new Date();

    if (!input) return fallback;

    if (input instanceof Date && !isNaN(input.getTime())) return input;

    if (typeof input === 'number') {
        const d = new Date(input);
        return isNaN(d.getTime()) ? fallback : d;
    }

    if (typeof input === 'string') {
        // turn "YYYY-MM-DD" into ISO midnight UTC to avoid Android parsing quirks
        const iso = /^\d{4}-\d{2}-\d{2}$/.test(input) ? `${input}T00:00:00Z` : input;
        const d = new Date(iso);
        return isNaN(d.getTime()) ? fallback : d;
    }

    return fallback;
}

export default function AgeView() {
    const navigation = useNavigation();
    const [dateOfBirth, setDateOfBirth] = useState(null);

    // sensible bounds: 120 years ago..today
    const maxDate = useMemo(() => new Date(), []);
    const minDate = useMemo(() => {
        const d = new Date();
        d.setFullYear(d.getFullYear() - 120);
        return d;
    }, []);

    useEffect(() => {
        const raw = getDataService()?.getUser()?.birthdate;
        setDateOfBirth(toValidDate(raw));
    }, []);

    const handleNext = async () => {
        try {
            if (!dateOfBirth || isNaN(dateOfBirth.getTime())) {
                Alert.alert('Invalid date', 'Please select a valid birth date.');
                return;
            }

            // If your getDataService().commitUserChanges() reads from the in-memory user,
            // make sure to write the birthdate there first:
            const ds = getDataService();
            if (ds?.getUser) {
                const user = ds.getUser();
                if (user) {
                    // store as "YYYY-MM-DD"
                    const y = dateOfBirth.getUTCFullYear();
                    const m = String(dateOfBirth.getUTCMonth() + 1).padStart(2, '0');
                    const d = String(dateOfBirth.getUTCDate()).padStart(2, '0');
                    user.birthdate = `${y}-${m}-${d}`;
                }
            }

            ds?.commitUserChanges();

            // If your API expects the date value explicitly, pass it
            // (adjust to your API's expected format)
            const y = dateOfBirth.getUTCFullYear();
            const m = String(dateOfBirth.getUTCMonth() + 1).padStart(2, '0');
            const d = String(dateOfBirth.getUTCDate()).padStart(2, '0');
            await updateBirthdate(`${y}-${m}-${d}`);

            navigation.navigate('Categories', {});
        } catch (e) {
            Alert.alert('Error', 'Could not save your birth date. Please try again.');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['bottom']}>
            <View style={styles.container}>
                <View style={styles.firstSubContainer}>
                    <Text style={styles.headerStyle}>Select Your Birth Date</Text>
                    <Text style={{ marginBottom: 15, fontFamily: Fonts.regular }}>Personalize your profile</Text>

                    <View style={styles.margin20}>
                        <AwesomeBirthPicker
                            dateOfBirth={dateOfBirth ?? new Date()}
                            setDateOfBirth={setDateOfBirth}
                            minimumDate={minDate}
                            maximumDate={maxDate}
                        />
                    </View>

                    <View style={styles.subContainer}>
                        <AwesomeButton text="Next" color={Color.BLACK} additionalFunc={handleNext} />
                    </View>
                </View>

                <View style={styles.secondSubContainer}>
                    <AwesomeButton text="Skip" color={Color.WHITE} screenName="Categories" />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15, flex: 1, justifyContent: 'center' },
    firstSubContainer: { width: '100%', marginBottom: 15 },
    secondSubContainer: { width: '100%' },
    headerStyle: { fontSize: 24, fontFamily: Fonts.medium, marginBottom: 2 },
    margin20: { marginBottom: 15 },
    subContainer: {},
});