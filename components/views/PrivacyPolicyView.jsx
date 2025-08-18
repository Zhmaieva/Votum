import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';

const PrivacyPolicyView = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Privacy Policy (GDPR-Compliant)</Text>

                <Text style={styles.subtittle}>
                    This Privacy Policy explains how we collect, use, and protect your personal data under GDPR.
                </Text>

                <Text style={styles.firstSectionTitle}>1. Who We Are</Text>
                <Text style={styles.paragraph}>
                    Votum (“we”, “our”, or “us”) is operated from Gdańsk, Poland. For questions, contact us at votum.contact@gmail.com.
                </Text>

                <Text style={styles.sectionTitle}>2. What Data We Collect</Text>
                <Text style={styles.paragraph}>
                    - Username, and profile info you provide.{"\n"}
                    - Poll responses and votes.{"\n"}
                    - Device and usage data (e.g. app interactions for diagnostic purposes).{"\n"}
                    - Optional demographic info (age, gender), only if provided.
                </Text>

                <Text style={styles.sectionTitle}>3. Legal Basis</Text>
                <Text style={styles.paragraph}>
                    We process your data based on:{"\n"}
                    - Consent{"\n"}
                    - Contract{"\n"}
                    - Legitimate interest{"\n"}
                    - Legal obligations
                </Text>

                <Text style={styles.sectionTitle}>4. How We Use Data</Text>
                <Text style={styles.paragraph}>
                    To provide and improve Votum, personalize your experience, and ensure safety. We do not sell your data.
                </Text>

                <Text style={styles.sectionTitle}>5. Data Sharing</Text>
                <Text style={styles.paragraph}>
                    We never share any data with 3rd party services.
                </Text>

                <Text style={styles.sectionTitle}>6. Your Rights</Text>
                <Text style={styles.paragraph}>
                    Under GDPR, you can:{"\n"}
                    - Access, edit, or delete your data{"\n"}
                    - Restrict or object to processing{"\n"}
                    - Export your data (data portability){"\n"}
                    Contact us to exercise these rights.
                </Text>

                <Text style={styles.sectionTitle}>7. Data Storage & Security</Text>
                <Text style={styles.paragraph}>
                    We use encryption and secure storage. Data is only kept as long as needed for service or legal requirements.
                </Text>

                <Text style={styles.sectionTitle}>8. International Transfers</Text>
                <Text style={styles.paragraph}>
                    If data is transferred outside the EU, we ensure compliance with GDPR through legal safeguards like SCCs.
                </Text>

                <Text style={styles.sectionTitle}>9. Children’s Privacy</Text>
                <Text style={styles.paragraph}>
                    Votum is not for users under 13. We delete data of minors if discovered.
                </Text>

                <Text style={styles.sectionTitle}>10. Updates</Text>
                <Text style={styles.paragraph}>
                    We may update this policy. Major changes will be shared via the app or email.
                </Text>

                <Text style={styles.sectionTitle}>11. Contact</Text>
                <Text style={styles.paragraph}>
                    Email us at votum.contact@gmail.com
                </Text>

                <View style={styles.buttonContainer}>
                    <AwesomeButton
                        text="Go back"
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
        padding: 15
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.medium,
        marginBottom: 20,
        color: Colors.black,
        textAlign: 'flex-start',
    },
    firstSectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.medium,
        marginBottom: 8,
        color: Colors.black,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: Fonts.medium,
        marginTop: 15,
        marginBottom: 8,
        color: Colors.black,
    },
    paragraph: {
        fontSize: 14,
        color: Colors.black,
        lineHeight: 22,
        marginBottom: 10,
        fontFamily: Fonts.regular,
    },
    buttonContainer: {
        marginTop: 30,
        //marginBottom: 50,
    },
    subtittle: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 10,
        fontFamily: Fonts.regular,
    }
});

export default PrivacyPolicyView;