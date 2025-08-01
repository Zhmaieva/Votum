import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Colors } from '../../utils/colorUtils';
import { checkIfPollExists } from '../../shared/api/apiClient';

export default function IntermediatePage() {
    const navigation = useNavigation();
    const route = useRoute();
    const pollId = route.params?.pollId;
    const userId = route.params?.userId;

    useEffect(() => {
        let timeoutFired = false;

        const timeout = setTimeout(() => {
            timeoutFired = true;
            navigation.getParent()?.navigate('MY PROFILE');
        }, 2500); // fallback max wait

        const interval = setInterval(async () => {
            try {
                if (!pollId) return;

                const pollReady = await checkIfPollExists(pollId); // return true/false
                if (pollReady && !timeoutFired) {
                    clearInterval(interval);
                    clearTimeout(timeout);
                    navigation.getParent()?.navigate('MY PROFILE');
                }
            } catch (e) {
                console.warn("Poll check failed:", e);
            }
        }, 500);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, [pollId, userId]);

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/animations/loader.json')}
                autoPlay
                style={styles.lottie}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
});
