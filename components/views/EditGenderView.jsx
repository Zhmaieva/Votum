import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import AwesomeSegmentedControls from '../customComponents/AwesomeSegmentedControls';

const GENDER_OPTIONS = ['male', 'female', 'non-binary', 'prefer not to say'];

export default function EditGenderView() {
    const navigation = useNavigation();
    const route = useRoute();

    const initialGender = route?.params?.currentGender || '';
    const [gender, setGender] = useState(initialGender);

    const handleSave = () => {
        // TODO: Save gender (e.g., API call or context update)
        console.log('Saved gender:', gender);
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.firstSubContainer}>
                    <Text style={styles.headerStyle}>Gender</Text>
                    <Text style={styles.subtittle}>choose your gender</Text>
                    <View style={{marginBottom: 5}}>
                        <AwesomeSegmentedControls
                            options={GENDER_OPTIONS}
                            selectedOption={gender}
                            onSelect={setGender}
                        />
                    </View>
                    <View style={styles.subContainer}>
                        <AwesomeButton text="Save" color={Color.BLACK} additionalFunc={handleSave} />
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
    },
    headerStyle: {
        fontWeight: 'bold',
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
        color: Colors.grey,
        marginBottom: 10,
        fontSize: 14
    }
});