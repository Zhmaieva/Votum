import {
    Text,
    View,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import { useState, useRef } from 'react';
import React from 'react';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import AwesomeCodeContainer from '../customComponents/AwesomeCodeContainer';
import { Colors } from '../../utils/colorUtils';
import { AwesomeModal } from '../customComponents/AwesomeModal';
import { signUpStart, signUpVerify } from '../../shared/api/apiClient';
import { getDataService } from '../../shared/common';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export const VERIFICATION_FLOW_TYPE = {
    REGISTRATION: 'REGISTRATION',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    CHANGE_EMAIL: 'CHANGE_EMAIL',
    CHANGE_PASSWORD: 'CHANGE_PASSWORD',
}

export default function VerificationCodeView({route}) {
    const { flowType } = route.params ?? {};

    const retryInterval = 61;
    const navigation = useNavigation();

    const [inputs, setInputs] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);
    const [error, setError] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [seconds, setSeconds] = useState(retryInterval);
    const [canResend, setCanResend] = useState(true);

    const handleInput = (index, value) => {
        const updated = [...inputs];
        updated[index] = value;
        setInputs(updated);
        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const getValue = () => inputs.join('');

    const onResendHandler = (justResetTimer = false) => {
        if (!canResend) return;
        setCanResend(false);


        if (flowType === VERIFICATION_FLOW_TYPE.REGISTRATION) {
            if (!justResetTimer) {
                const email = getDataService()?.getUser()?.email;
                signUpStart(email);
            }

            const interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        setCanResend(true);
                        return retryInterval;
                    }
                    return prev - 1;
                });
            }, 1000);
            return;
        }
    };

    const handleSubmit = async () => {
        const code = getValue();
        const email = getDataService()?.getUser()?.email ?? '';

        if (flowType === VERIFICATION_FLOW_TYPE.REGISTRATION) {
            const response = await signUpVerify(email, code);

            if (response.success) {
                navigation.navigate('Username');
                return;
            }

            const errorMessages = {
                404: 'Incorrect verification code, try again',
                410: 'Code expired, request new code',
                403: 'Too many tries, request new code'
            };

            setError(errorMessages[response.code] || 'Unknown error');
            setModalVisible(true);
        }

        if (flowType === VERIFICATION_FLOW_TYPE.CHANGE_EMAIL) {
            const response = await signUpVerify(email, code);

            if (response.success) {
                navigation.navigate('Success email');
                return;
            }

            const errorMessages = {
                404: 'Incorrect verification code, try again',
                410: 'Code expired, request new code',
                403: 'Too many tries, request new code'
            };

            setError(errorMessages[response.code] || 'Unknown error');
            setModalVisible(true);
        }

        if (flowType === VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD) {
            const response = await signUpVerify(email, code);

            if (response.success) {
                navigation.navigate('Success password');
                return;
            }

            const errorMessages = {
                404: 'Incorrect verification code, try again',
                410: 'Code expired, request new code',
                403: 'Too many tries, request new code'
            };

            setError(errorMessages[response.code] || 'Unknown error');
            setModalVisible(true);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View>
                    <Text style={[styles.margin10, { fontWeight: 'bold', fontSize: 20 }]}>Enter verification code</Text>
                    <Text style={styles.subtittle}>check spam folder if you didn't receive a code</Text>
                    <View style={[styles.centered, styles.margin25]}>
                        <View style={[styles.row, styles.equidistantElements, styles.verificationCodeContainer]}>
                            {[...Array(6)].map((_, i) => (
                                <AwesomeCodeContainer
                                    key={i}
                                    onTextInput={val => handleInput(i, val)}
                                    refOutlet={ref => inputRefs.current[i] = ref}
                                />
                            ))}
                        </View>
                    </View>
                    <View style={[styles.margin15, styles.centered]}>
                        <View style={styles.resendButtonContainer}>
                            <AwesomeButton
                                text={canResend ? 'Resend code now' : `Resend in ${seconds}s`}
                                color={Color.WHITE}
                                additionalFunc={canResend ? () => onResendHandler() : null}
                                disabled={!canResend}
                            />
                        </View>
                    </View>
                    <View style={styles.margin40}>
                        <AwesomeButton text='Next' color={Color.BLACK} additionalFunc={handleSubmit} />
                    </View>
                </View>
                <View>
                    {
                        flowType === VERIFICATION_FLOW_TYPE.REGISTRATION ? (
                            <View style={styles.margin15}>
                                <View style={styles.questionContainer}>
                                    <Text style={styles.questionStyle}>Already have an account?</Text>
                                </View>
                                <AwesomeButton text='Log in' color={Color.WHITE} screenName='Log in' />
                            </View>
                            ) : (<></>)
                    }
                    <AwesomeModal
                        visible={isModalVisible}
                        text={error}
                        onPress={() => setModalVisible(false)}
                        onBackPress={() => setModalVisible(false)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    container: {
        padding: 15,
        justifyContent: 'space-between',
        height: '100%'
    },
    fontFamily: {
        fontFamily: 'san-serif'
    },
    centered: {
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row'
    },
    equidistantElements: {
        justifyContent: 'space-between'
    },
    regularFontSize: {
        fontSize: 14
    },
    margin40: {
        marginBottom: 40,
    },
    margin15: {
        marginBottom: 15
    },
    margin10: {
        marginBottom: 10
    },
    verificationCodeContainer: {
        width: '100%'
    },
    messageHeight: {
        height: 30,
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    questionStyle: {
        fontSize: 14,
        color: Colors.black
    },
    subtittle: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 10
    },
    margin25: {
        marginBottom: 25
    },
    resendButtonContainer: {
        width: '100%',
        marginBottom: 2
    }
});