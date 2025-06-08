import React, { useState} from "react";
import {View, StyleSheet, TextInput, Text, SafeAreaView} from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomeLink from "../customComponents/AwesomeLink";

const RegistrationMethodView = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await login(email, password);
            if (response.success) {
                navigation.replace('Home');  // Navigate to main app once logged in
            } else {
                setError('Invalid login credentials');
            }
        } catch (e) {
            setError('Login failed. Please try again.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View>
                    <View style={styles.logoContainer}>
                        <Text style={styles.familyStyle}>Logo</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton
                            text="Register with email"
                            color={Color.BLACK}
                            screenName='Email Register' />
                    </View>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton text="Google" color={Color.WHITE} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton text="Apple" color={Color.WHITE} />
                    </View>
                </View>
                <View style={styles.margin15}>
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionStyle}>Already have an account?</Text>
                    </View>
                    <AwesomeButton text='Log in' color={Color.WHITE} screenName='Log in' />
                </View>
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
        padding: 15,
        justifyContent: 'space-between'
    },
    buttonContainer: {
        marginBottom: 18
    },
    questionContainer: {
        //alignItems: 'flex-end',
        alignItems: 'center',
        marginBottom: 10
    },
    questionStyle: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    logoContainer: {
        height: '50%',
        borderColor: Colors.green,
        borderWidth: 1.5,
        marginBottom: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row'
    },
    logInStyle: {
        fontSize: 16,
        fontFamily: Fonts.medium,
        color: Colors.black
    },
    margin15: {
        marginBottom: 15
    },
    familyStyle: {
        fontFamily: Fonts.regular,
    }
});

export default RegistrationMethodView;