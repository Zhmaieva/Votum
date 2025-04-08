import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, FlatList, StyleSheet, Alert, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../utils/colorUtils";
import { BottomSheet } from 'react-native-btr';

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
    const [sortBottomData, setSortBottomData] = useState({visible:false, eventData:null});

    const setSelectedSortOption = (option) =>  {
        setSelectedSortOption1(option)
        setSortBottomData({visible:!sortBottomData.visible, eventData: null});
    }

    const toggleBottomNavigationView = () => {
        setSortBottomData({visible:!sortBottomData.visible, eventData: null});
    };
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
            <TouchableOpacity onPress={toggleBottomNavigationView}>
                <Ionicons name="warning-outline" size={26} color={Colors.black} />
            </TouchableOpacity>
            <BottomSheet visible={sortBottomData.visible} onBackButtonPress={toggleBottomNavigationView} onBackdropPress={toggleBottomNavigationView}>
                <View style={styles.bottomNavigationView}>
                    <View style={styles.subBottomNavigation}>
                        <View style={styles.test}>

                        </View>
                    </View>
                </View>
            </BottomSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.white,
        margin: 20,
        padding: 15,
    },
    modalContent: {
        backgroundColor: Colors.white,
        padding: 20,
        alignItems: 'center'
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    test: {
        backgroundColor: Colors.yellow,
        height: 50,
        width: 50
    },
    bottomNavigationView: {
        backgroundColor: '#F2F3EE',
        width: '100%',
        height: 210,
    },
    subBottomNavigation: {
        width: '100%',
        flex: 1,
        paddingTop: 20,
        paddingRight: 10,
        paddingLeft: 10,
    },
});

export default ReportPoll;
