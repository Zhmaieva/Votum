import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useFocusEffect, useNavigation, useRoute} from '@react-navigation/native';
import { Colors, Fonts } from '../../utils/colorUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import AwesomeSegmentedControls from '../customComponents/AwesomeSegmentedControls';
import {getDataService, Logger} from "../../shared/common";
import {updateGender} from "../../shared/api/apiClient";

const defaultGender = 'no answer';

const GENDER_OPTIONS = {
    'male': 1,
    'female': 2,
    'non-binary': 3,
    'no answer': 0,
}

const GENDER_OPTION_VALUES = {
    1: 'male',
    2: 'female',
    3: 'non-binary',
    0: 'no answer'
}

export default function EditGenderView() {
    const navigation = useNavigation();

    const [gender, setGender] = useState(defaultGender);

    useFocusEffect(React.useCallback(() => {
        const genderValue = GENDER_OPTION_VALUES[getDataService()?.getUser()?.gender ?? 0];
        Logger.log('View gender', genderValue);
        setGender(genderValue);
    }, []));

    const handleSave = async () => {
        if (!(getDataService()?.getUser() ?? null)) {
            getDataService().resetUserChanges();
            navigation.goBack();
            return;
        }

        getDataService().getUser().gender = GENDER_OPTIONS[gender];

        if (await updateGender()) {
            getDataService().commitUserChanges();
        } else {
            getDataService().resetUserChanges();
        }

        navigation.goBack();
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.firstSubContainer}>
                    <Text style={styles.headerStyle}>Gender</Text>
                    <Text style={styles.subtittle}>choose your gender</Text>
                    <View style={{marginBottom: 20, width: '100%'}}>
                        <AwesomeSegmentedControls
                            options={Object.keys(GENDER_OPTIONS)}
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
    container: {
        paddingBottom: 15,
        paddingRight: 15,
        paddingLeft: 15,
        flex: 1,
        justifyContent: 'center',
    },
    firstSubContainer: {
        width: '100%',
    },
    headerStyle: {
        fontSize: 24,
        fontFamily: Fonts.medium
    },
    margin10: {
        marginBottom: 10,
    },
    subContainer: {
        marginTop: 20,
    },
    subtittle: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        marginBottom: 25
    },
});