import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity, Modal} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {signIn} from "../../shared/api/apiClient";
import {useFocusEffect} from "@react-navigation/native";
import {AwesomeModal} from "../customComponents/AwesomeModal";

const LogInView = ({ }) => {

    const [isModalVisible, setModalVisible] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            getDataService().setUser({});
        }, [])
    );

    return (
        <View style={styles.container}>
            <View>
                <AwesomeEmailInput bareStyle={false} />
                <AwesomePasswordInput />
                <View style={styles.margin15}>
                    <AwesomeButton text="Log in" color={Color.GREEN} additionalFunc={async () => {
                        const result = await signIn(
                            getDataService().getUser().email,
                            getDataService().getUser().password);
                        if (result) {
                            globalEventEmitter.emit('signIn', { });
                        } else {
                            setModalVisible(true)
                        }
                    }} />
                </View>
            </View>
            <View style={styles.margin15}>
                <View style={styles.margin15}>
                    <AwesomeButton text='Forgot password?' color={Color.GREEN} screenName='Forgot password' />
                </View>
                <AwesomeButton text="Create new account" color={Color.BLACK} />
            </View>
            <AwesomeModal visible={isModalVisible}
                          text={"Incorrect username or password, try again"}
                          onPress={_ => {setModalVisible(false)}}
                          onBackPress={_ => {setModalVisible(false)}}/>
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
    },
});

export default LogInView;