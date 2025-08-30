import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeEmailInput from "../customComponents/AwesomeEmailInput";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import {emailVerify, emailVerifyStart, signUpStart} from "../../shared/api/apiClient";
import {getDataService} from "../../shared/common";
import {useNavigation} from "@react-navigation/native";
import {AwesomeModal} from "../customComponents/AwesomeModal";
import { SafeAreaView } from 'react-native-safe-area-context';

const EmailEditView = ({route }) => {

    const { text } = route.params || {};

    const [isModalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');

    const emailIsAlreadyTakenError = 'Email is already taken';
    const invalidEmailError = 'Invalid email';

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['bottom']}>
            <View style={styles.container}>
                <Text style={[styles.margin10, { fontFamily: Fonts.medium, fontSize: 20 }]}>Change Email</Text>
                <Text style={styles.subtittle}>enter new email</Text>
                <View style={styles.margin10}>
                    <AwesomeEmailInput value={text} bareStyle={true}/>
                </View>
                <AwesomeButton text='Send verification code' color={Color.BLACK} additionalFunc={async () => {
                    let email = getDataService()?.getUser()?.email ?? '';
                    if (!email) {
                        email = getDataService()?.getEmailToSet();
                    }

                    console.log('email edit view:', email);
                    if (!email) {
                        setError(invalidEmailError);
                        setModalVisible(true);
                        return;
                    }

                    const response = await emailVerifyStart(email);

                    if (response.success) {
                        navigation.navigate("Verification Code");
                        return;
                    }

                    if (response.code === 409) {
                        setError(emailIsAlreadyTakenError);
                        setModalVisible(true);
                        return;
                    }

                    if (response.code === 400) {
                        setError(invalidEmailError);
                        setModalVisible(true);
                    }
                }}/>
                <AwesomeModal
                    visible={isModalVisible}
                    text="EMAIL ERROR"
                    subtext={error}
                    buttons={[
                        { label: "OK", onPress: () => setModalVisible(false) },
                    ]}
                    onBackPress={() => setModalVisible(false)} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15
    },
    input: {
        height: 40,
        width: '100%',
        borderColor: Colors.lightGrey,
        borderBottomWidth: 1,
        paddingHorizontal: 10
    },
    margin10: {
        marginBottom: 10
    },
    subtittle: {
        fontSize: 14,
        color: Colors.grey,
        marginBottom: 5,
        fontFamily: Fonts.regular,
    }
});

export default EmailEditView;