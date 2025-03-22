import {
    Text,
    StyleSheet,
    Pressable,
    Animated,
    TouchableWithoutFeedback,
    Modal,
    View
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/colorUtils';

export default function AwesomeEditButton({
                                          text,
                                          screenName,
                                          params = {}, // Accept params for navigation
                                          additionalFunc,
                                      }) {
    const navigation = useNavigation();
    const [buttonName, setButtonName] = useState(text);
    const scaleValue = useState(new Animated.Value(1))[0];

    const onPressHandler = () => {

        if (screenName) {
            navigation.navigate(screenName, params); // Pass params to navigation
        }

        if (additionalFunc) {
            additionalFunc();
        }

    };

    return (
        <TouchableWithoutFeedback onPress={onPressHandler}>
            <View style={styles.buttonMain}>
                <Text style={styles.buttonMainText}>{buttonName}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    buttonMain: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderColor: "#999",
        borderBottomWidth: 1,
        height: 40,
    },
    buttonMainText: {
        color: Colors.black,
        fontSize: 14,
        textAlign: 'center',
    },
});
