import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import { useNavigation } from '@react-navigation/native';

const dummyNotifications = [
    { id: '1', type: 'follow', description: 'Alex started following you.', time: '2h ago' },
    { id: '2', type: 'engagement', description: 'Your poll "Favorite pizza?" got 5 new likes!', time: '4h ago' },
    { id: '3', type: 'vote', description: 'Someone voted in your poll "Best movie?"', time: '1d ago' },
    { id: '4', type: 'engagement', description: 'Your poll "Best vacation spot?" hit 50 votes!', time: '10m ago' },
    { id: '5', type: 'trending', description: '🔥 Trending in Tech: “Best AI tool of 2025?”', time: '1h ago' },
    { id: '6', type: 'suggested', description: 'Suggested for you: “Best morning routine?”', time: '30m ago', silent: true },
];

const NotificationsView = () => {
    const [notifications, setNotifications] = useState(dummyNotifications);
    const navigation = useNavigation();

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'follow': return '👤';
            case 'engagement': return '✨';
            case 'vote': return '🗳️';
            case 'trending': return '🔥';
            case 'suggested': return '⭐';
            default: return '🔔';
        }
    };

    const renderNotification = ({ item }) => (
        <Pressable style={styles.notificationContainer}>
            <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>
                    {getIcon(item.type)} {item.description}
                </Text>
                {item.silent && (
                    <Text style={styles.silentTag}>in-app only</Text>
                )}
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
        fontFamily: Fonts.medium,
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
        fontSize: 15,
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    silentTag: {
        fontSize: 12,
        color: Colors.grey,
        fontFamily: Fonts.regular,
    },
    notificationTime: {
        fontSize: 12,
        color: Colors.grey,
        alignSelf: 'flex-end',
        fontFamily: Fonts.regular,
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
        fontFamily: Fonts.regular,
    },
    buttonContainer: {
        width: 82,
        marginLeft: 10,
    }
});

export default NotificationsView;