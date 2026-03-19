import React, { useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, Image, ScrollView } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import logoVotum from '../../assets/images/logoVotum.png';

const RegistrationMethodView = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View/>
                <View style={styles.logoContainer}>
                    <Image source={logoVotum} style={styles.logoImage} resizeMode="contain" />
                </View>
                <View>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton
                            text="Register with email"
                            color={Color.BLACK}
                            screenName='Email Register'
                        />
                    </View>

                    <View style={styles.questionContainer}>
                        <Text style={styles.questionStyle}>Already have an account?</Text>
                    </View>
                    <AwesomeButton text="Log in" color={Color.WHITE} screenName="Log in" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingBottom: 30,
    },
    buttonContainer: {
        marginBottom: 55,
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    questionStyle: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.medium,
        marginBottom: 5,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '55%'
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
});

export default RegistrationMethodView;