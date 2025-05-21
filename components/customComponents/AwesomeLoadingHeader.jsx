import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';

const AwesomeLoadingHeader = () => (
    <View style={styles.container}>
        <View style={styles.avatar} />
        <View style={styles.textContainer}>
            <View style={styles.username} />
            <View style={styles.followers} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: 0,
    },
    avatar: {
        width: 55,
        height: 55,
        backgroundColor: Colors.grey,
        marginRight: 8,
    },
    textContainer: {
        flex: 1,
    },
    username: {
        width: '50%',
        height: 16,
        backgroundColor: Colors.lightGrey,
        marginBottom: 8,
    },
    followers: {
        width: '30%',
        height: 12,
        backgroundColor: Colors.lightGrey,
    },
});

export default AwesomeLoadingHeader;