import { Text, TextInput, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../utils/colorUtils';
import { getDataService } from "../../shared/common";

export default function AwesomeEmailInput({ value, bareStyle = false }) {
    const [email, setEmail] = useState(value);
    const [validationErrorMessage, setValidationErrorMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleCheckEmail = async (text) => {
        let re = /\S+@\S+\.\S+/;
        let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        setEmail(text);

        if (re.test(text) || regex.test(text)) {
            setValidationErrorMessage('');
            try {
                getDataService().getUser().email = text;
            } catch (error) {
                console.error('Error saving email:', error);
            }
        } else {
            setValidationErrorMessage('Please enter a valid email address');
        }
    };

    return (
        <View>
            <TextInput
                style={[styles.input, bareStyle ? styles.bareStyleInput : styles.defaultInput]}
                placeholder='example@gmail.com'
                value={email}
                onChangeText={(text) => handleCheckEmail(text)}
                placeholderTextColor='#aaa'
                onFocus={() => setIsFocused(true)}
            />
            <Text style={styles.wrongEmail}>{validationErrorMessage}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        paddingVertical: 10,
        paddingRight: 10,
        fontSize: 14,
        width: '100%',
        height: 40,
        backgroundColor: Colors.white,
        paddingLeft: 10
    },
    bareStyleInput: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
    },
    defaultInput: {
        borderWidth: 1,
        borderColor: Colors.black
    },
    wrongEmail: {
        fontSize: 12,
        color: Colors.red,
        marginBottom: 3
    }
});