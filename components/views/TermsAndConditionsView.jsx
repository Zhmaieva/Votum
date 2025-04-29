import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';

const TermsAndConditionsView = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Terms and Conditions</Text>

                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.paragraph}>
                    By accessing and using this app, you accept and agree to be bound by the terms and provision of this agreement.
                </Text>

                <Text style={styles.sectionTitle}>2. Changes to Terms</Text>
                <Text style={styles.paragraph}>
                    We reserve the right to modify these terms at any time. It is your responsibility to review them regularly.
                </Text>

                <Text style={styles.sectionTitle}>3. User Responsibilities</Text>
                <Text style={styles.paragraph}>
                    You agree to use the app in a lawful manner and not to misuse the services provided.
                </Text>

                <Text style={styles.sectionTitle}>4. Privacy</Text>
                <Text style={styles.paragraph}>
                    We care about your privacy. By using the app, you also agree to our Privacy Policy.
                </Text>

                <Text style={styles.sectionTitle}>5. Termination</Text>
                <Text style={styles.paragraph}>
                    We may terminate or suspend access to the app immediately, without prior notice, for any reason.
                </Text>

                <Text style={styles.sectionTitle}>6. Contact Us</Text>
                <Text style={styles.paragraph}>
                    If you have any questions about these Terms, please contact us through the Contact Information page.
                </Text>

                <View style={styles.buttonContainer}>
                    <AwesomeButton
                        text="I Agree"
                        color={Color.BLACK}
                        additionalFunc={() => navigation.goBack()}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    container: {
        padding: 14
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.black,
        textAlign: 'flex-start',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
        color: Colors.black,
    },
    paragraph: {
        fontSize: 14,
        color: Colors.black,
        lineHeight: 22,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 30,
        //marginBottom: 50,
    }
});

export default TermsAndConditionsView;