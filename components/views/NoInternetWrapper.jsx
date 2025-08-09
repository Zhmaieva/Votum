import React, {useEffect, useRef, useState} from 'react';
import { Text, StyleSheet, SafeAreaView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import {globalEventEmitter} from "../../shared/common";
import {pingServer} from "../../shared/api/apiClient"; // adjust path

export default function NoInternetWrapper({ children }) {
    const [isConnected, setIsConnected] = useState(true);
    const lastRef = useRef({ isConnected: undefined, isInternetReachable: undefined });

    const changeOnlineState = (isOnline) => {
        if (isOnline) {
            console.log('going online...');
            globalEventEmitter.emit('online', {});
            setIsConnected(true);
        } else {
            console.log('going offline...')
            setIsConnected(false);
        }
    }

    const handleNetState = async (state, force = false) => {
        const next = {
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
        };

        if (!force && lastRef.current.isConnected === next.isConnected && lastRef.current.isInternetReachable === next.isInternetReachable)
            return;

        lastRef.current = next;

        try {
            if (state.isConnected && state.isInternetReachable !== false) {
                console.log(JSON.stringify(state));
                const pingResult = await pingServer();
                changeOnlineState(pingResult ?? false);
            } else {
                changeOnlineState(false);
            }
        } catch (err) {
            changeOnlineState(false);
        }
    }

    const checkConnection = async () => {
        const state = await NetInfo.fetch();
        await handleNetState(state, true);
    };

    const handleTimeout = () => {
        changeOnlineState(false);
    }

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(handleNetState);

        globalEventEmitter.on('requestTimeout', handleTimeout);

        return () => {
            unsubscribe()
            globalEventEmitter.off('requestTimeout', handleTimeout);
        };
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
                    disableNavigation={true}
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