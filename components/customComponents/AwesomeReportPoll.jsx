import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal
} from "@gorhom/bottom-sheet";
import { Colors } from "../../utils/colorUtils";
import { AwesomeModal } from "./AwesomeModal";

const REPORT_REASONS = [
    "Violence or Threats",
    "Harassment",
    "Explicit Content",
    "Spam",
    "Privacy Violation",
    "Illegal Activities",
    "Copyright Infringement"
];

const ReportPoll = ({ onReport }) => {
    const bottomSheetModalRef = useRef(null);
    const [selectedReason, setSelectedReason] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const { dismissAll } = useBottomSheetModal();

    const openSheet = () => {
        bottomSheetModalRef.current?.present();
    };

    const closeSheet = () => {
        dismissAll();
    };

    const handleReport = () => {
        if (!selectedReason) {
            setErrorVisible(true);
            return;
        }
        closeSheet();
        onReport?.(selectedReason);
        setModalVisible(true);
    };

    const renderReason = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSelectedReason(item)}
            style={[
                styles.reasonButton,
                selectedReason === item && styles.selectedButton
            ]}
        >
            <Text style={styles.reasonText}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <>
            <TouchableOpacity onPress={openSheet}>
                <Ionicons name="warning-outline" size={28} color={Colors.black} />
            </TouchableOpacity>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                backgroundStyle={{
                    backgroundColor: Colors.white,
                    borderTopWidth: 1,
                    borderColor: Colors.black,
                    borderRadius: 0
                }}
                enablePanDownToClose={true}
                enableDismissOnClose={true}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={styles.modalTitle}>Report this poll</Text>
                    <FlatList
                        data={REPORT_REASONS}
                        keyExtractor={(item) => item}
                        renderItem={renderReason}
                    />
                    <View style={styles.row}>
                        <TouchableOpacity onPress={closeSheet} style={styles.cancelButton}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleReport} style={styles.submitButton}>
                            <Text style={styles.submitText}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>

            {/* Error modal */}
            <AwesomeModal
                visible={errorVisible}
                text="Please select a reason to report the poll."
                buttonText="OK"
                onPress={() => setErrorVisible(false)}
                onBackPress={() => setErrorVisible(false)}
            />

            {/* Success modal */}
            <AwesomeModal
                visible={modalVisible}
                text="Report Submitted. Thank you for your feedback."
                buttonText="OK"
                onPress={() => setModalVisible(false)}
                onBackPress={() => setModalVisible(false)}
            />
        </>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: Colors.black,
        marginLeft: 9
    },
    reasonButton: {
        padding: 10,
    },
    selectedButton: {
        backgroundColor: Colors.green
    },
    reasonText: {
        fontSize: 14,
        color: Colors.black,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        marginBottom: 20
    },
    submitButton: {
        backgroundColor: Colors.green,
        padding: 10,
        alignItems: "center",
        width: '47%',
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.black,
    },
    cancelButton: {
        width: '47%',
        padding: 10,
        borderWidth: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        alignItems: "center",
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    submitText: {
        color: Colors.white
    },
    cancelText: {
        color: Colors.black
    },
});

export default ReportPoll;