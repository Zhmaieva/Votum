import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeSquareSwitch from '../customComponents/AwesomeSquareSwitch';
import {getDataService} from "../../shared/common";
import {updateNotificationPreferences} from "../../shared/api/apiClient";

const NotificationSettingsView = () => {
    const [pushFollowers, setPushFollowers] = useState(true);
    const [pushNewPolls, setPushNewPolls] = useState(true);
    const [pushMilestones, setPushMilestones] = useState(true);
    const [pushTrending, setPushTrending] = useState(true);
    const [pushSuggested, setPushSuggested] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);

    useEffect(() => {
       const isEnabled = getDataService()?.getUser()?.is_new_followers_notification_enabled;
       setPushFollowers(isEnabled);
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Notification Settings</Text>

                <Text style={styles.sectionTitle}>Push Notifications</Text>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>New followers</Text>
                    <AwesomeSquareSwitch
                        value={pushFollowers}
                        onValueChange={async (value) => {
                            if (getDataService()?.getUser())
                                getDataService().getUser().is_new_followers_notification_enabled = value;
                            setPushFollowers(value);
                            getDataService().commitUserChanges();

                            await updateNotificationPreferences();
                        }}
                    />
                </View>

                {/*<View style={styles.settingRow}>
                    <Text style={styles.settingText}>Polls from people you follow</Text>
                    <AwesomeSquareSwitch
                        value={pushNewPolls}
                        onValueChange={setPushNewPolls}
                    />
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Poll milestone updates</Text>
                    <AwesomeSquareSwitch
                        value={pushMilestones}
                        onValueChange={setPushMilestones}
                    />
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Trending polls</Text>
                    <AwesomeSquareSwitch
                        value={pushTrending}
                        onValueChange={setPushTrending}
                    />
                </View>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Suggested polls</Text>
                    <AwesomeSquareSwitch
                        value={pushSuggested}
                        onValueChange={setPushSuggested}
                    />
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Email Notifications</Text>

                <View style={styles.settingRow}>
                    <Text style={styles.settingText}>Send me email updates</Text>
                    <AwesomeSquareSwitch
                        value={emailEnabled}
                        onValueChange={setEmailEnabled}
                    />
                </View>*/}

                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>
                        Manage how you get updates about your followers. You can change the setting anytime.
                    </Text>
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
        padding: 15,
    },
    title: {
        fontSize: 20,
        fontFamily: Fonts.medium,
        color: Colors.black,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        color: Colors.black,
        marginTop: 10,
        marginBottom: 10,
        fontFamily: Fonts.medium,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    settingText: {
        fontSize: 14,
        color: Colors.black,
        flex: 1,
        paddingRight: 10,
        fontFamily: Fonts.regular,
    },
    infoContainer: {
        marginTop: 20,
    },
    infoText: {
        fontSize: 14,
        color: Colors.grey,
        fontFamily: Fonts.regular,
    },
});

export default NotificationSettingsView;
