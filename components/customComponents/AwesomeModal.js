import {Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import React, {useEffect, useState} from "react";
import {Colors} from "../../utils/colorUtils";

/**
 * Shows popup modal
 *
 * @param {boolean} visible
 * @param {function} onPress
 * @param {string} text
 * @param {string} subtext
 * @param {string} buttonText
 * @param {function} onBackPress
 * @returns {JSX.Element}
 * @constructor
 */
export function AwesomeModal(
    {
        visible = false,
        text, subtext,
        buttonText = 'OK',
        onBackPress = () => {},
        secondaryText = null,
        onPress = null,
        onSecondaryPress = null,
    }) {
    return (
        <Modal visible={visible} transparent={true} animationType="fade">
            <TouchableWithoutFeedback onPress={onBackPress}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.row}>
                            <Text style={styles.modalText}>{text}</Text>
                            <Text style={styles.modalSubText}>{subtext}</Text>
                        </View>
                        {
                            !secondaryText ? (
                                <TouchableOpacity onPress={onPress ?? onBackPress}>
                                    <Text style={styles.modalButton}>{buttonText}</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.rowSecondaryButton}>
                                    <TouchableOpacity onPress={onSecondaryPress ? onSecondaryPress : onBackPress}>
                                        <Text style={styles.modalButton}>{secondaryText}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={onPress ?? onBackPress}>
                                        <Text style={styles.modalButton}>{buttonText}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
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
        backgroundColor: Colors.white,
        padding: 20,
        alignItems: 'center',
        margin: 20
    },
    modalText: {
        fontSize: 16,
        color: Colors.black
    },
    modalSubText: {
        fontSize: 16,
        color: Colors.grey
    },
    modalButton: {
        color: Colors.green,
        fontSize: 16,
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rowSecondaryButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
});