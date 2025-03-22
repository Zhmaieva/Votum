import { Text, TextInput, StyleSheet, View, Animated, Easing, TouchableWithoutFeedback } from 'react-native';
import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { Colors } from '../../utils/colorUtils';

const AwesomeEmailInput = forwardRef((props, inputRef) => {
    const {
        label,
        errorText,
        value,
        style,
        onBlur,
        onFocus,
        placeholder,
        onValidChange,
        userId,
        ...restOfProps
    } = props;

    const [email, setEmail] = useState('');
    const [checkValidEmail, setCheckValidEmail] = useState(false);
    const [validationErrorMessage, setValidationErrorMessage] = useState('');

    useEffect(() => {
        async function fetchEmail() {
            try {
                const savedEmail = await getUserEmail(userId);
                if (savedEmail) setEmail(savedEmail);
            } catch (error) {
                console.error('Error fetching email:', error);
            }
        }
        fetchEmail();
    }, [userId]);

    const handleCheckEmail = async (text) => {
        let re = /\S+@\S+\.\S+/;
        let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

        setEmail(text);

        if (re.test(text) || regex.test(text)) {
            setCheckValidEmail(false);
            setValidationErrorMessage('');
            onValidChange(true);
            try {
                await saveUserEmail(userId, text);
            } catch (error) {
                console.error('Error saving email:', error);
            }
        } else {
            setCheckValidEmail(true);
            setValidationErrorMessage('Please enter a valid email address');
            onValidChange(false);
        }
    };

    const [isFocused, setIsFocused] = useState(true);
    const focusAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(focusAnim, {
            toValue: isFocused || !!value ? 1 : 0,
            duration: 150,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
            useNativeDriver: true,
        }).start();
    }, [focusAnim, isFocused, value]);

    let color = isFocused ? '#000' : '#000';
    if (errorText) {
        color = Colors.red;
    }

    return (
        <View>
            <TextInput
                style={[styles.input, { borderColor: color }]}
                ref={inputRef}
                placeholder='example@gmail.com'
                value={email}
                onChangeText={(text) => handleCheckEmail(text)}
                placeholderTextColor='#aaa'
                onBlur={(event) => {
                    setIsFocused(inputRef.current?.value);
                    onBlur?.(event);
                }}
                onFocus={(event) => {
                    setIsFocused(true);
                    onFocus?.(event);
                }}
            />
            <Text style={styles.wrongEmail}>{validationErrorMessage}</Text>
            {!!errorText && <Text style={styles.error}>{errorText}</Text>}
        </View>
    );
});

export default AwesomeEmailInput;

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
