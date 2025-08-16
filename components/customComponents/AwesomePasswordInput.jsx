import { TextInput, View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {Colors, Fonts} from '../../utils/colorUtils';
import { getDataService } from "../../shared/common";
import { debounce } from 'lodash';

const AwesomePasswordInput = forwardRef(({ value, onChangeText, placeholder = '8 - 20 characters', isVerification = false }, ref) => {
    const [localPassword, setLocalPassword] = useState(value || '');
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrorMessage, setValidationErrorMessage] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isValid, setIsValid] = useState(null); // null | true | false

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const validatePassword = debounce((text) => {
        const valid = text.length >= 8 && text.length <= 20;
        setIsValid(valid);
        setIsChecking(false);
    }, 400);

    const validate = (text) => {
        if (isVerification) {
            onChangeText(text);
            return;
        }

        // Remove emoji
        const cleanedText = text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');

        setLocalPassword(cleanedText);
        setIsChecking(true);

        if (cleanedText.length < 8 || cleanedText.length > 20) {
            setValidationErrorMessage('Your password must be 8-20 characters');
            if (getDataService().getUser())
                getDataService().getUser().password = '';
        } else {
            setValidationErrorMessage('');
            if (getDataService().getUser())
                getDataService().getUser().password = cleanedText;
        }

        validatePassword(cleanedText); // debounce validity icon update

        if (onChangeText) {
            onChangeText(cleanedText);
        }
    };

    useImperativeHandle(ref, () => ({
        isValid: () => localPassword.length >= 8 && localPassword.length <= 20
    }));

    return (
        <View>
            <View style={styles.passwordContainer}>
                <TextInput
                    secureTextEntry={!showPassword}
                    value={value !== undefined ? value : localPassword}
                    onChangeText={validate}
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#aaa"
                />
                {
                    isVerification ? <></> :
                        <View style={styles.validationIcon}>
                            {isChecking ? (
                                <ActivityIndicator size="small" color={Colors.grey} />
                            ) : isValid !== null && (
                                <Ionicons
                                    name={isValid ? "checkmark" : "close"}
                                    size={16}
                                    color={isValid ? Colors.green : Colors.red}
                                />
                            )}
                        </View>
                }

                <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.black}
                    style={styles.icon}
                    onPress={toggleShowPassword}
                />
            </View>
            <Text style={styles.redFont}>{validationErrorMessage}</Text>
        </View>
    );
});

export default AwesomePasswordInput;

const styles = StyleSheet.create({
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.black,
        height: 40,
        paddingLeft: 8,
        paddingRight: 4,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
        backgroundColor: Colors.white,
        marginBottom: 3,
        fontFamily: Fonts.regular
    },
    input: {
        flex: 1,
        color: Colors.black,
        fontSize: 14,
        height: 40,
        paddingRight: 10,
        fontFamily: Fonts.regular
    },
    icon: {
        marginHorizontal: 3,
    },
    validationIcon: {
        width: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    redFont: {
        fontSize: 12,
        color: Colors.red,
        fontFamily: Fonts.regular
    },
});