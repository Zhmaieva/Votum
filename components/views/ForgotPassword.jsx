import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Modal,
    SafeAreaView
} from 'react-native';
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.headerStyle}>Email address</Text>
                    <View style={styles.margin10}>
                        <AwesomeEmailInput bareStyle={false} />
                    </View>
                    <View style={styles.margin15}>
                        <AwesomeButton text="Reset Your Password" color={Color.BLACK} screenName='Verification Code' />
                    </View>
                    <AwesomeButton text='TEMP: error if email is not registered of empty' color={Color.BLACK} additionalFunc={()=>setModalVisible(true)} />
                </View>
                <View style={styles.margin15}>
                    <View style={styles.margin15}>
                        <AwesomeButton text="Create new account" color={Color.BLACK} screenName='Email Register' />
                    </View>
                    <AwesomeButton text='Log in' color={Color.WHITE} screenName='Log in' />
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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
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
    headerStyle: {
        fontWeight: 'bold',
        marginBottom: 5
    },
    margin10: {
        marginBottom: 7
    }
});

export default ForgotPasswordView;