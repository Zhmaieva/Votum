import {Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import React, {useEffect, useState} from "react";
import {Colors} from "../../utils/colorUtils";

/**
 * Shows popup modal
 *
 * @param {boolean} visible
 * @param {function} onPress
 * @param {string} text
 * @param {string} buttonText
 * @returns {JSX.Element}
 * @constructor
 */
export function AwesomeModal({visible = false, text, buttonText = 'OK', onPress = () => {}, }) {
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>{text}</Text>
                        <TouchableOpacity onPress={onPress}>
                            <Text style={styles.modalButton}>{buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
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