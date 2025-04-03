import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text, TouchableWithoutFeedback, TouchableOpacity, Modal} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomeLink from "../customComponents/AwesomeLink";
import VerificationCodeView from "./VerificationCodeView";
import AwesomeUsernameInput from "../customComponents/AwesomeUsernameInput";
import { checkUsernameAvailability } from "../../shared/api/apiClient";

const UsernameView = ({route }) => {

    const { text } = route.params || {};

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModal2Visible, setModal2Visible] = useState(false);

    return (
        <View style={styles.container}>
            <View>
                <AwesomeUsernameInput checkUsernameAvailability={checkUsernameAvailability} />
                <View style={styles.nextButtonContainer}>
                    <AwesomeButton text="Create account" color={Color.GREEN} screenName='Wellcome' />
                </View>
                <AwesomeButton text='TEMP: error if username is empty' color={Color.BLACK} additionalFunc={()=>setModalVisible(true)} />
                <AwesomeButton text='TEMP: error if username is taken' color={Color.BLACK} additionalFunc={()=>setModal2Visible(true)} />
            </View>
            <View style={styles.margin15}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionStyle}>Already have an account?</Text>
                </View>
                <AwesomeButton text='Log in' color={Color.BLACK} screenName='Log in' />
            </View>
            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Username cannot be empty, try again</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButton}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Modal visible={isModal2Visible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModal2Visible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>This username is already taken, try again</Text>
                            <TouchableOpacity onPress={() => setModal2Visible(false)}>
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
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row'
    },
    logInStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: Colors.black
    },
    questionContainer: {
        alignItems: 'center',
        marginBottom: 10
    },
    questionStyle: {
        fontSize: 14,
        color: Colors.black
    },
    nextButtonContainer: {
        marginBottom: 18
    },
    margin15: {
        marginBottom: 15
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

export default UsernameView;