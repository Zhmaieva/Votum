import { Text, StyleSheet, Animated, TouchableWithoutFeedback, ActivityIndicator, View } from 'react-native';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/colorUtils';
import { Ionicons } from '@expo/vector-icons';

export const Color = {
    GREEN: 1,
    BLACK: 2,
    WHITE: 3,
};

export default function AwesomeButton({
                                          text,
                                          screenName,
                                          params = {},
                                          color = Color.GREEN,
                                          additionalFunc,
                                          changedText,
                                          isInChangedTextMode = false,
                                          disabled = false,
                                          settingButton = false,
                                          loading: externalLoading = false, // 👈 NEW
                                          manual = false, // 👈 NEW
                                      }) {
    const navigation = useNavigation();
    const [buttonName, setButtonName] = useState(text);
    const [internalLoading, setInternalLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(disabled);
    const scaleValue = useState(new Animated.Value(1))[0];

    const loading = manual ? externalLoading : internalLoading;

    useEffect(() => {
        const newName = isInChangedTextMode ? changedText : text;
        if (buttonName !== newName) {
            setButtonName(newName);
        }
    }, [isInChangedTextMode, changedText, text, buttonName]);

    const onPressHandler = async () => {
        if (isDisabled || loading) return;

        if (!manual) {
            setInternalLoading(true);
        }

        try {
            if (screenName) {
                navigation.navigate(screenName, params);
            }
            if (additionalFunc) {
                await additionalFunc();
            }
        } finally {
            if (!manual) {
                setInternalLoading(false);
            }
        }
    };

    const animateButton = () => {
        if (isDisabled || loading) return;

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

    const buttonStyle = useMemo(() => {
        if (buttonName === changedText) return styles.buttonTransparent;
        switch (color) {
            case Color.BLACK:
                return styles.buttonBlack;
            case Color.WHITE:
                return styles.buttonWhite;
            default:
                return styles.buttonGreen;
        }
    }, [buttonName, changedText, color]);

    const textStyle = useMemo(() => {
        if (buttonName === changedText) return styles.buttonWhiteText;
        switch (color) {
            case Color.BLACK:
                return styles.buttonBlackText;
            case Color.WHITE:
                return styles.buttonWhiteText;
            default:
                return styles.buttonGreenText;
        }
    }, [buttonName, changedText, color]);

    return (
        <TouchableWithoutFeedback onPress={animateButton} disabled={isDisabled || loading}>
            {loading ? (
                <View style={styles.spinnerContainer}>
                    <ActivityIndicator size="small" color={color === Color.BLACK ? Colors.white : Colors.black} />
                </View>
            ) : (
                <Animated.View
                    style={[
                        {
                            transform: [{ scale: scaleValue }],
                        },
                        styles.buttonMain,
                        buttonStyle,
                        isDisabled && styles.buttonDisabled,
                    ]}
                >
                    <View style={[styles.contentWrapper, settingButton && styles.settingWrapper]}>
                        <Text style={[styles.buttonMainText, textStyle, settingButton && styles.leftAlignedText]}>
                            {buttonName}
                        </Text>
                        {settingButton && (
                            <Ionicons name="chevron-forward" size={15} color={Colors.black} style={styles.arrowIcon} />
                        )}
                    </View>
                </Animated.View>
            )}
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    buttonMain: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        minWidth: 87,
        paddingHorizontal: 10
    },
    buttonGreen: {
        backgroundColor: Colors.green,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        borderWidth: 1,
        borderColor: Colors.black,
        shadowColor: Colors.green,
    },
    buttonBlack: {
        backgroundColor: Colors.black,
        borderColor: Colors.black,
        borderWidth: 1,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    buttonTransparent: {
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 1,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    buttonWhite: {
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 1,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonMainText: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '500',
        fontFamily: 'Ubuntu-Bold',
    },
    leftAlignedText: {
        textAlign: 'left',
    },
    buttonBlackText: {
        color: Colors.white,
    },
    buttonGreenText: {
        color: Colors.white,
    },
    buttonWhiteText: {
        color: Colors.black,
    },
    contentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        //backgroundColor: Colors.yellow
    },
    settingWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 5,
    },
    arrowIcon: {
        marginLeft: -5,
    },
    spinnerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        backgroundColor: Colors.black,
        width: '100%',
        borderColor: Colors.black,
        borderWidth: 1,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
});
