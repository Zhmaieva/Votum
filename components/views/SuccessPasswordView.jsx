import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import { Fonts, Colors } from '../../utils/colorUtils';
import {globalEventEmitter} from "../../shared/common";
import {VERIFICATION_FLOW_TYPE} from "./SuccessView";

export default function SuccessPasswordView({ navigation, route }) {
    const flowType = route.params.flowType;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Password updated successfully</Text>
                <AwesomeButton
                    text="Continue to app"
                    color={Color.BLACK}
                    additionalFunc={() => {
                        if (flowType === VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD) {
                            globalEventEmitter.emit('passwordReset');
                            return;
                        }

                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'MY PROFILE',
                                    state: {
                                        routes: [{name: 'Profile'}],
                                    },
                                },
                            ],
                        });
                    }
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