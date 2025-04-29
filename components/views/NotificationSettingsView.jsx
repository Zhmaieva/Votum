import React, {useState} from 'react';
import { View, Text, Switch, StyleSheet, SafeAreaView } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeSquareSwitch from '../customComponents/AwesomeSquareSwitch'

const NotificationSettingsView = () => {
    const [pushEnabled, setPushEnabled] = React.useState(true);
    const [emailEnabled, setEmailEnabled] = React.useState(false);
    const [isEnabledPush, setIsEnabledPush] = useState(false);
    const [isEnabledEmail, setIsEnabledEmail] = useState(false);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Notification Settings</Text>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Push Notifications</Text>
                    <AwesomeSquareSwitch
                        value={isEnabledPush}
                        onValueChange={setIsEnabledPush}
                    />
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Email Notifications</Text>
                    <AwesomeSquareSwitch
                        value={isEnabledEmail}
                        onValueChange={setIsEnabledEmail}
                    />
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        You can control how you receive updates about your polls, followers, and more.
                    </Text>
                </View>
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
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.black,
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
    },
    settingText: {
        fontSize: 16,
        color: Colors.black,
    },
    infoContainer: {
        marginTop: 30,
    },
    infoText: {
        fontSize: 14,
        color: Colors.grey,
    },
});

export default NotificationSettingsView;