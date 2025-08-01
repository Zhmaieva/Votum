import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import { AwesomeModal } from "../customComponents/AwesomeModal";
import { VERIFICATION_FLOW_TYPE } from "../views/VerificationCodeView";
import { getDataService } from '../../shared/common';
import {securityCheck} from "../../shared/api/apiClient";

const PasswordView = ({ route }) => {
    const navigation = useNavigation();
    const { flowType } = route.params ?? {};

    const [password, setPassword] = useState('');
    const [showInvalidModal, setShowInvalidModal] = useState(false);

    const handleNext = async () => {
        let isValid = password?.length > 0 && password.length < 20;

        if (isValid)
            isValid = await securityCheck(password);

        if (!isValid) {
            getDataService().getUser().password = '';
            setShowInvalidModal(true);
            return;
        }

        if (flowType === VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD) {
            navigation.navigate('New Password');
        } else if (flowType === VERIFICATION_FLOW_TYPE.CHANGE_EMAIL) {
            navigation.navigate('Edit email');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {flowType === VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD ? (
                    <Text style={[styles.margin10, styles.header]}>Security Check</Text>
                ) : flowType === VERIFICATION_FLOW_TYPE.CHANGE_EMAIL ? (
                    <Text style={[styles.margin10, styles.header]}>Security Check</Text>
                ) : null}

                <Text style={styles.subtittle}>Enter password</Text>
                <View style={{ marginBottom: 18 }}>
                    <AwesomePasswordInput
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        placeholder={'Your current password'}
                        isVerification={true}
                    />
                </View>

                <AwesomeButton
                    text="Next"
                    color={Color.BLACK}
                    additionalFunc={handleNext}
                />

                <AwesomeModal
                    visible={showInvalidModal}
                    text="INVALID PASSWORD"
                    subtext="The password does not match, please try again"
                    buttons={[
                        { label: "OK", onPress: () => setShowInvalidModal(false) },
                    ]}
                    onBackPress={() => setShowInvalidModal(false)}
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
    header: {
        fontFamily: Fonts.medium,
        fontSize: 20,
    },
    subtittle: {
        fontSize: 14,
        marginBottom: 5,
        color: Colors.grey,
        fontFamily: Fonts.regular,
    },
});

export default PasswordView;