import React, {useEffect, useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import {AppState, StyleSheet} from 'react-native';
import AwesomeTabs from "./components/views/navigation/AwesomeTabs";
import StackNav from "./components/views/navigation/StackNav";
import {login} from "./shared/api/apiClient";
import AuthStack from "./components/views/navigation/AwesomeTabs";

export default function App() {

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /*useEffect(() => {
        // Automatically check authentication status when the app comes back from the background
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (nextAppState === 'active') {
                // Optionally, you can recheck the authentication status each time the app becomes active
                checkAuthStatus().then(isLoggedIn => {
                    setIsAuthenticated(isLoggedIn);
                });
            }
        });

        // Clean up the subscription when the component is unmounted
        return () => subscription.remove();
    }, []);*/

    // This function can check the authentication status, and set the state accordingly
    useEffect(() => {
        /*// Check the authentication status (e.g., check for a token or user session)
        checkAuthStatus().then(isLoggedIn => {
            setIsAuthenticated(isLoggedIn);  // Update state based on the authentication check
        });*/
    }, []);

    return (
        <NavigationContainer>
            {isAuthenticated ? (
                <AwesomeTabs />  // Show the main app if authenticated
            ) : (
                <AuthStack />  // Show the login/registration flow if not authenticated
            )}
        </NavigationContainer>
    );
}