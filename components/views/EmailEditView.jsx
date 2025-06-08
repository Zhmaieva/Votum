import React from 'react';
import {View, StyleSheet, SafeAreaView, Text} from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton"; // Reuse your AwesomeButton component

const EmailEditView = ({route }) => {

    const { text } = route.params || {};

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={[styles.margin10, { fontFamily: Fonts.medium, fontSize: 20 }]}>Email change</Text>
                <Text style={styles.subtittle}>enter new email</Text>
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
        paddingHorizontal: 10
    },
    margin10: {
        marginBottom: 10
    },
    subtittle: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 5,
        fontFamily: Fonts.regular,
    }
});

export default EmailEditView;