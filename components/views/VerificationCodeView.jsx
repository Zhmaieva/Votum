import {
    Text,
    View,
    StyleSheet
} from 'react-native';
import { useState, useRef } from 'react';
import React from 'react';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import AwesomeCodeContainer from '../customComponents/AwesomeCodeContainer';
import { Colors, Fonts } from '../../utils/colorUtils';
import { AwesomeModal } from '../customComponents/AwesomeModal';
import {signUpStart, signUpVerify, forgotPassword, emailVerifyCheck} from '../../shared/api/apiClient';
import { getDataService } from '../../shared/common';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const VERIFICATION_FLOW_TYPE = {
    REGISTRATION: 'REGISTRATION',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    CHANGE_EMAIL: 'CHANGE_EMAIL',
    CHANGE_PASSWORD: 'CHANGE_PASSWORD',
}

export default function VerificationCodeView({route}) {
    const { flowType } = route.params ?? {};

    const retryInterval = 60;
    const navigation = useNavigation();

    const [inputs, setInputs] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);
    const [error, setError] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [seconds, setSeconds] = useState(retryInterval);
    const [canResend, setCanResend] = useState(true);

    useFocusEffect(React.useCallback(() => {
        inputRefs.current[0]?.focus();
    }, []));

    const handlePaste = async (index, val) => {
        console.log(val);
        // If user pasted multiple chars, distribute across inputs
        if (val.length > 1) {
            const chars = val.split('').slice(0, 6);
            setInputs(chars.concat(Array(6 - chars.length).fill('')));
            // focus last input
            inputRefs.current[chars.length - 1]?.focus();
        } else {
            handleInput(index, val);
        }
    };

    const handleInput = (index, value) => {
        const updated = [...inputs];
        updated[index] = value === '.' ? updated[index] : value;
        setInputs(updated);
        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
        }
    };

    const getValue = () => inputs.join('');

    const onResendHandler = (justResetTimer = false) => {
        if (!canResend) return;
        setCanResend(false);

        if (!justResetTimer) {
            const email = getDataService()?.getUser()?.email;
            if (flowType === VERIFICATION_FLOW_TYPE.REGISTRATION)
                signUpStart(email).then(_ => {});
            else if (flowType === VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD)
                forgotPassword(email).then(_ => {});
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
    };

    const handleSubmit = async () => {
        const code = getValue();

        let email = getDataService()?.getUser()?.email ?? '';
        if (!email) {
            email = getDataService()?.getEmailToSet();
        }

        console.log('email verification code view: ', email);

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
            const response = await emailVerifyCheck(email, code);

            if (response.success) {
                getDataService().commitUserChanges();
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

        if (flowType === VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD) {
            const response = await signUpVerify(email, code);

            if (response.success) {
                navigation.navigate('New Password', { flowType: VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD })
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

    const handleBackspace = (index) => {
        if (inputs[index] === '' && index > 0) {
            const updated = [...inputs];
            updated[index - 1] = '';
            setInputs(updated);
            inputRefs.current[index - 1]?.focus();
            inputRefs.current[index - 1]?.setNativeProps({ selection: { start: 0, end: 0 } });
        } else {
            const updated = [...inputs];
            updated[index] = '';
            setInputs(updated);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View>
                    <Text style={[styles.margin10, { fontFamily: Fonts.medium, fontSize: 20 }]}>Enter verification code</Text>
                    <Text style={styles.subtittle}>check spam folder if you didn't receive a code</Text>
                    <View style={[styles.centered, styles.margin25]}>
                        <View style={[styles.row, styles.equidistantElements, styles.verificationCodeContainer]}>
                            {[...Array(6)].map((_, i) => (
                                <AwesomeCodeContainer
                                    key={i}
                                    onTextInput={val => handlePaste(i, val)}
                                    onKeyPress={({ nativeEvent }) => {
                                        if (nativeEvent.key === 'Backspace') {
                                            handleBackspace(i);
                                        }
                                    }}
                                    refOutlet={ref => inputRefs.current[i] = ref}
                                    value = {inputs[i]}
                                    maxLength={i === 5 ? 1 : 6}
                                />
                            ))}
                        </View>
                    </View>
                    <View style={styles.margin15}>
                        <AwesomeButton text='Next' color={Color.BLACK} additionalFunc={handleSubmit} />
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
                </View>
                <View>
                    {/*{
                        flowType === VERIFICATION_FLOW_TYPE.REGISTRATION ? (
                            <View style={styles.margin15}>
                                <View style={styles.questionContainer}>
                                    <Text style={styles.questionStyle}>Already have an account?</Text>
                                </View>
                                <AwesomeButton text='Log in' color={Color.WHITE} screenName='Log in' />
                            </View>
                            ) : (
                            flowType === VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD ? (
                                <View style={styles.margin15}>
                                    <AwesomeButton
                                        text='Back'
                                        color={Color.WHITE}
                                        additionalFunc={() => navigation.goBack()}
                                    />
                                </View>
                            ) : (<></>)
                        )
                    }*/}
                    <AwesomeModal
                        visible={isModalVisible}
                        text="VERIFICATION ISSUE"
                        subtext={error}
                        buttons={[
                            { label: "OK", onPress: () => setModalVisible(false) },
                        ]}
                        onBackPress={() => setModalVisible(false)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        justifyContent: 'space-between',
        height: '100%'
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
        color: Colors.black,
        fontFamily: Fonts.medium,
    },
    subtittle: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 10,
        fontFamily: Fonts.regular,
    },
    margin25: {
        marginBottom: 25
    },
    resendButtonContainer: {
        width: '100%',
        marginBottom: 2
    }
});