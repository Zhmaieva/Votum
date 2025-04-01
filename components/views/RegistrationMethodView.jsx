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
            <View>
                <View style={styles.logoContainer}>
                    <Text>Logo</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <AwesomeButton
                        text="Register with email"
                        color={Color.GREEN}
                        screenName='Email Register' />
                </View>
                <View style={styles.buttonContainer}>
                    <AwesomeButton text="Google" color={Color.BLACK} />
                </View>
                <View style={styles.buttonContainer}>
                    <AwesomeButton text="Apple" color={Color.BLACK} />
                </View>
            </View>
            <View style={styles.margin15}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionStyle}>Already have an account?</Text>
                </View>
                <AwesomeButton text='Log in' color={Color.BLACK} screenName='Log in' />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: Colors.white,
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
    },
    margin15: {
        marginBottom: 15
    }
});

export default RegistrationMethodView;