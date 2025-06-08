import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';

export const VERIFICATION_FLOW_TYPE = {
    REGISTRATION: 'REGISTRATION',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    CHANGE_EMAIL: 'CHANGE_EMAIL',
    CHANGE_PASSWORD: 'CHANGE_PASSWORD',
};

const SuccessView = ({ route }) => {
    const { flowType } = route.params ?? {};

    let title = '';
    let subtitle = '';

    if (flowType === VERIFICATION_FLOW_TYPE.CHANGE_EMAIL) {
        title = 'Your email has been successfully changed';
        subtitle = 'You’ll now receive notifications at your new email address.';
    } else if (flowType === VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD) {
        title = 'Your password has been successfully changed';
        subtitle = 'You can now log in with your new password.';
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {title !== '' && (
                    <>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>{subtitle}</Text>
                        <View style={styles.buttonContainer}>
                            <AwesomeButton
                                text="Back to Profile"
                                color={Color.BLACK}
                                screenName="Profile"
                            />
                        </View>
                    </>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.medium,
        color: Colors.black,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 20,
        fontFamily: Fonts.regular,
    },
    buttonContainer: {
        width: '100%',
    },
});

export default SuccessView;