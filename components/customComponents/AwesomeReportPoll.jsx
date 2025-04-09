import React, { useRef, useState, useMemo } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Alert,
    StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
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
    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => ["40%"], []);
    const [selectedReason, setSelectedReason] = useState(null);

    const openSheet = () => {
        console.log('Tapped!');
        try {
            console.log(bottomSheetModalRef.current)
        } catch(e) {
            console.error(e);
        }
    };

    const closeSheet = () => {
        bottomSheetModalRef.current?.dismiss();
    };

    const handleReport = () => {
        if (!selectedReason) {
            Alert.alert("Please select a reason.");
            return;
        }
        closeSheet();
        onReport?.(selectedReason);
        Alert.alert("Report Submitted", "Thank you for your feedback.");
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
                index={0}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: '#fff' }}
                enablePanDownToClose={true}
            >
                <Text style={styles.modalTitle}>Report this poll</Text>
                {/*<View style={styles.contentContainer}>*/}
                {/*    /!*<Text style={styles.modalTitle}>Report this poll</Text>*/}
                {/*    <FlatList*/}
                {/*        data={REPORT_REASONS}*/}
                {/*        keyExtractor={(item) => item}*/}
                {/*        renderItem={renderReason}*/}
                {/*    />*/}
                {/*    <View style={styles.row}>*/}
                {/*        <TouchableOpacity onPress={handleReport} style={styles.submitButton}>*/}
                {/*            <Text style={styles.submitText}>Submit</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*        <TouchableOpacity onPress={closeSheet} style={styles.cancelButton}>*/}
                {/*            <Text style={styles.cancelText}>Cancel</Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*    </View>*!/*/}
                {/*</View>*/}
            </BottomSheetModal>
        </>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 20,
        height: 200,
        backgroundColor: Colors.yellow
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        fontFamily: 'arial',
        color: Colors.grey
    },
    reasonButton: {
        padding: 10,
    },
    selectedButton: {
        backgroundColor: Colors.lightGrey,
        borderRadius: 5,
    },
    reasonText: {
        fontSize: 16,
        color: Colors.grey,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    submitButton: {
        backgroundColor: Colors.green,
        padding: 10,
        alignItems: "center",
        width: '48%',
        borderRadius: 6,
    },
    cancelButton: {
        width: '48%',
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.grey,
        alignItems: "center",
        borderRadius: 6,
    },
    submitText: {
        color: Colors.white,
        fontWeight: "bold",
    },
    cancelText: {
        color: Colors.grey,
        fontWeight: "bold",
    },
});

export default ReportPoll;