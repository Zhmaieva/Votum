import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import {Colors, Fonts} from '../../utils/colorUtils';

const AwesomeFullScreenLoader = ({ visible = false, message = '' }) => {
    const rotateAnim = React.useRef(new Animated.Value(0)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.loop(
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                    easing: Animated.Easing.linear,
                })
            ).start();

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    if (!visible && fadeAnim.__getValue() === 0) {
        return null;
    }

    return (
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Svg height="60" width="60" viewBox="0 0 100 100">
                    <Circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke={Colors.green}
                        strokeWidth="8"
                        strokeDasharray="62.8 188.4"
                        fill="none"
                        strokeLinecap="round"
                    />
                </Svg>
            </Animated.View>
            {message ? <Text style={styles.message}>{message}</Text> : null}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    message: {
        marginTop: 15,
        fontSize: 16,
        color: Colors.white,
        fontFamily: Fonts.medium
    },
});

export default AwesomeFullScreenLoader;