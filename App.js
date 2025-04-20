import React, {useEffect, useState} from "react";
import * as Linking from 'expo-linking';
import {NavigationContainer, useNavigationContainerRef} from '@react-navigation/native';
import {AwesomeTabs, AuthNavigator} from "./components/views/navigation/AwesomeTabs";
import {getDataService, globalEventEmitter} from "./shared/common";
import {isTokenAvailable} from "./shared/api/apiClient";
import {ActivityIndicator, View} from "react-native";
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";

export default function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigationRef = useNavigationContainerRef();

    const handleUrl = ({ url }) => {
        if (!url) return;

        console.info('Received deep link:', url);
        const { path } = Linking.parse(url);
        const match = path?.match(/^poll\/(.+)$/);
        if (match && isAuthenticated) {
            const readableId = match[1];
            navigationRef.navigate('Feed', {
                screen: 'FeedMain',
                params: { postId: readableId }
            });
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
        };

        init().then(_ => {});
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