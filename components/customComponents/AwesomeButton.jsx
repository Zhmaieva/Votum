import { Text, StyleSheet, Animated, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/colorUtils';

export const Color = {
    GREEN: 1,
    BLACK: 2,
};

export default function AwesomeButton({
                                          text,
                                          screenName,
                                          params = {}, // Accept params for navigation
                                          color = Color.GREEN,
                                          additionalFunc,
                                          changedText,
                                          isInChangedTextMode = false,
                                          disabled = false
                                      }) {
    const navigation = useNavigation();
    const [buttonName, setButtonName] = useState(text);
    const [isDisabled, setIsDisabled] = useState(disabled);
    const scaleValue = useState(new Animated.Value(1))[0];

    if (isInChangedTextMode && buttonName !== changedText) {
        setButtonName(changedText);
    } else if (!isInChangedTextMode && buttonName !== text) {
        setButtonName(text);
    }

    const onPressHandler = () => {
        if (isDisabled) return;

        if (screenName) {
            navigation.navigate(screenName, params); // Pass params to navigation
        }

        if (additionalFunc) {
            additionalFunc();
        }

        if (changedText && buttonName !== changedText) {
            setButtonName(changedText);
        } else {
            setButtonName(text);
        }
    };

    const animateButton = () => {
        if (isDisabled) return;

        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 130,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onPressHandler();
        });
    };

    return (
        <TouchableWithoutFeedback onPress={animateButton} disabled={isDisabled}>
            <Animated.View
                style={[
                    { transform: [{ scale: scaleValue }] },
                    styles.buttonMain,
                    buttonName === changedText ? styles.buttonTransparent
                        : color === Color.BLACK ? styles.buttonBlack
                            : styles.buttonGreen,
                    isDisabled && styles.buttonDisabled
                ]}
            >
                <Text style={[
                    styles.buttonMainText,
                    buttonName === changedText ? styles.buttonTransparentText
                        : color === Color.BLACK ? styles.buttonBlackText
                            : styles.buttonGreenText,
                ]}>
                    {buttonName}
                </Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    buttonMain: {
        justifyContent: 'center',
        alignItems: 'center',
        //borderColor: Colors.black,
        height: 40,
        minWidth: 80,
    },
    buttonGreen: {
        backgroundColor: Colors.green,
        shadowRadius: 0,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 1,
        shadowColor: '#555',
    },
    buttonBlack: {
        borderColor: Colors.black,
        backgroundColor: Colors.white,
        borderWidth: 1,
        shadowRadius: 0,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    buttonTransparent: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.black,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonMainText: {
        fontSize: 14,
        textAlign: 'center',
    },
    buttonTransparentText: {
        color: Colors.black,
    },
    buttonBlackText: {
        color: Colors.black,
    },
    buttonGreenText: {
        color: Colors.white
    }
});
