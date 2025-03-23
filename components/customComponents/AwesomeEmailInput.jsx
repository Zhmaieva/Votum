import { Text, TextInput, StyleSheet, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Colors } from '../../utils/colorUtils';
import {updateUserProfile} from "../../shared/api/apiClient";
import {getDataService} from "../../shared/common";

export default function AwesomeEmailInput({value}) {
    const [email, setEmail] = useState(value);
    const [validationErrorMessage, setValidationErrorMessage] = useState('');

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

    const [isFocused, setIsFocused] = useState(true);

    let color = isFocused ? '#000' : '#000';

    return (
        <View>
            <TextInput
                style={[styles.input, { borderColor: color }]}
                placeholder='example@gmail.com'
                value={email}
                onChangeText={(text) => handleCheckEmail(text)}
                placeholderTextColor='#aaa'
                onFocus={(event) => {
                    setIsFocused(true);
                }}
            />
            <Text style={styles.wrongEmail}>{validationErrorMessage}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightGrey,
        color: Colors.black,
        paddingVertical: 10,
        paddingRight: 10,
        fontSize: 14,
        width: '100%',
        height: 40,
        fontFamily: 'san-serif',
        backgroundColor: Colors.white,
        paddingLeft: 10
    },
    wrongEmail: {
        marginTop: 2,
        marginLeft: 10,
        fontSize: 12,
        color: Colors.red,
        fontFamily: 'san-serif',
    }
});
