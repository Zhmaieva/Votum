import React, {useEffect, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation, useRoute, StackActions, useFocusEffect} from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Colors } from '../../utils/colorUtils';
import { checkIfPollExists } from '../../shared/api/apiClient';
import { globalEventEmitter } from '../../shared/common';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IntermediatePage() {
    const navigation = useNavigation();
    const route = useRoute();
    const pollId = route.params?.pollId;
    const userId = route.params?.userId;
    const animationRef = useRef(null);

    // Restart animation on focus
    useFocusEffect(
        React.useCallback(() => {
            if (animationRef.current) {
                animationRef.current.reset();
                animationRef.current.play();
            }
        }, [])
    );

    useEffect(() => {
        let done = false;

        const finish = (success = false) => {
            // Reset the Add tab stack so returning to ADD POLL shows the form, not this loader
            navigation.dispatch(StackActions.popToTop());
            // Clear AddView only on confirmed success
            if (success) globalEventEmitter.emit('pollCreated');
            // Move to profile tab
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: 'MY PROFILE',
                        state: {
                            routes: [{name: 'Profile'}],
                        },
                    },
                ],
            });
        };

        const timeout = setTimeout(() => {
            if (done) return;
            done = true;
            finish(true);
        }, 2500);

        return () => {
            clearTimeout(timeout);
            //clearInterval(interval);
        };
    }, [pollId, userId, navigation]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['left', 'right']}>
            <View style={styles.container}>
                <LottieView
                    ref={animationRef}
                    source={require('../../assets/animations/loader.json')}
                    autoPlay
                    style={styles.lottie}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: '100%',
        height: '100%',
    },
});