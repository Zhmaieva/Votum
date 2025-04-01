import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';
import { Colors } from '../../utils/colorUtils';
import { checkUsernameAvailability } from "../../shared/api/apiClient";

const AwesomeUsernameInput = ({ checkUsernameAvailability }) => {
    const [username, setUsername] = useState('');
    const [isAvailable, setIsAvailable] = useState(null);
    const charLimit = 15;

    useEffect(() => {
        if (username.length > 0) {
            debouncedCheck(username);
        } else {
            setIsAvailable(null);
        }
    }, [username]);

    const debouncedCheck = debounce(async (text) => {
        const available = await checkUsernameAvailability(text);
        setIsAvailable(available);
    }, 500);

    const handleInputChange = (text) => {
        const cleanedText = text.replace(/[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>?/`~|\\]/g, '');
        setUsername(cleanedText);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputSubContainer}>
                <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={handleInputChange}
                    placeholder="username"
                    placeholderTextColor="#999"
                    maxLength={charLimit}
                    autoCapitalize="none"
                />
                <View style={styles.icon}>
                    {isAvailable !== null && (
                        <Ionicons
                            name={isAvailable ? "checkmark" : "close"}
                            size={20}
                            color={isAvailable ? Colors.green : Colors.red}
                        />
                    )}
                </View>
            </View>
            <Text style={styles.counter}>{username.length}/{charLimit}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end'
    },
    inputSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.black,
        height: 40,
        position: 'relative',
        marginBottom: 3
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
    },
    icon: {
        marginLeft: 10,
        backgroundColor: Colors.red,
        height: 36,
        width: 36
    },
    counter: {
        fontSize: 12,
        color: Colors.grey,
        height: 20
    },
});

export default AwesomeUsernameInput;
