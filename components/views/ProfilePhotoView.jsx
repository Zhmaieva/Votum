import {Text, View, StyleSheet } from 'react-native';
import React, {useState} from 'react';
import {Colors} from "../../utils/colorUtils";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import AwesomeProfilePhoto from "../customComponents/AwesomeProfilePhoto";
import AgeView from "./AgeView";

export default function ProfilePhotoView () {

    const [profileImage, setProfileImage] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <AwesomeProfilePhoto profileImage={profileImage} setProfileImage={setProfileImage} />
                <View style={styles.buttonContainer}>
                    <AwesomeButton text='Next' color={Color.GREEN} screenName='Age' />
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <AwesomeButton text='Skip' color={Color.BLACK} screenName='Age' />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        padding: 15,
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 20
    },
    subContainer: {
        width: '100%',
    }
});