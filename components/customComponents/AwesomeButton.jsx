import {Text, StyleSheet, Animated, TouchableWithoutFeedback, ActivityIndicator, View, Image} from 'react-native';
import React, {useState, useEffect, useMemo, useRef} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts } from '../../utils/colorUtils';
import { Ionicons } from '@expo/vector-icons';

export const Color = {
    GREEN: 1,
    BLACK: 2,
    WHITE: 3,
};

export default function AwesomeButton({
                                          text,
                                          screenName,
                                          textElement,
                                          params = {},
                                          color = Color.GREEN,
                                          additionalFunc,
                                          changedText,
                                          isInChangedTextMode = false,
                                          disabled = false,
                                          settingButton = false,
                                          loading: externalLoading = false,
                                          manual = false,
                                          disableNavigation = false,
                                      }) {
    const navigation = disableNavigation ? null : useNavigation();
    const [buttonName, setButtonName] = useState(text);
    const [internalLoading, setInternalLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(disabled);
    const scaleValue = useState(new Animated.Value(1))[0];

    const loading = useRef( manual ? externalLoading : internalLoading);

    useEffect(() => {
        loading.current = manual ? externalLoading : internalLoading;
    }, [externalLoading, manual, internalLoading]);

    useEffect(() => {
        const newName = isInChangedTextMode ? changedText : text;
        if (buttonName !== newName) {
            setButtonName(newName);
        }
    }, [isInChangedTextMode, changedText, text, buttonName]);

    const onPressHandler = async () => {
        if (isDisabled || loading.current) return;

        if (!manual) {
            setInternalLoading(true);
            loading.current = true;
        }

        try {
            if (screenName && !disableNavigation) {
                navigation.navigate(screenName, params);
            }
            if (additionalFunc) {
                await additionalFunc();
            }
        } finally {
            if (!manual) {
                setInternalLoading(false);
                loading.current = false;
            }
        }
    };

    const animateButton = () => {
        if (isDisabled || loading.current) return;

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
        <TouchableWithoutFeedback onPress={animateButton} disabled={isDisabled || loading.current}>
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
                    {loading.current ? (
                        <ActivityIndicator size="small" color={color === Color.BLACK ? Colors.white : Colors.black} />
                    ) : textElement ? (
                        <Text style={[styles.buttonMainText, textStyle, settingButton && styles.leftAlignedText]}>
                            {textElement}
                        </Text>
                    ) : (
                        <Text style={[styles.buttonMainText, textStyle, settingButton && styles.leftAlignedText]}>
                            {buttonName}
                        </Text>
                    )}
                    {settingButton && (
                        <Image
                            source={require('../../assets/images/arrowBlack.png')}
                            style={{ width: 14, height: 14 }}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    buttonMain: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        minWidth: 85,
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
        backgroundColor: Colors.grey,
    },
    buttonMainText: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: Fonts.medium
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
