import React, {useState} from 'react';
import {View, StyleSheet, TextInput, Text, Modal, TouchableWithoutFeedback, TouchableOpacity} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomePasswordInput from "../customComponents/AwesomePasswordInput";
import {useNavigation} from "@react-navigation/native";
import {signIn} from "../../shared/api/apiClient";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {AwesomeModal} from "../customComponents/AwesomeModal";

const EmailRegisterView = ({route }) => {

    const { text } = route.params || {};
    const [isModalVisible, setModalVisible] = useState(false);
    const errorText = 'Email is already taken';

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.emailInputContainer}>
                    <AwesomeEmailInput value={text} bareStyle={false}/>
                </View>
                <AwesomePasswordInput />
                <View style={styles.nextButtonContainer}>
                    <AwesomeButton text="Next" color={Color.GREEN} additionalFunc={async () => {
                        // const result = await signIn(
                        //     getDataService().getUser().email,
                        //     getDataService().getUser().password);
                        // if (result) {
                        //     getDataService().setUser(null); // pretend we never set the user, so it will be initialised later in profile view
                        //     globalEventEmitter.emit('signIn', { });
                        //     navigation.navigate("Verification Code");
                        // } else {
                        //     console.log(result);
                        //     setModalVisible(true);
                        // }
                        console.log('next')
                        setModalVisible(true);
                    }} />
                </View>
            </View>
            <View style={styles.margin15}>
                <View style={styles.questionContainer}>
                    <Text style={styles.questionStyle}>Already have an account?</Text>
                </View>
                <AwesomeButton text='Log in' color={Color.BLACK} />
            </View>
            <AwesomeModal visible={isModalVisible} text={errorText} onPress={() => setModalVisible(false)}/>
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
    emailInputContainer: {
        marginBottom: 3,
    },
    nextButtonContainer: {
        marginBottom: 18
    },
    margin15: {
        marginBottom: 15
    }
});

export default EmailRegisterView;