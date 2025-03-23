import {
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/colorUtils';

export default function AwesomeEditButton({
                                          text,
                                          screenName,
                                          params = {}, // Accept params for navigation
                                          additionalFunc,
                                      }) {
    const navigation = useNavigation();
    const onPressHandler = () => {
        if (screenName) {
            params.text = text;
            navigation.navigate(screenName, params); // Pass params to navigation
        }

        if (additionalFunc) {
            additionalFunc();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={onPressHandler}>
            <View style={styles.buttonMain}>
                <Text style={styles.buttonMainText}>{text}</Text>
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
