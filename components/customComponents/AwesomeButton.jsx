import {Text, StyleSheet, Platform, Animated, TouchableWithoutFeedback, ActivityIndicator, View, Image, Pressable } from 'react-native';
import React, {useState, useMemo} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors, Fonts } from '../../utils/colorUtils';
import { Shadow } from 'react-native-shadow-2';

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
    const scaleValue = useState(new Animated.Value(1))[0];

    // 🔑 Single source of truth for loader
    const isLoading = manual ? externalLoading : internalLoading;
    const isDisabled = disabled || isLoading;

    // keep button text in sync
    React.useEffect(() => {
        const newName = isInChangedTextMode ? changedText : text;
        if (newName !== undefined && buttonName !== newName) {
            setButtonName(newName);
        }
    }, [isInChangedTextMode, changedText, text, buttonName]);

    const onPressHandler = async () => {
        if (isDisabled) return;

        if (!manual) setInternalLoading(true);

        try {
            if (screenName && !disableNavigation) {
                navigation?.navigate(screenName, params);
            }
            if (additionalFunc) {
                await additionalFunc();
            }
        } finally {
            if (!manual) setInternalLoading(false);
        }
    };

    const animateButton = () => {
        if (isDisabled) return;
        Animated.sequence([
            Animated.timing(scaleValue, { toValue: 0.95, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleValue, { toValue: 1, duration: 130, useNativeDriver: true }),
        ]).start(onPressHandler);
    };

    const buttonStyle = useMemo(() => {
        if (buttonName === changedText) return styles.buttonTransparent;
        switch (color) {
            case Color.BLACK: return styles.buttonBlack;
            case Color.WHITE: return styles.buttonWhite;
            default: return styles.buttonGreen;
        }
    }, [buttonName, changedText, color]);

    const textStyle = useMemo(() => {
        if (buttonName === changedText) return styles.buttonWhiteText;
        switch (color) {
            case Color.BLACK: return styles.buttonBlackText;
            case Color.WHITE: return styles.buttonWhiteText;
            default: return styles.buttonGreenText;
        }
    }, [buttonName, changedText, color]);

    return (
        <Pressable onPress={animateButton} disabled={isDisabled} hitSlop={8}>
            <Animated.View
                style={[
                    { transform: [{ scale: scaleValue }] },
                    disabled && styles.buttonDisabled,
                ]}
            >
            <Shadow
                distance={0}
                style={{ width: '100%' }}
                offset={[3, 3]}
                startColor="rgba(147,165,72)"
                finalColor="rgba(147,165,72)"
                viewStyle={{ borderRadius: 0 }}
            >
                    <View
                style={[
                    styles.buttonMain,
                   buttonStyle,
                settingButton ? styles.settingWrapper : styles.centerWrapper,
                ]}
                >
                    >
                        {isLoading ? (
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

            </Shadow>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonMain: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        width: '100%',
        marginHorizontal: -3,
        paddingHorizontal: 10,
        borderRadius: 0,
    },
    buttonGreen: { backgroundColor: Colors.green, borderWidth: 1, borderColor: Colors.black },
    buttonBlack: { backgroundColor: Colors.black,  borderWidth: 1, borderColor: Colors.black },
    buttonWhite: { backgroundColor: Colors.white,  borderWidth: 1, borderColor: Colors.black },
    buttonTransparent: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.black },
    buttonDisabled: { backgroundColor: Colors.grey },
    buttonMainText: { fontSize: 15, textAlign: 'center', fontFamily: Fonts.medium },
    leftAlignedText: { textAlign: 'left' },
    buttonBlackText: { color: Colors.white },
    buttonGreenText: { color: Colors.white },
    buttonWhiteText: { color: Colors.black },
    contentWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    centerWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
});
