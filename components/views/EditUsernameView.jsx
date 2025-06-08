import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import { getDataService } from "../../shared/common";
import { updateUserProfile } from "../../shared/api/apiClient";
import AwesomeUsernameInput from "../customComponents/AwesomeUsernameInput";
import { AwesomeModal } from "../customComponents/AwesomeModal";

const EditUsernameView = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleSave = async () => {
        const username = getDataService().getUser()?.username;

        if (!username?.trim()) {
            setModalMessage("Username cannot be empty");
            setModalVisible(true);
            return;
        }

        try {
            setLoading(true);
            const result = await updateUserProfile({ username });

            if (result?.errorCode === 'USERNAME_TAKEN') {
                setModalMessage("This username is already taken, please choose another one");
                setModalVisible(true);
                return;
            }

            if (result?.errorCode === 'USERNAME_COOLDOWN') {
                setModalMessage("You can only change your username once every 14 days, please try again later");
                setModalVisible(true);
                return;
            }

            getDataService().commitUserChanges();
            navigation.goBack();
        } catch (error) {
            console.error('Error saving username:', error);
            setModalMessage("An error occurred, please try again later");
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={{ fontFamily: Fonts.regular, fontSize: 20, marginBottom: 10 }}>Username</Text>
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
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        padding: 15,
    },
    margin10: {
        marginBottom: 8,
    },
    subtittle: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.grey,
        fontFamily: Fonts.regular,
    }
});

export default EditUsernameView;