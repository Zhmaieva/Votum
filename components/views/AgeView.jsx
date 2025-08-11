import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors, Fonts} from "../../utils/colorUtils";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import AwesomeBirthPicker from "../customComponents/AwesomeBirthPicker";
import {getDataService} from "../../shared/common";
import {useNavigation, useNavigationContainerRef} from "@react-navigation/native";
import {updateBirthdate} from "../../shared/api/apiClient";

export default function AgeView () {

    const [dateOfBirth, setDateOfBirth] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        setDateOfBirth(new Date(getDataService()?.getUser()?.birthdate));
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.firstSubContainer}>
                    <Text style={styles.headerStyle}>Select Your Birth Date</Text>
                    <Text style={{marginBottom: 15, fontFamily: Fonts.regular,}}>Personalize your profile</Text>
                    <View style={styles.margin20}>
                        <AwesomeBirthPicker dateOfBirth={dateOfBirth} setDateOfBirth={setDateOfBirth} />
                    </View>
                    <View style={styles.subContainer}>
                        <AwesomeButton text='Next' color={Color.BLACK} additionalFunc={async () => {
                            getDataService().commitUserChanges();
                            updateBirthdate().then(_ => {});

                            navigation.navigate('Categories', {});
                        }}/>
                    </View>
                </View>
                <View style={styles.secondSubContainer}>
                    <AwesomeButton text='Skip' color={Color.WHITE} screenName='Categories' />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    container: {
        padding: 15,
        flex: 1,
        justifyContent: 'center'
    },
    firstSubContainer: {
        width: '100%',
        marginBottom: 15
    },
    secondSubContainer: {
        width: '100%',
    },
    headerStyle: {
        fontSize: 24,
        fontFamily: Fonts.medium,
        marginBottom: 2
    },
    margin20: {
        marginBottom: 15
    }
});