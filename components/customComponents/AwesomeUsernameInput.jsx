import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';
import { Colors } from '../../utils/colorUtils';
import {checkRegisteredUsernameAvailability, checkUsernameAvailability} from "../../shared/api/apiClient";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {useFocusEffect} from "@react-navigation/native";
import {AwesomeModal} from "./AwesomeModal";

const AwesomeUsernameInput = ({ route }) => {
    const { text } = route.params || {};

    const [username, setUsername] = useState(text);
    const [isAvailable, setIsAvailable] = useState(null);
    const charLimit = 15;

    const [isModalVisible, setModalVisible] = useState(getDataService().error.usernameTaken);
    const [modalMessage, setModalMessage] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            if (text)
                setUsername(text);
        }, [])
    );

    useEffect(() => {
        debouncedCheck();
    }, [username]);

    const debouncedCheck = debounce(async () => {
        const name = username;
        const available = name ? (getDataService()?.getUser()?.userId
            ? await checkRegisteredUsernameAvailability(name)
            : await checkUsernameAvailability(name)) : false;

        if (available) {
            if (!name) {
                getDataService().getUser().username = '';
            } else {
                getDataService().getUser().username = name;
            }
        } else {
            if (!name) {
                getDataService().getUser().username = '';
            } else {
                getDataService().getUser().username = null;
            }
        }

        setIsAvailable(available);
    }, 500);

    const handleInputChange = (text) => {
        const cleanedText = text.replace(/[^A-Za-z0-9._\-!@#$%^&*()+=\[\]{};:'",<>?/`~|\\]/g, '');
        const collapsed = cleanedText
            .replace(/[^A-Za-z0-9._-]/g, '')
            .replace(/[-_.]{2,}/g, match => match[0]);
        setUsername(collapsed);
    };

    useEffect(() => {
        function handleErrorChange(errorState) {
            if (!errorState) return; // Ensure errorState is not undefined

            if (errorState.usernameEmpty) {
                setModalMessage('Username cannot be empty.');
                setModalVisible(true);
            } else if (errorState.usernameTaken) {
                setModalMessage('This username is already taken.');
                setModalVisible(true);
            }
        }

        globalEventEmitter.on('errorChanged', handleErrorChange);

        return () => {
            globalEventEmitter.off('errorChanged', handleErrorChange);
        };
    }, []);

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
            <AwesomeModal visible={isModalVisible}
                          text={modalMessage}
                          onPress={_ => {setModalVisible(false)}}
                          onBackPress={_ => {setModalVisible(false)}}/>
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
