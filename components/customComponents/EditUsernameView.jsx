import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeUsernameInput from "../customComponents/AwesomeUsernameInput";

const EditUsernameView = ({ route }) => {

    return (
        <View style={styles.container}>
            <AwesomeUsernameInput />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 15,
    },
});

export default EditUsernameView;