import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { Colors } from '../../utils/colorUtils';

const HeaderRightButton = ({ onPress, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{ paddingRight: 15 }}
            disabled={isLoading}
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
    },
});