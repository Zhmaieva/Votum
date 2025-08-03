import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import { Fonts, Colors } from '../../utils/colorUtils';

export default function SuccessPasswordView({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Password updated successfully</Text>
                <AwesomeButton
                    text="Continue to app"
                    color={Color.BLACK}
                    additionalFunc={() =>
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'MY PROFILE',
                                    state: {
                                        routes: [{ name: 'Profile' }],
                                    },
                                },
                            ],
                        })
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 15,
    },
    title: {
        fontSize: 22,
        fontFamily: Fonts.medium,
        marginBottom: 20,
        color: Colors.black,
    },
});