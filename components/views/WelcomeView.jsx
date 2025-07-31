import {Text, View, StyleSheet, Image, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, Fonts} from "../../utils/colorUtils";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import {getDataService} from "../../shared/common";
import logoVotum from '../../assets/images/logoVotum.png';

export default function WelcomeView () {

    useEffect(() => {
        getDataService().setUser(null);
    },[])

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.messageStyle}>Hey there!</Text>
                <View style={styles.logoContainer}>
                    <Image source={logoVotum} style={styles.logoStyle} resizeMode="contain" />
                </View>
                <AwesomeButton text='Continue' color={Color.BLACK} screenName='Profile photo'/>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 30,
        paddingTop: 15,
        justifyContent: 'center',
    },
    messageStyle: {
        fontSize: 22,
        fontFamily: Fonts.medium,
        alignSelf: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '46%'
    },
    logoStyle: {
        width: '100%',
        height: '100%',
    },
});
