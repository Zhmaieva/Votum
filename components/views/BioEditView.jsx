import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";

const BioEditView = ({ navigation, route }) => {
    const { text } = route.params || {};
    const [bio, setBio] = useState(text || '');
    const charLimit = 30;

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={bio}
                onChangeText={setBio}
                placeholder="New bio"
                maxLength={charLimit}
            />
            <Text style={styles.counter}>{bio.length}/{charLimit}</Text>
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
        paddingHorizontal: 10,
    },
    counter: {
        marginTop: 5,
        fontSize: 14,
        color: Colors.black,
        textAlign: 'right',
        paddingRight: 10,
    },
});

export default BioEditView;
