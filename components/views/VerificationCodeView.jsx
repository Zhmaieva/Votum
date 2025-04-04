import {Text, View, Pressable, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Modal} from 'react-native';
import { useState } from 'react';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import {  } from '@expo/vector-icons';
import React from 'react';
import AwesomeCodeContainer from '../customComponents/AwesomeCodeContainer';
import {Colors} from "../../utils/colorUtils";
import {AwesomeModal} from "../customComponents/AwesomeModal";
import {signUpStart, signUpVerify} from "../../shared/api/apiClient";
import {getDataService} from "../../shared/common";
import {useNavigation} from "@react-navigation/native";

export default function VerificationCodeView () {
    const[num1Input, setNum1Input] = useState()
    const[num2Input, setNum2Input] = useState()
    const[num3Input, setNum3Input] = useState()
    const[num4Input, setNum4Input] = useState()
    const[num5Input, setNum5Input] = useState()
    const[num6Input, setNum6Input] = useState()

    const[num1, setNum1] = useState('')
    const[num2, setNum2] = useState('')
    const[num3, setNum3] = useState('')
    const[num4, setNum4] = useState('')
    const[num5, setNum5] = useState('')
    const[num6, setNum6] = useState('')

    const[error, setError] = useState('')

    function getValue() {
        return `${num1}${num2}${num3}${num4}${num5}${num6}`;
    }

    function onNum1Handler(val) {
        setNum1(val ?? '');
        num2Input.focus()
    }

    function onNum2Handler(val) {
        setNum2(val ?? '');
        num3Input.focus()
    }

    function onNum3Handler(val) {
        setNum3(val ?? '');
        num4Input.focus()
    }

    function onNum4Handler(val) {
        setNum4(val ?? '');
        num5Input.focus()
    }

    function onNum5Handler(val) {
        setNum5(val ?? '');
        num6Input.focus()
    }

    function onNum6Handler(val) {
        setNum6(val ?? '');
    }

    const navigation = useNavigation();

    const [hidden, setHidden] = useState(false);

    const [seconds, setSeconds] = useState(21);

    const [isModalVisible, setModalVisible] = useState(false);


    function onResendHandler () {
        setResendColor(styles.greyFont)
        setHidden(true)
        const interval = setInterval(() => {
            setSeconds(seconds => {
                if (seconds <= 1) {//when timer ends
                    clearInterval(interval)
                    setResendColor(styles.redFont)
                    return 21
                }
                return seconds - 1;
            });
        }, 1000);
    }

    const [resendColor, setResendColor] = useState(styles.redFont)

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.centered}>
                    <View style={[styles.row, styles.equidistantElements, styles.verificationCodeContainer]}>
                        <AwesomeCodeContainer onTextInput={onNum1Handler} refOutlet={setNum1Input}/>
                        <AwesomeCodeContainer onTextInput={onNum2Handler} refOutlet={setNum2Input}/>
                        <AwesomeCodeContainer onTextInput={onNum3Handler} refOutlet={setNum3Input}/>
                        <AwesomeCodeContainer onTextInput={onNum4Handler} refOutlet={setNum4Input}/>
                        <AwesomeCodeContainer onTextInput={onNum5Handler} refOutlet={setNum5Input}/>
                        <AwesomeCodeContainer onTextInput={onNum6Handler} refOutlet={setNum6Input}/>
                    </View>
                </View>
                <View style={[styles.margin15, styles.centered]}>
                    <View style={styles.row}>
                        <View style={[styles.messageHeight, styles.row, styles.centered]}>
                            <Text style={[styles.regularFontSize, styles.fontFamily, styles.blackFont]}>If you didn't receive a code,</Text>
                        </View>
                        <View style={styles.resendButtonContainer}>
                            <Pressable onPress={()=> onResendHandler()}>
                                <Text style={[styles.regularFontSize, styles.fontFamily, resendColor]}>Resend</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={styles.timerContainer}>
                        {hidden && seconds>-1 && seconds<21
                            ? <Text style={styles.timerText}>in {seconds} second(s)</Text>
                            : <Text> </Text>
                        }
                    </View>
                </View>
                <View style={styles.margin40}>
                    <AwesomeButton text='Next' color={Color.GREEN} additionalFunc={async () => {
                        const code = getValue();
                        const email = getDataService()?.getUser()?.email ?? '';

                        const response = await signUpVerify(email, code);

                        if (response.success) {
                            navigation.navigate('Username');
                            return;
                        }

                        if (response.code === 404) {
                            setError('Incorrect verification code, try again');
                            setModalVisible(true);
                            return;
                        }

                        if (response.code === 410) {
                            setError('Code expired, request new cod');
                            setModalVisible(true);
                            return;
                        }

                        if (response.code === 403) {
                            setError('Too many tries, request new code');
                            setModalVisible(true);
                            return;
                        }
                    }} />
                </View>
            </View>
            <View style={styles.margin15}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionStyle}>Already have an account?</Text>
                </View>
                <AwesomeButton text='Log in' color={Color.BLACK} screenName='Log in' />
            </View>
            <AwesomeModal visible={isModalVisible}
                          text={error}
                          onPress={_ => {setModalVisible(false)}}
                          onBackPress={_ => {setModalVisible(false)}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 15,
        flex: 1,
        justifyContent: 'space-between'
    },
    header: {
        fontSize: 18,
        marginTop: 5
    },
    fontFamily: {
        fontFamily: 'san-serif'
    },
    empty: {
        width: 32
    },
    centered: {
        alignItems:'center'
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
    margin30: {
        marginBottom: 30,
    },
    margin20: {
        marginBottom: 20,
    },
    margin15: {
        marginBottom: 15
    },
    margin10: {
        marginBottom: 10,
    },
    greyFont: {
        color: Colors.grey
    },
    redFont: {
        color: Colors.red
    },
    backToSignInButtonContainer: {
        width: 120,
        height: 25,
        alignItems:'center',
        justifyContent: 'center',
    },
    verificationCodeContainer: {
        width: '100%'
    },
    resendButtonContainer: {
        width: 'auto',
        marginLeft: 3,
        marginRight: 3,
        alignItems:'center',
        justifyContent: 'center',
        paddingBottom: 1,
    },
    messageHeight: {
        height: 30,
    },
    timerText: {
        color: Colors.grey,
    },
    timerContainer: {
        marginTop: -5,
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    questionStyle: {
        fontSize: 14,
        color: Colors.black
    },
});