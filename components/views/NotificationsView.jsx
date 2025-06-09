import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Pressable } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import {deleteAllUserNotifications, markNotificationsAsRead} from "../../shared/api/apiClient";
import {useFocusEffect} from "@react-navigation/native";


export function getTimeAgoLabel(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);

    if (months >= 1) {
        return `${months}m ago`;
    } else if (days >= 1) {
        return `${days}d ago`;
    } else if (hours >= 1) {
        return `${hours}h ago`;
    } else if (minutes >= 1) {
        return `${minutes}m ago`;
    } else {
        return 'just now';
    }
}

const NotificationsView = ({route}) => {
    const [notifications, setNotifications] = useState(
        route.params.map(x => ({
            id: x.id,
            type: 'follow',
            description: x.message,
            time: getTimeAgoLabel(x.createdAt),
        }))
    );

    useFocusEffect(React.useCallback(() => {
        const readIds = route.params.filter(x => !x.isViewed).map(x => x.id);
        if (readIds.length === 0)
            return;

        markNotificationsAsRead(readIds).then(_ => {});
    }, []))

    const clearAllNotifications = async () => {
        setNotifications([]);
        await deleteAllUserNotifications();
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