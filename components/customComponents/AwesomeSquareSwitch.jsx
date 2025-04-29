import React, { useState, useEffect } from 'react';
import { View, Animated, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';

const AwesomeSquareSwitch = ({
                                 value,
                                 onValueChange,
                                 width = 50,
                                 height = 30,
                                 knobSize = 24,
                                 activeColor = Colors.lightGrey,
                                 inactiveColor = Colors.lightGrey,
                                 activeKnobColor = Colors.green,
                                 inactiveKnobColor = Colors.grey,
                             }) => {
    const [animation] = useState(new Animated.Value(value ? 1 : 0));

    useEffect(() => {
        Animated.timing(animation, {
            toValue: value ? 1 : 0,
            duration: 200,
            useNativeDriver: false,
        }).start();
    }, [value]);

    const knobPosition = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [2, width - knobSize - 3],
    });

    return (
        <Pressable
            style={[
                styles.container,
                {
                    width,
                    height,
                    backgroundColor: value ? activeColor : inactiveColor,
                }
            ]}
            onPress={() => onValueChange(!value)}
        >
            <Animated.View
                style={[
                    styles.knob,
                    {
                        width: knobSize,
                        height: knobSize,
                        backgroundColor: value ? activeKnobColor : inactiveKnobColor,
                        transform: [{ translateX: knobPosition }],
                    }
                ]}
            />
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 0,
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        /*borderColor: Colors.black,
        borderWidth: 1,*/
        paddingHorizontal: 2,
    },
    knob: {
        borderRadius: 0,
        position: 'absolute',
        top: 3,
    },
});

export default AwesomeSquareSwitch;