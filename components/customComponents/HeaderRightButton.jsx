import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors, Fonts} from '../../utils/colorUtils';

const HeaderRightButton = ({ onPress, isLoading, disabled = false }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ paddingRight: 15 }}
            disabled={isLoading || disabled}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={Colors.green} />
            ) : (
                <Text style={styles.buttonText}>Done</Text>
            )}
        </TouchableOpacity>
    );
};

export default HeaderRightButton;

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 16,
        color: Colors.green,
        fontFamily: Fonts.regular
    },
});