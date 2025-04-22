import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput"; // Reuse your AwesomeButton component

const PasswordView = ({route }) => {

    const { text } = route.params || {};

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={[styles.margin10, { fontWeight: 'bold' }]}>Enter your password to proceed</Text>
                <View style={styles.margin10}>
                    <AwesomePasswordInput />
                </View>
                <AwesomeButton text='Next' color={Color.BLACK} screenName='Edit email' />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    margin10: {
        marginBottom: 10
    }
});

export default PasswordView;