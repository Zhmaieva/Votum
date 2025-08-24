import * as Font from 'expo-font';
import React, { useEffect, useState } from "react";
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { AwesomeTabs, AuthNavigator } from "./components/views/navigation/AwesomeTabs";
import {getDataService, globalEventEmitter, Loader, Logger} from "./shared/common";
import {fetchMyProfile, isTokenAvailable, resetToken, updatePushToken} from "./shared/api/apiClient";
import { ActivityIndicator, View } from "react-native";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import {SafeAreaProvider} from "react-native-safe-area-context";
import NoInternetWrapper from './components/views/NoInternetWrapper';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().then(_ => {});

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [isLoadingVisible, setIsLoadingVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fontLoaded, setFontLoaded] = useState(false);
    const navigationRef = useNavigationContainerRef();
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        // Simulate loading or fetch
        setTimeout(() => {
            setAppReady(true);
        }, 1000);
    }, []);

    useEffect(() => {
        if (appReady) {
            SplashScreen.hideAsync().then(_ => {}); // Manually hide
        }
    }, [appReady]);

    const loader = new Loader(setIsLoadingVisible);

    const handleUrl = ({ url }) => {
        if (!url) return;

        Logger.log('Received deep link:', url);
        const { path } = Linking.parse(url);
        Logger.log('Deep link path', path);
        if (path) {
            const parts = path?.split('/') ?? [];
            navigationRef.navigate('FEED', {});
            globalEventEmitter.emit('sharedPoll', { pollId: parts[parts.length - 1], tabName: 'FEED' });
        }
    };

    const checkOnboardingReadiness = async () => {
        const tokenAvailable = await isTokenAvailable();
        let isOnboardingDone = false;
        let profile = null;
        if (tokenAvailable) {
            profile = await fetchMyProfile();
            if (profile) {
                getDataService().setUser(profile);
                isOnboardingDone = profile.onboardingComplete;
            }
        }
        setIsAuthenticated(tokenAvailable && isOnboardingDone);
        if (profile || !tokenAvailable)
            setIsLoading(false);

        if (!tokenAvailable || !isOnboardingDone) {
            return false;
        }

        return true;
    }

    const onSignup = async ({skipMainLoading}) => {
        if (skipMainLoading)
            return;

        getDataService().setUser(null);
        getDataService().commitUserChanges();

        await checkOnboardingReadiness();
    }

    const signIn = async () => {
        if (isAuthenticated)
            await registerForPushNotificationsAsync();

        getDataService().setUser(null);
        getDataService().commitUserChanges();

        setIsAuthenticated(true);
    }

    const signOut = async (force) => {
        Logger.log('Sign Out', force);

        getDataService().setUser(null);
        getDataService().commitUserChanges();

        if (isAuthenticated)
            if (force || await deregisterForPushNotificationsAsync()) {
                await resetToken();
                setIsAuthenticated(false);
            }
    }

    const onPasswordReset = async () => {
        const tokenAvailable = await isTokenAvailable();
        let isOnboardingDone = false;
        if (tokenAvailable) {
            const profile = await fetchMyProfile();
            if (profile) {
                getDataService().setUser(profile);
                isOnboardingDone = profile.onboardingComplete;
            }
        }
        if (tokenAvailable) {
            if (!isOnboardingDone)
                globalEventEmitter.emit('signup', { skipMainLoading: true});
            else
                setIsAuthenticated(true );
        }
    }

    const loadFontAndInit = async () => {
        await Font.loadAsync({
            'CourierPrime-Regular': require('./assets/fonts/CourierPrime-Regular.ttf'),
            'CourierPrime-Bold': require('./assets/fonts/CourierPrime-Bold.ttf'),
            'Ubuntu-Regular': require('./assets/fonts/UbuntuMono-Regular.ttf'),
            'Ubuntu-Bold': require('./assets/fonts/UbuntuMono-Bold.ttf'),
            'Fira': require('./assets/fonts/FiraSans-Regular.ttf'),
            'Fira-Bold': require('./assets/fonts/FiraSans-Bold.ttf'),
            'Fira-Medium': require('./assets/fonts/FiraSans-Medium.ttf'),
            'Pixel': require('./assets/fonts/PressStart2P-Regular.ttf'),
        });

        setFontLoaded(true);

        const isFullyOnboarded = await checkOnboardingReadiness();

        if (!isFullyOnboarded) {
            await deregisterForPushNotificationsAsync();
            return;
        }

        const url = await Linking.getInitialURL();

        try {
            if (url) handleUrl({ url });
        } catch (e) {
            Logger.error('Error handling deep link: ', e);
        }

        await registerForPushNotificationsAsync();
    };

    useEffect(() => {
        loader.load([new Promise(resolve => resolve()).then(async () => {
            await loadFontAndInit();
        })]).then(() => {});

        const subscription = Linking.addEventListener('url', handleUrl);

        const notificationReceivedListener = Notifications.addNotificationReceivedListener(notification => {
            Logger.log('Notification received:', notification);
        });

        const notificationResponseReceivedListener = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification?.request?.content?.data;
            if (!data?.screenName)
                return;

            Logger.log('Current routes:', navigationRef.getRootState());

            if (data?.screenName === 'Notifications') {
                navigationRef.reset({
                    index: 0,
                    routes: [
                        {
                            name: 'MY PROFILE',
                            state: {
                                index: 1,
                                routes: [
                                    { name: 'Profile' },
                                    { name: 'Notifications' },
                                ]
                            }
                        }
                    ]
                });
            }
        });

        globalEventEmitter.on('signup', onSignup);
        globalEventEmitter.on('online', checkOnboardingReadiness);
        globalEventEmitter.on('signIn', signIn);
        globalEventEmitter.on('signOut', signOut);
        globalEventEmitter.on('passwordReset', onPasswordReset);

        return () => {
            subscription?.remove();
            notificationReceivedListener?.remove();
            notificationResponseReceivedListener?.remove();
            globalEventEmitter.off('signup', onSignup);
            globalEventEmitter.off('online', checkOnboardingReadiness);
            globalEventEmitter.off('signIn', signIn);
            globalEventEmitter.off('signOut', signOut);
            globalEventEmitter.off('passwordReset', onPasswordReset);

        };
    }, []);

    return (
        <SafeAreaProvider style={{backgroundColor: '#ffffff'}}>
            <NoInternetWrapper>
                {
                    (!fontLoaded || isLoading) ?
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
                            {!isLoadingVisible ? <></> : <ActivityIndicator size="large" color="#93a548" />}
                        </View>
                        :
                        <GestureHandlerRootView style={{ flex: 1}}>
                            <BottomSheetModalProvider>
                                <NavigationContainer ref={navigationRef}>
                                    {isAuthenticated ? <AwesomeTabs /> : <AuthNavigator />}
                                </NavigationContainer>
                            </BottomSheetModalProvider>
                        </GestureHandlerRootView>
                }

            </NoInternetWrapper>
        </SafeAreaProvider>
    );
}

async function deregisterForPushNotificationsAsync() {
    return await updatePushToken(null);
}

// Helper function
async function registerForPushNotificationsAsync() {
    try {
        Logger.log('Register for Push Notifications');
        if (Device.isDevice) {
            Logger.log('Register for Push Notifications: Device.isDevice true');
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                Logger.warn('Failed to get push token for push notification!');
                return;
            }

            const token = (await Notifications.getExpoPushTokenAsync()).data;

            await updatePushToken(token);
        } else {
            Logger.warn('Must use physical device for Push Notifications');
        }
    } catch (e) {
        Logger.error('Register for Push Notifications error', e);
    }
}
