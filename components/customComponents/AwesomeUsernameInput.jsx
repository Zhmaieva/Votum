import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { debounce } from 'lodash';
import { Colors, Fonts } from '../../utils/colorUtils';
import { checkRegisteredUsernameAvailability, checkUsernameAvailability } from "../../shared/api/apiClient";
import { getDataService, globalEventEmitter } from "../../shared/common";
import { useFocusEffect } from "@react-navigation/native";
import { AwesomeModal } from "./AwesomeModal";

const AwesomeUsernameInput = ({ route }) => {
    const { text } = route?.params || {};

    const [username, setUsername] = useState(text);
    const [isAvailable, setIsAvailable] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const charLimit = 15;

    const [isModalVisible, setModalVisible] = useState(getDataService().error.usernameTaken);
    const [modalMessage, setModalMessage] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            const user = getDataService().getUser();
            const actualUsername = user?.username || '';

            setUsername(actualUsername);
            setIsAvailable(null);
            setModalVisible(false);
            setModalMessage('');

        }, [])
    );

    const debouncedCheck = debounce(async (name) => {
        setIsChecking(true);

        const available = name
            ? (getDataService()?.getUser()?.userId
                ? await checkRegisteredUsernameAvailability(name)
                : await checkUsernameAvailability(name))
            : false;

        if (available) {
            if (!name) {
                getDataService().getUser().username = '';
            } else {
                setIsAvailable(true);
                getDataService().getUser().username = name;
                setIsChecking(false);
                return;
            }
        } else {
            if (!name) {
                getDataService().getUser().username = '';
            } else {
                getDataService().getUser().username = null;
            }
        }

        setIsAvailable(false);
        setIsChecking(false); // End loading spinner
    }, 500);

    const handleInputChange = (text) => {
        const cleanedText = text
            .toLowerCase()
            .replace(/[^a-z0-9._]/g, '');
        setUsername(cleanedText);
        debouncedCheck(cleanedText);
    };

    useEffect(() => {
        function handleErrorChange(errorState) {
            if (!errorState) return;

            if (errorState.usernameEmpty) {
                setModalMessage('Username cannot be empty');
                setModalVisible(true);
            } else if (errorState.usernameTaken) {
                setModalMessage('This username is already taken');
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
                    placeholderTextColor="#999"
                    maxLength={charLimit}
                    autoCapitalize="none"
                />
                <View style={styles.icon}>
                    {isChecking ? (
                        <ActivityIndicator size="small" color={Colors.grey} />
                    ) : isAvailable !== null && (
                        <Ionicons
                            name={isAvailable ? "checkmark" : "close"}
                            size={16}
                            color={isAvailable ? Colors.green : Colors.red}
                        />
                    )}
                </View>
            </View>
            <Text style={styles.counter}>{username?.length ?? 0}/{charLimit}</Text>
            <AwesomeModal
                visible={isModalVisible}
                text="USERNAME ISSUE"
                subtext={modalMessage}
                buttons={[
                    { label: "OK", onPress: () => setModalVisible(false) },
                ]}
                onBackPress={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-end',
        backgroundColor: Colors.white
    },
    inputSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.black,
        height: 40,
        position: 'relative',
        marginBottom: 5,
        backgroundColor: Colors.white,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontFamily: Fonts.regular
    },
    icon: {
        marginLeft: 10,
        marginRight: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counter: {
        fontSize: 12,
        color: Colors.grey,
        marginBottom: 10,
        fontFamily: Fonts.regular
    },
});

export default AwesomeUsernameInput;
