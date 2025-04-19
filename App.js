import React, {useState} from "react";
import * as Linking from 'expo-linking';
import {NavigationContainer} from '@react-navigation/native';
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

    isTokenAvailable().then(res => {
        setIsAuthenticated(res);
        setIsLoading(false);
    })

    globalEventEmitter.on('signIn', () => {
        getDataService().setUser(null); // pretend we never set the user, so it will be initialised later in profile view
        setIsAuthenticated(true);
    });

    globalEventEmitter.on('signOut', () => {
        setIsAuthenticated(false);
    });

    // Handle the case when the app is opened from a link (cold start)
    Linking.getInitialURL().then((url) => {
        if (url) {
            console.info('Linking to ', url);
        }
    });

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetModalProvider>
                {isLoading ? (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                ) : (
                    <NavigationContainer>
                        {isAuthenticated ? <AwesomeTabs /> : <AuthNavigator />}
                    </NavigationContainer>
                )}
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}