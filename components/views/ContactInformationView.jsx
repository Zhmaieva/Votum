import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import { AwesomeModal } from '../customComponents/AwesomeModal';
import {Logger} from "../../shared/common";

const ContactInformationView = () => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalText, setModalText] = useState('');

    const openLink = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            Logger.error('Failed to open link:', error);
            setModalText('Something went wrong, please try again');
            setModalVisible(true);
        }
    };

    const handleEmailPress = () => {
        openLink('mailto:votum.contact@gmail.com');
    };

    const handleWebsitePress = () => {
        openLink('https://votum.beampie.com');
    };

    const handlePrivacyPolicyPress = () => {
        openLink('https://www.example.com/privacy-policy');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>We'd love to hear from you!</Text>
                <Text style={styles.subtitle}></Text>

                <View style={styles.infoSection}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>votum.contact@gmail.com</Text>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton text="Send Email" color={Color.BLACK} additionalFunc={handleEmailPress} />
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.label}>Website:</Text>
                    <Text style={styles.value}>votum.beampie.com</Text>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton text="Visit Website" color={Color.BLACK} additionalFunc={handleWebsitePress} />
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© {new Date().getFullYear()} Votum. All rights reserved.</Text>
                </View>

                <AwesomeModal
                    visible={isModalVisible}
                    text="INFO MESSAGE"
                    subtext={modalText}
                    buttons={[
                        { label: "OK", onPress: () => setModalVisible(false) },
                    ]}
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
        padding: 15
    },
    title: {
        fontSize: 20,
        color: Colors.black,
        marginBottom: 10,
        fontFamily: Fonts.medium,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 10,
        fontFamily: Fonts.regular,
    },
    infoSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        color: Colors.black,
        marginBottom: 5,
        fontFamily: Fonts.medium,
    },
    value: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 10,
        fontFamily: Fonts.regular,
    },
    buttonContainer: {
        width: '100%',
    },
    footer: {
        marginTop: 10,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 12,
        color: Colors.grey,
        fontFamily: Fonts.regular,
    }
});

export default ContactInformationView;