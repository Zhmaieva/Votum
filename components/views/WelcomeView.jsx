import {Text, View, StyleSheet } from 'react-native';
import React, {useEffect} from 'react';
import {Colors, Fonts} from "../../utils/colorUtils";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import {getDataService} from "../../shared/common";

export default function WelcomeView () {

    useEffect(() => {
        getDataService().setUser(null);
    },[])

    return (
        <View style={styles.container}>
            <Text style={styles.messageStyle}>Welcome to VOTUM</Text>
            <View style={styles.logoStyle}/>
            <View style={{width: '100%'}}>
                <AwesomeButton text='Continue' color={Color.BLACK} screenName='Profile photo'/>
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
        fontFamily: Fonts.medium,
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