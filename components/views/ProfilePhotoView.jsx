import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import {Colors, Fonts} from "../../utils/colorUtils";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import AwesomeProfilePhoto from "../customComponents/AwesomeProfilePhoto";
import AgeView from "./AgeView";
import {useFocusEffect} from "@react-navigation/native";
import {getDataService} from "../../shared/common";
import {fetchMyProfile} from "../../shared/api/apiClient";

export default function ProfilePhotoView () {

    const [profileImage, setProfileImage] = useState('');

    useFocusEffect(() => {
        getDataService().resetUserChanges();

        fetchMyProfile().then(res => {
            if (res?.username) {
                setProfileImage(res.image);
                getDataService().setUser(res);
            }
        });
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.headerStyle}>Upload Your Profile Photo</Text>
                <Text style={{marginBottom: 10, fontFamily: Fonts.regular}}>Optional</Text>
                <View style={styles.subContainer}>
                    <View style={styles.margin10}>
                        <AwesomeProfilePhoto profileImage={profileImage} setProfileImage={setProfileImage} />
                    </View>
                    {
                        profileImage ? (
                            <View style={styles.buttonContainer}>
                                <AwesomeButton text='Next' color={Color.BLACK} screenName='Age' />
                            </View>
                        ) : (
                            <View style={styles.buttonContainer}>
                                <AwesomeButton text='Skip' color={Color.WHITE} screenName='Age' />
                            </View>
                        )
                    }
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
    subContainer: {
        width: '100%',
    },
    buttonContainer: {
        marginBottom: 15
    },
    headerStyle: {
        marginBottom: 2,
        fontFamily: Fonts.medium,
        fontSize: 24
    },
    margin10: {
        marginBottom: 10
    }
});