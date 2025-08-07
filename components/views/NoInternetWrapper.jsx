import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton'; // adjust path

export default function NoInternetWrapper({ children }) {
    const [isConnected, setIsConnected] = useState(true);

    const checkConnection = async () => {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected && state.isInternetReachable !== false);
    };

    useEffect(() => {
        checkConnection(); // initial check on mount
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected && state.isInternetReachable !== false);
        });
        return () => unsubscribe();
    }, []);

    if (!isConnected) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>No Internet</Text>
                <Text style={styles.message}>You’re offline. Please reconnect and try again.</Text>
                <AwesomeButton
                    text="Try Again"
                    color={Color.BLACK}
                    additionalFunc={checkConnection}
                />
            </SafeAreaView>
        );
    }

    return children;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontFamily: Fonts.bold,
        color: Colors.black,
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        fontFamily: Fonts.regular,
        textAlign: 'center',
        color: Colors.black,
        marginBottom: 20,
    },
});