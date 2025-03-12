import {
    Text,
    StyleSheet,
    Pressable,
    Animated,
    TouchableWithoutFeedback,
    Alert,
    Modal,
    View
} from 'react-native';
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
                                          color = Color.GREEN,
                                          additionalFunc,
                                          changedText,
                                          disabled = false
                                      }) {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [buttonName, setButtonName] = useState(text);
    const [isDisabled, setIsDisabled] = useState(disabled);
    const scaleValue = useState(new Animated.Value(1))[0];

    const onPressHandler = () => {
        if (isDisabled) return;

        if (screenName) {
            navigation.navigate(screenName);
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
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={styles.centeredView} onPress={() => setModalVisible(false)} />
            </Modal>

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
                        buttonName === changedText && styles.buttonTransparentText
                    ]}>
                        {buttonName}
                    </Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonMain: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.black,
        shadowColor: Colors.black,
        height: 40,
        width: '100%',
        minWidth: 80,
    },
    buttonGreen: {
        backgroundColor: Colors.green,
    },
    buttonBlack: {
        backgroundColor: Colors.black,
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
        color: Colors.white,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'poly',
        fontWeight: '500',
    },
    buttonTransparentText: {
        color: Colors.black,
    },
});
