import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput"; // Reuse your AwesomeButton component

const EmailEditView = ({route }) => {

    const { text } = route.params || {};

    return (
        <View style={styles.container}>
            <AwesomeEmailInput value={text}/>
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

export default EmailEditView;