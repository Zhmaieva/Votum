import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';

const AwesomeLoadingPoll = () => (
    <View style={styles.container}>
        <View style={styles.question} />
        <View style={styles.option} />
        <View style={styles.option} />
        <View style={styles.option} />
        <View style={styles.metaRow}>
            <View style={styles.meta} />
            <View style={styles.meta} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 15,
        borderWidth: 1,
        borderColor: Colors.lightGrey,
        backgroundColor: Colors.white,
        marginVertical: 10,
        marginBottom: 200
    },
    question: {
        width: '80%',
        height: 16,
        backgroundColor: Colors.lightGrey,
        marginBottom: 12,
    },
    option: {
        width: '100%',
        height: 14,
        backgroundColor: Colors.grey,
        marginBottom: 10,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    meta: {
        width: '30%',
        height: 12,
        backgroundColor: Colors.lightGrey,
    },
});

export default AwesomeLoadingPoll;
