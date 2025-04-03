import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity, Modal} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {fetchMyProfile, signIn} from "../../shared/api/apiClient";
import {useFocusEffect} from "@react-navigation/native";

const LogInView = ({route }) => {

    const { text } = route.params || {};

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
                        console.log(`${getDataService().getUser().email} : ${getDataService().getUser().password}`);
                        const result = await signIn(
                            getDataService().getUser().email,
                            getDataService().getUser().password);
                        if (result) {
                            getDataService().setUser(null); // pretend we never set the user, so it will be initialised later in profile view
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
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Incorrect username or password, try again</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButton}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalButton: {
        color: Colors.green,
        fontSize: 16,
        marginTop: 10,
    },
});

export default LogInView;