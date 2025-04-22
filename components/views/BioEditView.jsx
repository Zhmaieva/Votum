import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import { getDataService } from "../../shared/common";
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
            console.error('Error saving bio:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={[styles.margin10, { fontWeight: 'bold' }]}>Bio</Text>
                <TextInput
                    style={styles.input}
                    value={bio}
                    onChangeText={handleCheckBio}
                    placeholder="New bio"
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
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
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
    },
    counter: {
        marginTop: 5,
        fontSize: 12,
        color: Colors.grey,
        textAlign: 'right',
        marginBottom: 10
    },
    margin10: {
        marginBottom: 10
    }
});

export default BioEditView;