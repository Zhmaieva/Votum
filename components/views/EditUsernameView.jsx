import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import { SafeAreaView } from 'react-native-safe-area-context';
import {getDataService, Logger} from "../../shared/common";
import { updateUserProfile } from "../../shared/api/apiClient";
import AwesomeUsernameInput from "../customComponents/AwesomeUsernameInput";
import { AwesomeModal } from "../customComponents/AwesomeModal";

const EditUsernameView = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSave = async () => {
        const username = getDataService().getUser()?.username;

        if (username === null) {
            setModalMessage("This username is already taken, please choose another one");
            setModalVisible(true);
            return;
        }

        if (!username?.trim()) {
            setModalMessage("Username cannot be empty");
            setModalVisible(true);
            return;
        }

        try {
            setLoading(true);
            const result = await updateUserProfile({ username });
            getDataService().commitUserChanges();
            navigation.goBack();
        } catch (error) {
            Logger.error('Error saving username:', error);
            setModalMessage("An error occurred, please try again later");
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['bottom']}>
            <View style={styles.container}>
                <Text style={{ fontFamily: Fonts.bold, fontSize: 20, marginBottom: 10 }}>Username</Text>
                <Text style={styles.subtittle}>update your username</Text>
                <AwesomeUsernameInput />
                <AwesomeButton
                    text='Save username'
                    color={Color.BLACK}
                    additionalFunc={handleSave}
                    disabled={loading}
                />
                <AwesomeModal
                    visible={modalVisible}
                    text="INFO MESSAGE"
                    subtext={modalMessage}
                    buttons={[
                        { label: "OK", onPress: () => setModalVisible(false) },
                    ]}
                    onBackPress={() => setModalVisible(false)}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    subtittle: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.grey,
        fontFamily: Fonts.regular,
    }
});

export default EditUsernameView;