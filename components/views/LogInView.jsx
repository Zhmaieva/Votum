import React from 'react';
import {View, StyleSheet, TextInput, Text} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {fetchMyProfile, signIn} from "../../shared/api/apiClient";
import {useFocusEffect} from "@react-navigation/native";

const LogInView = ({route }) => {

    const { text } = route.params || {};

    useFocusEffect(
        React.useCallback(() => {
            getDataService().setUser({});
        }, [])
    );

    return (
        <View style={styles.container}>
            <View>
                <View>
                    <AwesomeEmailInput bareStyle={false} />
                </View>
                <View>
                    <AwesomePasswordInput />
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text="Log in" color={Color.GREEN} additionalFunc={async () => {
                        console.log(`${getDataService().getUser().email} : ${getDataService().getUser().password}`);
                        const result = await signIn(
                            getDataService().getUser().email,
                            getDataService().getUser().password);
                        if (result) {
                            getDataService().setUser(null); // pretend we never set the user, so it will be initialised later in profile view
                            globalEventEmitter.emit('signIn', { });
                        } else {
                            // if login failed logic here
                        }
                    }} />
                </View>
            </View>
            <View style={styles.margin15}>
                <View style={styles.margin15}>
                    <AwesomeButton text='Forgot password?' color={Color.GREEN} />
                </View>
                <AwesomeButton text="Create new account" color={Color.BLACK} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 15,
        justifyContent: "space-between"
    },
    row: {
        flexDirection: 'row'
    },
    margin15: {
        marginBottom: 15
    },
    centeredStyle: {
        alignItems: 'center'
    }
});

export default LogInView;