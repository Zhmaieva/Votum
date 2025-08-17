import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, SafeAreaView, Keyboard } from 'react-native';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import { AwesomeModal } from '../customComponents/AwesomeModal';
import { Colors, Fonts } from '../../utils/colorUtils';
import { Logger } from "../../shared/common";
import { REPORT_TYPE, reportActivity } from "../../shared/api/apiClient";

const ReportBugView = () => {
    const [description, setDescription] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const descriptionInputRef = useRef<TextInput>(null);

    const handleSubmit = async () => {
        if (loading) return; // guard
        if (description.trim().length === 0) {
            setShowErrorModal(true);
            setTimeout(() => descriptionInputRef.current?.focus(), 300);
            return;
        }

        setLoading(true);
        try {
            await reportActivity(description, null, REPORT_TYPE.BUG);
            Logger.log('Bug report submitted:', description);
            setDescription('');
            Keyboard.dismiss();
            setShowSuccessModal(true);
        } catch (error) {
            Logger.error('Failed to submit bug report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Report a Bug</Text>
                <Text style={styles.subtitle}>describe the issue you encountered</Text>

                <TextInput
                    ref={descriptionInputRef}
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    maxLength={300}
                />
                <Text style={styles.charCounter}>{description.length}/300</Text>

                <View style={styles.buttonContainer}>
                    <AwesomeButton
                        text={loading ? 'Submitting…' : 'Submit'}
                        color={Color.BLACK}
                        additionalFunc={handleSubmit}
                        manual={true}
                        loading={loading}
                        disabled={loading}
                    />
                </View>

                <AwesomeModal
                    visible={showErrorModal}
                    text="DESCRIPTION REQUIRED"
                    subtext="Please enter a description before submitting"
                    buttons={[{ label: "OK", onPress: () => setShowErrorModal(false) }]}
                    onBackPress={() => setShowErrorModal(false)}
                />

                <AwesomeModal
                    visible={showSuccessModal}
                    text="REPORT SUBMITTED"
                    subtext="Thank you for your report!"
                    buttons={[{ label: "OK", onPress: () => setShowSuccessModal(false) }]}
                    onBackPress={() => setShowSuccessModal(false)}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { backgroundColor: Colors.white, flex: 1 },
    container: { padding: 15 },
    title: { fontSize: 20, fontFamily: Fonts.medium, marginBottom: 10, color: Colors.black },
    input: {
        borderWidth: 1, borderColor: Colors.black, padding: 10, minHeight: 140, textAlignVertical: 'top',
        fontSize: 14, backgroundColor: Colors.white, color: Colors.black,
        shadowColor: Colors.green, shadowOffset: { width: 2, height: 2 }, shadowOpacity: 1, shadowRadius: 0,
        fontFamily: Fonts.regular,
    },
    buttonContainer: { marginTop: 8, width: '100%' },
    charCounter: { alignSelf: 'flex-end', color: Colors.grey, fontSize: 12, marginTop: 5, fontFamily: Fonts.regular },
    subtitle: { fontSize: 14, color: Colors.grey, marginBottom: 5, fontFamily: Fonts.regular },
});

export default ReportBugView;