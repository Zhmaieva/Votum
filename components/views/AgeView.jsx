import {Text, View, StyleSheet } from 'react-native';
import React, {useState} from 'react';
import {Colors} from "../../utils/colorUtils";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import AwesomeBirthPicker from "../customComponents/AwesomeBirthPicker";

export default function AgeView () {

    const [dateOfBirth, setDateOfBirth] = useState(null);

    return (
        <View style={styles.container}>
            <AwesomeBirthPicker dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} />
            <View style={styles.subContainer}>
                <AwesomeButton text='Save data' color={Color.GREEN}  />
            </View>
            <View style={styles.subContainer}>
                <AwesomeButton text='Skip' color={Color.BLACK} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 15,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    subContainer: {
        width: '100%',
        marginBottom: 20
    }
});