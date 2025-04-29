import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import { useNavigation } from '@react-navigation/native';

const dummyNotifications = [
    { id: '1', title: 'New follower', description: 'Alex started following you.', time: '2h ago' },
    { id: '2', title: 'Poll liked', description: 'Your poll "Favorite pizza?" got 5 new likes!', time: '4h ago' },
    { id: '3', title: 'Vote received', description: 'Someone voted in your poll!', time: '1d ago' },
];

const NotificationsView = () => {
    const [notifications, setNotifications] = useState(dummyNotifications);
    const navigation = useNavigation();

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const renderNotification = ({ item }) => (
        <Pressable style={styles.notificationContainer}>
            <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationDescription}>{item.description}</Text>
            </View>
            <Text style={styles.notificationTime}>{item.time}</Text>
        </Pressable>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Notifications</Text>
                <View style={styles.buttonRow}>
                    <View style={styles.buttonContainer}>
                        <AwesomeButton
                            text="Settings"
                            color={Color.WHITE}
                            screenName='Notification Settings'
                        />
                    </View>
                    {notifications.length > 0 && (
                        <View style={styles.buttonContainer}>
                            <AwesomeButton
                                text="Clear All"
                                color={Color.BLACK}
                                additionalFunc={clearAllNotifications}
                            />
                        </View>
                    )}
                </View>
            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                    <Text style={styles.emptyText}>You're all caught up!</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={item => item.id}
                    renderItem={renderNotification}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.black,
    },
    listContainer: {
        paddingHorizontal: 15,
    },
    notificationContainer: {
        borderBottomWidth: 1,
        borderColor: Colors.lightGrey,
        paddingVertical: 15,
    },
    notificationTextContainer: {
        marginBottom: 5,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.black,
    },
    notificationDescription: {
        fontSize: 14,
        color: Colors.grey,
    },
    notificationTime: {
        fontSize: 12,
        color: Colors.grey,
        alignSelf: 'flex-end',
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.grey,
        textAlign: 'center',
    },
    buttonContainer: {
        width: 82,
        marginLeft: 10,
    }
});

export default NotificationsView;