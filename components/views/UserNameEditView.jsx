import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Platform
} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, {Color} from '../customComponents/AwesomeButton'; // Reuse your AwesomeButton component

const UserNameEditView = ({ navigation, route }) => {

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                //value={username}
                //onChangeText={setUsername}
                placeholder="New username"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: Colors.white,
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: Colors.lightGrey,
        borderBottomWidth: 1,
        //borderTopWidth: 1,
        paddingHorizontal: 10
    }
});

export default UserNameEditView;