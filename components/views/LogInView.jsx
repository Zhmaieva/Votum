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
import { Colors, Fonts} from '../../utils/colorUtils';
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
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View>
                    <Text style={styles.headerStyle}>Email address</Text>
                    <View style={{marginBottom: 5}}>
                        <AwesomeEmailInput bareStyle={false} />
                    </View>
                    <Text style={styles.headerStyle}>Password</Text>
                    <View style={{marginBottom: 10}}>
                        <AwesomePasswordInput />
                    </View>
                    <View style={styles.margin15}>
                        <AwesomeButton text="Log in" color={Color.BLACK} additionalFunc={async () => {
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
                        <AwesomeButton text='Forgot password?' color={Color.BLACK} screenName='Forgot password' />
                    </View>
                    <AwesomeButton text="Create new account" color={Color.WHITE} screenName='Email Register' />
                </View>
                <AwesomeModal visible={isModalVisible}
                              text="LOGIN FAILED"
                              subtext="Incorrect username or password, try again"
                              buttons={[
                                  { label: "OK", onPress: () => setModalVisible(false) },
                              ]}
                              onBackPress={_ => {setModalVisible(false)}}/>
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
    headerStyle: {
        marginBottom: 5,
        fontFamily: Fonts.medium,
    }
});

export default LogInView;