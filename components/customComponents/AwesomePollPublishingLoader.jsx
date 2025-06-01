import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { Colors } from '../../utils/colorUtils';

const BAR_WIDTH = Dimensions.get('window').width - 30;
const BAR_HEIGHT = 30;
const ANIMATION_DURATION = 3000;

const AwesomePollPublishingLoader = ({ onComplete }) => {
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: false,
        }).start(() => {
            if (onComplete) {
                onComplete();
            }
        });
    }, []);

    const animatedWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, BAR_WIDTH],
    });

    return (
        <View style={styles.container}>
            <View style={styles.loaderContainer}>
                <Animated.View style={[styles.fill, { width: animatedWidth }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loaderContainer: {
        width: BAR_WIDTH,
        height: BAR_HEIGHT,
        borderWidth: 1,
        borderColor: Colors.black,
        backgroundColor: Colors.white,
        overflow: 'hidden',
        borderRadius: 0,
    },
    fill: {
        height: '100%',
        backgroundColor: Colors.green,
    },
});

export default AwesomePollPublishingLoader;