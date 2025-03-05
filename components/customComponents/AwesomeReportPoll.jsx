import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, Alert, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils/colorUtils";

const REPORT_REASONS = [
    "Hate Speech",
    "Violence or Threats",
    "Harassment",
    "False Information",
    "Explicit Content",
    "Spam",
    "Privacy Violation",
    "Illegal Activities",
    "Copyright Infringement",
    "Other"
];

const ReportPoll = ({ onReport }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState(null);

    const handleReport = () => {
        if (!selectedReason) {
            Alert.alert("Please select a reason");
            return;
        }
        setModalVisible(false);
        onReport(selectedReason);
        Alert.alert("Report Submitted", "Thank you for your feedback.");
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Ionicons name="warning-outline" size={26} color={Colors.grey} />
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Report this Poll</Text>

                            {/* The dropdown button */}
                            <TouchableOpacity
                                style={styles.dropdownButton}
                                onPress={() => setDropdownVisible(!dropdownVisible)}
                            >
                                <Text style={styles.dropdownText}>
                                    {selectedReason || "Select a Reason"}
                                </Text>
                            </TouchableOpacity>

                            {/* Dropdown list */}
                            {dropdownVisible && (
                                <FlatList
                                    data={REPORT_REASONS}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.reasonButton,
                                                selectedReason === item && styles.selectedButton
                                            ]}
                                            onPress={() => {
                                                setSelectedReason(item);
                                                setDropdownVisible(false); // Close dropdown after selection
                                            }}
                                        >
                                            <Text style={styles.reasonText}>{item}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                            <View style={[styles.row, styles.alignment]}>
                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.submitButton} onPress={handleReport}>
                                    <Text style={styles.submitText}>Submit</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
    },
    modalContent: {
        backgroundColor: Colors.white,
        width: "100%",
        height: 'auto',
        padding: 10,
        justifyContent: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        fontFamily: 'arial',
        color: Colors.grey
    },
    dropdownButton: {
        padding: 10,
        backgroundColor: Colors.white,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#888',
    },
    dropdownText: {
        fontSize: 16,
        color: Colors.grey,
        fontFamily: 'arial',
        //fontWeight: 'bold'
    },
    reasonButton: {
        padding: 10,
        //borderBottomWidth: 1,
        //borderBottomColor: '#fff',
    },
    selectedButton: {
        borderColor: '#888',
        borderWidth: 1,
    },
    reasonText: {
        fontSize: 16,
        color: Colors.grey,
    },
    submitButton: {
        backgroundColor: Colors.green,
        padding: 10,
        alignItems: "center",
        marginTop: 10,
        width: '49%'
    },
    submitText: {
        color: Colors.white,
        fontWeight: "bold",
    },
    cancelButton: {
        width: '49%',
        borderBottomWidth: 1,
        borderColor: '#888',
        //marginTop: 10,
        alignItems: "center",
        justifyContent: 'center'
    },
    cancelText: {
        color: Colors.grey,
    },
    row: {
        flexDirection: 'row'
    },
    alignment: {
        justifyContent: 'space-between',
        marginTop: 20
    },
});

export default ReportPoll;
