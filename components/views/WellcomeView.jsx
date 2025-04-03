import {Text, View, StyleSheet } from 'react-native';
import React from 'react';
import {Colors} from "../../utils/colorUtils";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";

export default function WellcomeView () {

    return (
        <View style={styles.container}>
            <Text style={styles.messageStyle}>Wellcome to [APP NAME]</Text>
            <View style={styles.logoStyle}/>
            <View style={{width: '100%'}}>
                <AwesomeButton text='Continue' color={Color.GREEN} screenName='Profile photo'/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    messageStyle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20
    },
    logoStyle: {
        height: '40%',
        width: '100%',
        borderWidth: 2,
        borderColor: Colors.green,
        marginBottom: 20
    }
});