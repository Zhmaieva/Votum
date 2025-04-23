import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton"; // Reuse your AwesomeButton component

const EmailEditView = ({route }) => {

    const { text } = route.params || {};

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={[styles.margin10, { fontWeight: 'bold' }]}>New email</Text>
                <View style={styles.margin10}>
                    <AwesomeEmailInput value={text} bareStyle={true}/>
                </View>
                <AwesomeButton text='Send verification code' color={Color.BLACK} screenName='Verification Code' />
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
    input: {
        height: 40,
        width: '100%',
        borderColor: Colors.lightGrey,
        borderBottomWidth: 1,
        //borderTopWidth: 1,
        paddingHorizontal: 10
    },
    margin10: {
        marginBottom: 10
    }
});

export default EmailEditView;