import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {Colors} from "../../utils/colorUtils";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import AwesomeBirthPicker from "../customComponents/AwesomeBirthPicker";

export default function AgeView () {

    const [dateOfBirth, setDateOfBirth] = useState(null);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.firstSubContainer}>
                    <Text style={styles.headerStyle}>Select Your Birth Date</Text>
                    <Text style={styles.margin10}>Optional</Text>
                    <View style={styles.margin10}>
                        <AwesomeBirthPicker dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} />
                    </View>
                    <View style={styles.subContainer}>
                        <AwesomeButton text='Next' color={Color.BLACK} screenName='Categories' />
                    </View>
                </View>
                <View style={styles.secondSubContainer}>
                    <AwesomeButton text='Skip' color={Color.WHITE} screenName='Categories' />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    container: {
        padding: 15,
        flex: 1,
        justifyContent: 'center'
    },
    firstSubContainer: {
        width: '100%',
        marginBottom: 15,
    },
    secondSubContainer: {
        width: '100%',
        marginBottom: 20
    },
    headerStyle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 2
    },
    margin10: {
        marginBottom: 10
    }
});