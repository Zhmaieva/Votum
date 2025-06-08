import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import React from "react";
import {Colors, Fonts} from "../../utils/colorUtils";

/**
 * Shows a customizable modal with 1 or 2 buttons
 *
 * @param {boolean} visible - Whether the modal is visible
 * @param {string} text - Main text
 * @param {string} subtext - Optional subtext
 * @param {function} onBackPress - Called when background is pressed
 * @param {{ label: string, onPress: function }[]} buttons - 1 or 2 buttons with label and onPress
 */
export function AwesomeModal({
                                 visible = false,
                                 text,
                                 subtext,
                                 onBackPress = () => {},
                                 buttons = [],
                             }) {
    const renderButtons = () => {
        if (!buttons || buttons.length === 0) return null;

        if (buttons.length === 1) {
            return (
                <TouchableOpacity onPress={buttons[0].onPress ?? onBackPress}>
                    <Text style={styles.modalButton}>{buttons[0].label}</Text>
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.rowSecondaryButton}>
                {buttons.map((btn, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={btn.onPress ?? onBackPress}
                        style={{ flex: 1, alignItems: idx === 0 ? "flex-start" : "flex-end" }}
                    >
                        <Text style={styles.modalButton}>{btn.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <TouchableWithoutFeedback onPress={onBackPress}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalBackgroundContainer}>
                        <View style={styles.modalContainer}>
                            <View style={styles.row}>
                                <Text style={styles.modalText}>{text}</Text>
                                {subtext ? <Text style={styles.modalSubText}>{subtext}</Text> : null}
                            </View>
                        </View>
                        <View style={styles.line}/>
                        <View style={styles.lineGreen}/>
                        <View style={styles.modalContainer}>
                            {renderButtons()}
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalBackgroundContainer: {
        width: '84%'
    },
    modalContainer: {
        backgroundColor: Colors.white,
        padding: 15,
        alignItems: "center",
    },
    modalText: {
        fontSize: 16,
        color: Colors.black,
        textAlign: "center",
        fontFamily: Fonts.medium,
        marginBottom: 10
    },
    modalSubText: {
        fontSize: 14,
        color: Colors.grey,
        textAlign: "center",
        marginBottom: 5,
        fontFamily: Fonts.regular,
    },
    modalButton: {
        color: Colors.green,
        fontSize: 16,
        fontFamily: Fonts.medium
    },
    row: {
        alignItems: "center",
        justifyContent: "center",
    },
    rowSecondaryButton: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    line: {
        height: 1,
        width: "100%",
        backgroundColor: Colors.black,
        shadowRadius: 0,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    lineGreen: {
        backgroundColor: Colors.green,
        height: 2,
        width: "100%",
    }
});