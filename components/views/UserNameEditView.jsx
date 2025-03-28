import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, {Color} from '../customComponents/AwesomeButton'; // Reuse your AwesomeButton component
import {getDataService, globalEventEmitter} from "../../shared/common";

const UserNameEditView = ({ navigation, route }) => {
    const { text } = route.params || {};
    const charLimit = 15;

    const [username, setUsername] = useState(text || '');
    const [isModalVisible, setModalVisible] = useState(getDataService().error.userNameTaken);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        function handleErrorChange(errorState) {
            if (!errorState) return; // Ensure errorState is not undefined

            console.log('effect uname edit', errorState);

            if (errorState.userNameEmpty) {
                setModalMessage('Username cannot be empty.');
                setModalVisible(true);
            } else if (errorState.userNameTaken) {
                setModalMessage('This username is already taken.');
                setModalVisible(true);
            }
        }

        globalEventEmitter.on('errorChanged', handleErrorChange);

        return () => {
            globalEventEmitter.off('errorChanged', handleErrorChange);
        };
    }, []);

    const handleCheckUsername = (text) => {
        // Remove spaces between letters
        const cleanedText = text.replace(/\s+/g, '');

        // If the input is empty, allow it (you can handle empty input separately if needed)
        if (cleanedText === '') {
            // You may want to reset the username or perform some other action when empty
            setUsername('');
            getDataService().getUser().userName = '';
            return;
        }

        // Regular expression to allow only Latin letters, numbers, and special characters
        const regex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>?/`~|\\]+$/;

        // Check if the cleaned text matches the allowed pattern
        if (regex.test(cleanedText)) {
            // Update the username state with the cleaned text
            setUsername(cleanedText);

            // Update the user object with the cleaned username
            getDataService().getUser().userName = cleanedText;
        } else {
            // Handle invalid input (show error, etc.)
            console.log("Invalid username: Only letters, numbers, and allowed special characters are allowed.");
        }
    };


    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => handleCheckUsername(text)}
                placeholder="New username"
                maxLength={charLimit}
            />
            <Text style={styles.counter}>{username.length}/{charLimit}</Text>
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>{modalMessage}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButton}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: Colors.white,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: Colors.lightGrey,
        borderBottomWidth: 1,
        //borderTopWidth: 1,
        paddingHorizontal: 10
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        //borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalButton: {
        color: Colors.green,
        fontSize: 16,
        marginTop: 10,
    },
    counter: {
        marginTop: 5,
        fontSize: 14,
        color: Colors.black,
        textAlign: 'right',
        paddingRight: 10,
    },
});

export default UserNameEditView;