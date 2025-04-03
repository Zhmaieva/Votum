import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity, Modal} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import AwesomeLink from "../customComponents/AwesomeLink";
import VerificationCodeView from "./VerificationCodeView";

const ForgotPasswordView = ({route }) => {

    const { text } = route.params || {};

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);

    return (
        <View style={styles.container}>
            <View>
                <AwesomeEmailInput bareStyle={false} />
                <View style={styles.margin15}>
                    <AwesomeButton text="Reset Your Password" color={Color.GREEN} screenName='Verification Code' />
                </View>
                <AwesomeButton text='TEMP: error if email is not registered of empty' color={Color.BLACK} additionalFunc={()=>setModalVisible(true)} />
                </View>
            <View style={styles.margin15}>
                <View style={styles.margin15}>
                    <AwesomeButton text='Log in' color={Color.GREEN} screenName='Log in' />
                </View>
                <AwesomeButton text="Create new account" color={Color.BLACK} screenName='Email Register' />
            </View>
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Email is not registered or empty, try again</Text>
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

export default ForgotPasswordView;