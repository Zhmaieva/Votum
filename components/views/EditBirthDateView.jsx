import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import AwesomeBirthPicker from '../customComponents/AwesomeBirthPicker';

export default function EditBirthDateView() {
    const navigation = useNavigation();
    const route = useRoute();

    const initialDate = route?.params?.currentBirthDate ? new Date(route.params.currentBirthDate) : null;
    const [dateOfBirth, setDateOfBirth] = useState(initialDate);

    const handleSave = () => {
        // TODO: Add actual save logic (API call or context/store update)
        console.log('Saved birth date:', dateOfBirth);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.firstSubContainer}>
                    <Text style={styles.headerStyle}>Birth Date</Text>
                    <Text style={styles.subtittle}>select your birth date</Text>
                    <View style={styles.margin10}>
                        <AwesomeBirthPicker dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} />
                    </View>
                    <View style={styles.subContainer}>
                        <AwesomeButton text="Save" color={Color.BLACK} onPress={handleSave} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    container: {
        padding: 15,
        flex: 1,
    },
    firstSubContainer: {
        width: '100%',
        marginBottom: 15,
    },
    headerStyle: {
        fontFamily: Fonts.medium,
        fontSize: 20,
        marginBottom: 10,
    },
    margin10: {
        marginBottom: 10,
    },
    subContainer: {
        marginTop: 20,
    },
    subtittle: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 5,
        fontFamily: Fonts.regular,
    }
});
