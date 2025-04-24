import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    Text
} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import { AwesomeModal } from "../customComponents/AwesomeModal";
import { signUpStart } from "../../shared/api/apiClient";
import { getDataService } from "../../shared/common";

const ForgotPasswordView = ({ navigation, route }) => {
    const { text } = route.params || {};
    const [email, setEmail] = useState(text ?? '');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const handleResetPassword = async () => {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            setModalMessage("Please enter your email address.");
            setModalVisible(true);
            return;
        }

        try {
            const res = await signUpStart(trimmedEmail);

            if (res?.success) {
                getDataService().getUser().email = trimmedEmail;
                navigation.navigate('Verification Code');
            } else {
                throw new Error();
            }
        } catch (error) {
            setModalMessage("This email address is not registered. Try again.");
            setModalVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.headerStyle}>Email address</Text>
                    <View style={styles.margin10}>
                        <AwesomeEmailInput bareStyle={false} value={email} onChangeText={setEmail} />
                    </View>
                    <View style={styles.margin15}>
                        <AwesomeButton text="Reset Your Password" color={Color.BLACK} additionalFunc={handleResetPassword}  />
                    </View>
                </View>
                <View style={styles.margin15}>
                    <View style={styles.margin15}>
                        <AwesomeButton text="Create new account" color={Color.BLACK} screenName='Email Register' />
                    </View>
                    <AwesomeButton text='Log in' color={Color.WHITE} screenName='Log in' />
                </View>

                <AwesomeModal
                    visible={modalVisible}
                    text={modalMessage}
                    onPress={() => setModalVisible(false)}
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
        flex: 1,
        padding: 15,
        justifyContent: "space-between"
    },
    margin15: {
        marginBottom: 15
    },
    margin10: {
        marginBottom: 7
    },
    headerStyle: {
        fontWeight: 'bold',
        marginBottom: 5
    },
});

export default ForgotPasswordView;