import { Text, TextInput, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import {Colors, Fonts} from '../../utils/colorUtils';
import { getDataService } from "../../shared/common";

export default function AwesomeEmailInput({ value, bareStyle = false, onChangeText }) {
    const [email, setEmail] = useState(value);
    const [validationErrorMessage, setValidationErrorMessage] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleCheckEmail = async (text) => {
        let re = /\S+@\S+\.\S+/;
        let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        setEmail(text.toLowerCase());

        if (re.test(text) || regex.test(text)) {
            setValidationErrorMessage('');

            if (onChangeText)
                onChangeText(text.toLowerCase());

            try {
                getDataService().getUser().email = text;
            } catch (error) {
                console.error('Error saving email:', error);
            }

            return;
        } else {
            getDataService().getUser().email = '';
            setValidationErrorMessage('Please enter a valid email address');
        }

        if (onChangeText)
            onChangeText('');
    };

    return (
        <View>
            <TextInput
                style={[styles.input, bareStyle ? styles.bareStyleInput : styles.defaultInput]}
                //placeholder='example@gmail.com'
                value={email}
                onChangeText={(text) => handleCheckEmail(text)}
                placeholder={'example@example.com'}
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
        paddingLeft: 10,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
        fontFamily: Fonts.regular
    },
    bareStyleInput: {
        borderWidth: 1,
        borderColor: Colors.black,
        backgroundColor: Colors.white,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
        fontFamily: Fonts.regular
    },
    defaultInput: {
        borderWidth: 1,
        borderColor: Colors.black,
        fontFamily: Fonts.regular
    },
    wrongEmail: {
        fontSize: 12,
        color: Colors.red,
        marginTop: 3,
        fontFamily: Fonts.regular
    }
});