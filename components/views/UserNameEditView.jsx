import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableWithoutFeedback, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Platform } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, {Color} from '../customComponents/AwesomeButton'; // Reuse your AwesomeButton component
import {getDataService} from "../../shared/common";

const UserNameEditView = ({ navigation, route }) => {
    const { text } = route.params || {};

    const [username, setUsername] = useState(text || '');
    const [isModalVisible, setModalVisible] = useState(false);

    const handleCheckUsername = async (text) => {
        setUsername(text);
        try {
            getDataService().getUser().userName = text;
        } catch (error) {
            console.error('Error saving username:', error);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={(text) => handleCheckUsername(text)}
                placeholder="New username"
            />
            <AwesomeButton
                text="press"
                color={Color.GREEN}
                additionalFunc={() => setModalVisible(true)} />
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>This username is already taken.</Text>
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
});

export default UserNameEditView;