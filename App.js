import React, { useEffect, useState, useRef } from "react";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { AwesomeTabs, AuthNavigator } from "./components/views/navigation/AwesomeTabs";
import { getDataService, globalEventEmitter } from "./shared/common";
import { isTokenAvailable } from "./shared/api/apiClient";
import { ActivityIndicator, View, Platform } from "react-native";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigationRef = useNavigationContainerRef();
    const notificationListener = useRef();
    const responseListener = useRef();

    const handleUrl = ({ url }) => {
        if (!url) return;

        console.info('Received deep link:', url);
        const { path } = Linking.parse(url);
        if (path) {
            navigationRef.navigate('Feed', {});
            globalEventEmitter.emit('sharedPoll', { pollId: path });
        }
    };

    useEffect(() => {
        const subscription = Linking.addEventListener('url', handleUrl);
        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        const init = async () => {
            const tokenAvailable = await isTokenAvailable();
            setIsAuthenticated(tokenAvailable);
            setIsLoading(false);

            if (!tokenAvailable)
                return;

            const url = await Linking.getInitialURL();
            if (url) handleUrl({ url });

            await registerForPushNotificationsAsync();
        };

        init().then(() => {});

        // This listener will fire whenever a notification is received while app is foregrounded
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log('Notification received:', notification);
        });

        // This listener will fire when the user taps on a notification
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('User interacted with notification:', response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    globalEventEmitter.on('signIn', () => {
        getDataService().setUser(null); // pretend we never set the user, so it will be initialised later in profile view
        setIsAuthenticated(true);
    });

    globalEventEmitter.on('signOut', () => {
        setIsAuthenticated(false);
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <NavigationContainer ref={navigationRef}>
                        {isAuthenticated ? <AwesomeTabs /> : <AuthNavigator />}
                    </NavigationContainer>
                )}
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

// Helper function
async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.warn('Failed to get push token for push notification!');
            return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log('Expo Push Token:', token);

        // TODO: Save the token to your backend if needed
    } else {
        console.warn('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }
}