import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import {getDataService, Logger} from "../../shared/common";
import { updateUserProfile } from "../../shared/api/apiClient";

const BioEditView = ({ navigation, route }) => {
    const { text } = route.params || {};
    const [bio, setBio] = useState(text ?? getDataService().getUser()?.bio ?? '');
    const charLimit = 30;
    const [loading, setLoading] = useState(false);

    const handleCheckBio = (text) => {
        setBio(text);
    };

    const handleSave = async () => {
        if (!bio.trim()) return;

        try {
            setLoading(true);
            await updateUserProfile({ bio });
            getDataService().getUser().bio = bio;
            getDataService().commitUserChanges();
            navigation.goBack();
        } catch (error) {
            Logger.error('Error saving bio:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <Text style={[styles.margin10, { fontFamily: Fonts.medium, fontSize: 20 }]}>Bio</Text>
                <Text style={styles.subtittle}>update your bio</Text>
                <TextInput
                    style={styles.input}
                    value={bio}
                    onChangeText={handleCheckBio}
                    maxLength={charLimit}
                />
                <Text style={styles.counter}>{bio.length}/{charLimit}</Text>
                <AwesomeButton
                    text='Save bio'
                    color={Color.BLACK}
                    additionalFunc={handleSave}
                    disabled={loading}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: Colors.black,
        borderWidth: 1,
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
        fontFamily: Fonts.regular,
    },
    counter: {
        marginTop: 5,
        fontSize: 12,
        fontFamily: Fonts.regular,
        color: Colors.grey,
        textAlign: 'right',
        marginBottom: 10
    },
    margin10: {
        marginBottom: 10
    },
    subtittle: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.grey,
        fontFamily: Fonts.regular,
    }
});

export default BioEditView;