import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { Colors } from '../../utils/colorUtils';

const AwesomePollPublishingLoader = () => {
    const [percentages, setPercentages] = useState([33, 33, 34]);
    const animations = [
        useRef(new Animated.Value(0.33)).current,
        useRef(new Animated.Value(0.33)).current,
        useRef(new Animated.Value(0.34)).current
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const first = Math.random() * 60 + 10; // 10% to 70%
            const second = Math.random() * (100 - first - 10) + 5; // at least 5%
            const third = 100 - first - second;

            const newPercentages = [
                Math.round(first),
                Math.round(second),
                Math.round(third)
            ];

            setPercentages(newPercentages);

            animations.forEach((anim, index) => {
                Animated.timing(anim, {
                    toValue: newPercentages[index] / 100,
                    duration: 800,
                    useNativeDriver: false,
                }).start();
            });

        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <Svg height="160" width="100%">
                {animations.map((anim, index) => (
                    <AnimatedRect
                        key={index}
                        y={index * 50}
                        animatedWidth={anim}
                        color={index === 1 ? Colors.green : Colors.grey}
                    />
                ))}
            </Svg>
        </View>
    );
};

const AnimatedRect = ({ y, animatedWidth, color }) => {
    const width = animatedWidth.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%']
    });

    return (
        <Animated.View style={{ position: 'absolute', top: y, left: 0, right: 0, height: 40 }}>
            <Svg height="40" width="100%">
                <Rect
                    x="0"
                    y="0"
                    height="40"
                    width="100%"
                    fill={Colors.lightGrey}
                />
                <Animated.View style={{
                    position: 'absolute',
                    height: 40,
                    backgroundColor: color,
                    width,
                }} />
            </Svg>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.black,
        marginVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AwesomePollPublishingLoader;
