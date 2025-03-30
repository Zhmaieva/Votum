import React, { useState} from "react";
import { View, StyleSheet, TextInput, Text } from 'react-native';
import { Colors } from '../../utils/colorUtils';
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
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text>Logo</Text>
            </View>
            <View style={styles.buttonContainer}>
                <AwesomeButton
                    text="Register with email"
                    color={Color.BLACK}
                    screenName='Email Register' />
            </View>
            <View style={styles.buttonContainer}>
                <AwesomeButton text="Google" color={Color.GREEN} />
            </View>
            <View style={styles.buttonContainer}>
                <AwesomeButton text="Apple" color={Color.GREEN} />
            </View>
            <View style={[styles.questionContainer, styles.row]}>
                <Text style={styles.questionStyle}>Already have an account?</Text>
                <AwesomeLink text='Log in' screenName='Log in' />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: Colors.white,
    },
    buttonContainer: {
        marginBottom: 18
    },
    questionContainer: {
        justifyContent: 'center',
        //alignItems: 'flex-end'
    },
    questionStyle: {
        fontSize: 16,
        color: Colors.black
    },
    logoContainer: {
        height: '45%',
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
        fontWeight: "bold",
        color: Colors.black
    }
});

export default RegistrationMethodView;