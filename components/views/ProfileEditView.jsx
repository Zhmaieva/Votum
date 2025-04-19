import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Modal,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, {Color} from '../customComponents/AwesomeButton';
import AwesomeEditButton from "../customComponents/AwesomeEditButton";
import {deleteUserProfile, fetchMyProfile, signOut} from "../../shared/api/apiClient";
import {getDataService} from "../../shared/common";
import {useFocusEffect} from "@react-navigation/native";
import AwesomeProfilePhoto from "../customComponents/AwesomeProfilePhoto";
import AwesomeCategory from "../customComponents/AwesomeCategory";
import {AwesomeModal} from "../customComponents/AwesomeModal";

const ProfileEditView = ({ route }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bioD, setBioD] = useState('');
    const [profileImage, setProfileImage] = useState(getDataService().getUser()?.image ?? '');
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isErrorModalVisible, setErrorModalVisible] = useState(false);

    useFocusEffect(() => {
        getDataService().resetUserChanges();

        const savedEmail = getDataService().getUser()?.email;
        if (savedEmail) // immediately get last locally saved email
            setEmail(savedEmail);

        const savedUsername = getDataService().getUser()?.username;
        if (savedUsername) // immediately get last locally saved username
            setUsername(savedUsername);

        const savedBio = getDataService().getUser()?.bio;
        if (savedBio) // immediately get last locally saved bio
            setBioD(savedBio);

        const savedImage = getDataService().getUser()?.image;
        if (savedImage) // immediately get last locally saved image
        {
            setProfileImage(savedImage);
        }

        if (!getDataService().getUser()) { // fallback to fetching data from server if no local temp data
            fetchMyProfile().then(res => {
                if (res?.username) {
                    setUsername(res.username);
                    setEmail(res.email);
                    setBioD(res.bio);
                    setProfileImage(res.image);
                    getDataService().setUser(res);
                }
            });
        }
    });

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={[styles.padding2, styles.subContainer]}>
                <AwesomeProfilePhoto profileImage={profileImage} setProfileImage={setProfileImage} />
                <Text style={[styles.sectionName, styles.marginTop15]}>Profile Info</Text>
                <View style={styles.margin15}>
                    <AwesomeButton text='Username' color={Color.WHITE} screenName='Edit username' settingButton={true}/>
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Bio' color={Color.WHITE} screenName='Edit bio' settingButton={true}/>
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Email' color={Color.WHITE} screenName='Edit email' settingButton={true}/>
                </View>
                <Text style={[styles.sectionName, styles.marginTop15]}>Personal Details</Text>
                <View style={styles.margin15}>
                    <AwesomeButton text='Birth Date' color={Color.WHITE} settingButton={true}/>
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Gender' color={Color.WHITE} settingButton={true}/>
                </View>
                <Text style={[styles.sectionName, styles.marginTop15]}>Privacy & Security</Text>
                <View style={styles.margin15}>
                    <AwesomeButton text='Change Password' color={Color.WHITE} settingButton={true}/>
                </View>
                <View style={styles.margin25}>
                    <AwesomeButton text='Notifications' color={Color.WHITE} settingButton={true}/>
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Delete Profile' color={Color.BLACK} additionalFunc={()=>setDeleteModalVisible(true)}/>
                </View>
            </ScrollView>

            {/*<AwesomeButton
                text="Delete profile"
                color={Color.WHITE}
                screenName={null}
                additionalFunc={()=>setDeleteModalVisible(true)}
            />*/}

            <AwesomeModal
                visible={isDeleteModalVisible}
                text="DELETE PROFILE"
                subtext="Are you sure you want to delete your profile? This action is irreversible and will permanently remove all your data."
                buttonText="Delete my pofile"
                secondaryText="Cancel"
                onPress={async () => {
                    setDeleteModalVisible(false);
                    //set another modal visible and after password input, execute the logic below passing input password
                    const result = await deleteUserProfile('hardcoded_password');
                    if (result) {
                        await signOut();
                        return;
                    }

                    setErrorModalVisible(true);
                }}
                onBackPress={() => setDeleteModalVisible(false)}
            />

            <AwesomeModal
                visible={isErrorModalVisible}
                text="Oops"
                subtext="There was an error while trying to delete your profile, try again later."
                onBackPress={() => setErrorModalVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    subContainer: {
        padding: 15
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    margin15: {
        marginBottom: 12
    },
    sectionName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10
    },
    marginTop15: {
        marginTop: 15
    },
    margin25: {
        marginBottom: 25
    }
});

export default ProfileEditView;