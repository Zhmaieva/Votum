import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    Modal,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {signIn, signUpStart, signupStart} from "../../shared/api/apiClient";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {AwesomeModal} from "../customComponents/AwesomeModal";

const EmailRegisterView = ({route }) => {

    const [isModalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');

    const emailIsAlreadyTakenError = 'Email is already taken';
    const invalidEmailError = 'Invalid email';
    const invalidPasswordError = 'Invalid password';

    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            if (!getDataService()?.getUser())
                getDataService().setUser({});
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View>
                    <View style={styles.margin5}>
                        <Text style={[styles.headerStyle, styles.margin5]}>Email address</Text>
                        <AwesomeEmailInput />
                    </View>
                    <View style={{marginBottom: 10}}>
                        <Text style={[styles.headerStyle, styles.margin5]}>Password</Text>
                        <AwesomePasswordInput />
                    </View>
                    <View style={styles.nextButtonContainer}>
                        <AwesomeButton text="Next" color={Color.BLACK} additionalFunc={async () => {
                            const email = getDataService()?.getUser()?.email;
                            const password = getDataService()?.getUser()?.password;

                            if (!email) {
                                setError(invalidEmailError);
                                setModalVisible(true);
                                return;
                            }

                            if (!password) {
                                setError(invalidPasswordError);
                                setModalVisible(true);
                                return;
                            }

                            const response = await signUpStart(email);

                            if (response.success) {
                                navigation.navigate("Verification Code");
                                return;
                            }

                            if (response.code === 409) {
                                setError(emailIsAlreadyTakenError);
                                setModalVisible(true);
                                return;
                            }

                            if (response.code === 400) {
                                setError(invalidEmailError);
                                setModalVisible(true);
                            }
                        }} />
                    </View>
                </View>
                <View style={styles.margin15}>
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionStyle}>Already have an account?</Text>
                    </View>
                    <AwesomeButton text='Log in' color={Color.WHITE} screenName='Log in' />
                </View>
                <AwesomeModal
                    visible={isModalVisible}
                    text="ACCOUNT DETAILS ERROR"
                    subtext={error}
                    buttons={[
                        { label: "OK", onPress: () => setModalVisible(false) },
                    ]}
                    onBackPress={() => setModalVisible(false)} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        justifyContent: 'space-between',
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    logInStyle: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        color: Colors.black
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    questionStyle: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.medium,
    },
    nextButtonContainer: {
        marginBottom: 18
    },
    margin15: {
        marginBottom: 15
    },
    margin5: {
        marginBottom: 5
    },
    headerStyle: {
        fontFamily: Fonts.medium,
    }
});

export default EmailRegisterView;