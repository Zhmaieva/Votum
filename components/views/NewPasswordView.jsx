import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import { AwesomeModal } from "../customComponents/AwesomeModal";
import { VERIFICATION_FLOW_TYPE } from "../views/VerificationCodeView";
import { useNavigation } from "@react-navigation/native";
import {globalEventEmitter} from "../../shared/common";
import {resetPassword, updatePassword} from "../../shared/api/apiClient";

const NewPasswordView = ({ route }) => {
    const navigation = useNavigation();
    const { flowType } = route.params ?? {};

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isGenericErrorVisible, setGenericErrorVisible] = useState(false);
    const [isMismatchModalVisible, setMismatchModalVisible] = useState(false);
    const [isEmptyModalVisible, setEmptyModalVisible] = useState(false);
    const [isInvalidLengthModalVisible, setInvalidLengthModalVisible] = useState(false);

    const handleNext = async () => {
        if (!password || !confirmPassword) {
            setEmptyModalVisible(true);
            return;
        }

        if (password.length < 8 || password.length > 20) {
            setInvalidLengthModalVisible(true);
            return;
        }

        if (password !== confirmPassword) {
            setMismatchModalVisible(true);
            return;
        }

        if (flowType === VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD) {
            const { success } = await resetPassword(password);
            if (!success) {
                setGenericErrorVisible(true);
                return;
            }
            navigation.navigate('Success password');
            return;
        }

        if (flowType === VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD) {
            const { success } = await updatePassword(password);
            if (!success) {
                setGenericErrorVisible(true);
                return;
            }
            navigation.navigate('Success password settings');
        }

    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={[styles.margin10, { fontFamily: Fonts.medium, fontSize: 20 }]}>New Password</Text>

                <Text style={styles.subtittle}>enter new password</Text>
                <View style={{marginBottom: 5}}>
                    <AwesomePasswordInput value={password} onChangeText={setPassword} />
                </View>

                <Text style={styles.subtittle}>confirm new password</Text>
                <View style={{marginBottom: 10}}>
                    <AwesomePasswordInput value={confirmPassword} onChangeText={setConfirmPassword} />
                </View>

                <AwesomeButton text='Next' color={Color.BLACK} additionalFunc={handleNext} />

                <AwesomeModal
                    visible={isGenericErrorVisible}
                    text="SOMETHING WENT WRONG"
                    subtext="Please try again later"
                    buttons={[
                        { label: "OK", onPress: () => setGenericErrorVisible(false) },
                    ]}
                    onBackPress={() => setGenericErrorVisible(false)}
                />

                <AwesomeModal
                    visible={isMismatchModalVisible}
                    text="PASSWORDS DON'T MATCH"
                    subtext="Please make sure both passwords are identical"
                    buttons={[
                        { label: "OK", onPress: () => setMismatchModalVisible(false) },
                    ]}
                    onBackPress={() => setMismatchModalVisible(false)}
                />
                <AwesomeModal
                    visible={isEmptyModalVisible}
                    text="PASSWORD REQUIRED"
                    subtext="Please fill in both password fields"
                    buttons={[
                        { label: "OK", onPress: () => setEmptyModalVisible(false) },
                    ]}
                    onBackPress={() => setEmptyModalVisible(false)}
                />
                <AwesomeModal
                    visible={isInvalidLengthModalVisible}
                    text="INVALID PASSWORD LENGTH"
                    subtext="Your password must be between 8 and 20 characters"
                    buttons={[
                        { label: "OK", onPress: () => setInvalidLengthModalVisible(false) },
                    ]}
                    onBackPress={() => setInvalidLengthModalVisible(false)}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    margin10: {
        marginBottom: 10,
    },
    subtittle: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.grey,
        fontFamily: Fonts.regular,
    },
});

export default NewPasswordView;
