import React, {useEffect, useRef, useState} from 'react';
import {Text, StyleSheet, SafeAreaView, View, AppState} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import {getDataService, globalEventEmitter} from "../../shared/common";
import {pingServer} from "../../shared/api/apiClient";

export default function NoInternetWrapper({ children }) {
    const [isConnected, setIsConnected] = useState(true);
    const lastRef = useRef({ isConnected: undefined, isInternetReachable: undefined });
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (nextAppState === "active") {
                getDataService().setAllowOfflineSwitch(false);
                setTimeout(() => {
                    getDataService().setAllowOfflineSwitch(true);
                }, 2000);
            }
            if (nextAppState !== "active") {
                getDataService().setAllowOfflineSwitch(false);
            }
            appState.current = nextAppState;
        });

        return () => subscription.remove();
    }, []);

    const changeOnlineState = (isOnline) => {
        if (!getDataService().getAllowOfflineSwitch())
            return;

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

        await checkNet();
    }

    const checkNet = () => {
        return new Promise(resolve => {
            setTimeout(async () => {
                try {
                    let state = await NetInfo.fetch();

                    if (state.isConnected && state.isInternetReachable !== false) {
                        console.log('OFFLINE CHECK: connected to the internet');
                        console.log(JSON.stringify(state));

                        const pingResult = await pingServer();

                        console.log('OFFLINE CHECK: ping result', pingResult ?? 'null');
                        changeOnlineState(pingResult ?? false);
                    } else {
                        console.log('OFFLINE CHECK: not connected to the internet');
                        changeOnlineState(false);
                    }
                } catch (err) {
                    console.log('OFFLINE CHECK: error');
                    changeOnlineState(false);
                } finally {
                    resolve();
                }
            }, 1000);
        })
    }

    const checkConnection = async () => {
        const state = await NetInfo.fetch();
        await handleNetState(state, true);
    };

    const handleTimeout = () => {
        console.log('OFFLINE CHECK: timeout handled');
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
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>
                    <Text style={styles.title}>No Internet</Text>
                    <Text style={styles.message}>You’re offline. Please reconnect and try again.</Text>
                    <AwesomeButton
                        text="Try Again"
                        color={Color.BLACK}
                        additionalFunc={checkConnection}
                        disableNavigation={true}
                    />
                </View>
            </SafeAreaView>
        );
    }

    return children;
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center'
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
        textAlign: 'flex-start',
        color: Colors.black,
        marginBottom: 20,
    },
});