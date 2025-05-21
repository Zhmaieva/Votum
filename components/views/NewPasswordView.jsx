import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import { AwesomeModal } from "../customComponents/AwesomeModal";
import { VERIFICATION_FLOW_TYPE } from "../views/VerificationCodeView";
import { useNavigation } from "@react-navigation/native";

const NewPasswordView = ({ route }) => {
    const navigation = useNavigation();
    const { flowType } = route.params ?? {};

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isMismatchModalVisible, setMismatchModalVisible] = useState(false);
    const [isEmptyModalVisible, setEmptyModalVisible] = useState(false);
    const [isInvalidLengthModalVisible, setInvalidLengthModalVisible] = useState(false);

    const handleNext = () => {
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

        navigation.navigate('Verification Code Password', {
            flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD,
            password
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={[styles.margin10, { fontWeight: 'bold', fontSize: 20 }]}>New Password</Text>

                <Text style={styles.subtittle}>enter new password</Text>
                <View style={styles.margin10}>
                    <AwesomePasswordInput value={password} onChangeText={setPassword} />
                </View>

                <Text style={styles.subtittle}>confirm new password</Text>
                <View style={{marginBottom: 20}}>
                    <AwesomePasswordInput value={confirmPassword} onChangeText={setConfirmPassword} />
                </View>

                <AwesomeButton text='Next' color={Color.BLACK} additionalFunc={handleNext} />

                <AwesomeModal
                    visible={isMismatchModalVisible}
                    text="Passwords do not match"
                    subtext="Please make sure both passwords are identical."
                    onBackPress={() => setMismatchModalVisible(false)}
                />
                <AwesomeModal
                    visible={isEmptyModalVisible}
                    text="Fields required"
                    subtext="Please fill in both password fields."
                    onBackPress={() => setEmptyModalVisible(false)}
                />
                <AwesomeModal
                    visible={isInvalidLengthModalVisible}
                    text="Invalid password length"
                    subtext="Your password must be between 8 and 20 characters."
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
    },
});

export default NewPasswordView;
