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
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import AwesomeUsernameInput from "../customComponents/AwesomeUsernameInput";
import {signUpFinish} from "../../shared/api/apiClient";
import {AwesomeModal} from "../customComponents/AwesomeModal";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {useNavigation} from "@react-navigation/native";

const UsernameView = ({}) => {

    const[error, setError] = useState('');

    const usernameEmptyError = 'Username cannot be empty, try again';
    const usernameInvalidError = 'Invalid username, try again';
    const usernameTakenError = 'This username is already taken, try again';

    const [isModalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.headerStyle}>Username</Text>
                    <AwesomeUsernameInput/>
                    <View style={styles.nextButtonContainer}>
                        <AwesomeButton text="Create account" color={Color.BLACK} additionalFunc={async () => {
                            const username = getDataService()?.getUser()?.username;
                            const password = getDataService()?.getUser()?.password ?? '';

                            if (username === null) {
                                setError(usernameTakenError);
                                setModalVisible(true);
                                return;
                            }

                            if (!username) {
                                setError(usernameEmptyError);
                                setModalVisible(true);
                                return;
                            }

                            if (!password) {
                                navigation.navigate('Email Register')
                            }

                            const response = await signUpFinish(username, password);

                            console.log(response);
                            if (response.success) {
                                globalEventEmitter.emit('signIn', {})
                                return;
                            }

                            if (response.code === 401) {
                                navigation.navigate('Email Register')
                                return;
                            }

                            if (response.code === 409) {
                                setError(usernameTakenError);
                                setModalVisible(true);
                                return;
                            }

                            if (response.code === 400) {
                                setError(usernameInvalidError);
                                setModalVisible(true);
                            }
                        }}/>
                    </View>
                </View>
                <View style={styles.margin15}>
                    <View style={styles.questionContainer}>
                        <Text style={styles.questionStyle}>Already have an account?</Text>
                    </View>
                    <AwesomeButton text='Log in' color={Color.WHITE} screenName='Log in' />
                </View>
            </View>
            <AwesomeModal visible={isModalVisible}
                          text={error}
                          onPress={_ => {setModalVisible(false)}}
                          onBackPress={_ => {setModalVisible(false)}}/>
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
    headerStyle: {
        fontWeight: 'bold',
        marginBottom: 5
    }
});

export default UsernameView;