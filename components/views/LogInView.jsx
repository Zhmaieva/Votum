import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import AwesomeLink from "../customComponents/AwesomeLink";
import VerificationCodeView from "./VerificationCodeView";

const LogInView = ({route }) => {

    const { text } = route.params || {};

    return (
        <View style={styles.container}>
            <View>
                <View>
                    <AwesomeEmailInput />
                </View>
                <View>
                    <AwesomePasswordInput />
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text="Log in" color={Color.GREEN} />
                </View>
                <View style={[styles.margin15, styles.centeredStyle]}>
                    <AwesomeLink text='Forgot password?' screenName=''/>
                </View>
            </View>
            <AwesomeButton text="Create new account" color={Color.BLACK} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 15,
        justifyContent: "space-between"
    },
    row: {
        flexDirection: 'row'
    },
    margin15: {
        marginBottom: 15
    },
    centeredStyle: {
        alignItems: 'center'
    }
});

export default LogInView;