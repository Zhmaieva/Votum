import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import { AwesomeModal } from '../customComponents/AwesomeModal';

const ContactInformationView = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');

    const openLink = async (url, successMessage) => {
        try {
            await Linking.openURL(url);
            setModalText(successMessage);
            setModalVisible(true);
        } catch (error) {
            console.error('Failed to open link:', error);
            setModalText('Something went wrong. Please try again.');
            setModalVisible(true);
        }
    };

    const handleEmailPress = () => {
        openLink('mailto:support@example.com', 'Email app opened successfully.');
    };

    const handleWebsitePress = () => {
        openLink('https://www.example.com', 'Website opened successfully.');
    };

    const handlePrivacyPolicyPress = () => {
        openLink('https://www.example.com/privacy-policy', 'Privacy Policy opened successfully.');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Contact Us</Text>
                <Text style={styles.subtitle}>We'd love to hear from you!</Text>

                <View style={styles.infoSection}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>support@example.com</Text>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton text="Send Email" color={Color.BLACK} additionalFunc={handleEmailPress} />
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.label}>Website:</Text>
                    <Text style={styles.value}>www.example.com</Text>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton text="Visit Website" color={Color.BLACK} additionalFunc={handleWebsitePress} />
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.label}>Privacy Policy:</Text>
                    <Text style={styles.value}>Read our Privacy Policy</Text>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton text="Privacy Policy" color={Color.WHITE} additionalFunc={handlePrivacyPolicyPress} />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© {new Date().getFullYear()} YourAppName. All rights reserved.</Text>
                </View>

                <AwesomeModal
                    visible={isModalVisible}
                    text={modalText}
                    buttonText="OK"
                    onPress={() => setModalVisible(false)}
                    onBackPress={() => setModalVisible(false)}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        padding: 14
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: Colors.grey,
        marginBottom: 20,
    },
    infoSection: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 5,
    },
    value: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 10,
    },
    buttonContainer: {
        width: '100%',
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: Colors.grey,
    }
});

export default ContactInformationView;