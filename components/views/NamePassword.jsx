import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import AwesomeLink from "../customComponents/AwesomeLink";
import VerificationCodeView from "./VerificationCodeView";
import AwesomeUsernameInput from "../customComponents/AwesomeUsernameInput";
import { checkUsernameAvailability } from "../../shared/api/apiClient";

const NamePasswordView = ({route }) => {

    const { text } = route.params || {};

    return (
        <View style={styles.container}>
            <View>
                <AwesomeUsernameInput checkUsernameAvailability={checkUsernameAvailability} />
                <AwesomePasswordInput />
                <View style={styles.nextButtonContainer}>
                    <AwesomeButton text="Create account" color={Color.GREEN} screenName='Username and password' />
                </View>
            </View>
            <View style={styles.margin15}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionStyle}>Already have an account?</Text>
                </View>
                <AwesomeButton text='Log in' color={Color.BLACK} screenName='Log in' />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 15,
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row'
    },
    logInStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.black
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    questionStyle: {
        fontSize: 14,
        color: Colors.black
    },
    nextButtonContainer: {
        marginBottom: 18
    },
    margin15: {
        marginBottom: 15
    },
});

export default NamePasswordView;