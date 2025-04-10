import React, { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal} from 'react-native';
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
        <View style={styles.container}>
            <View>
                <AwesomeProfilePhoto profileImage={profileImage} setProfileImage={setProfileImage} />
                <View style={styles.row}>
                    <View style={styles.headerStyle}>
                        <Text>Username</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <AwesomeEditButton
                            screenName="Edit username"
                            text={username}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.headerStyle}>
                        <Text>Bio</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <AwesomeEditButton
                            screenName="Edit bio"
                            text={bioD}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.headerStyle}>
                        <Text>Email</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <AwesomeEditButton
                            screenName="Edit email"
                            text={email}
                        />
                    </View>
                </View>
                <View style={styles.marginTest}>
                    <AwesomeButton
                        text="Log out"
                        color={Color.GREEN}
                        screenName={null}
                        additionalFunc={async () => {
                            await signOut();
                        }}
                    />
                </View>
            </View>

            <AwesomeButton
                text="Delete profile"
                color={Color.BLACK}
                screenName={null}
                additionalFunc={()=>setDeleteModalVisible(true)}
            />

            <AwesomeModal
                visible={isDeleteModalVisible}
                text="DELETE PROFILE"
                subtext="Are you sure you want to delete your profile? This action is irreversible and will permanently remove all your data."
                buttonText="Delete my pofile"
                secondaryText="Cancel"
                onPress={async () => {
                    setDeleteModalVisible(false);
                    const result = await deleteUserProfile();
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.white,
        justifyContent: 'space-between'
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    imagePickerButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.green,
        padding: 5,
    },
    input: {
        height: 40,
        borderColor: '#999',
        borderBottomWidth: 1,
        paddingHorizontal: 10
    },
    inputContainer: {
        width: '74%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    headerStyle: {
        width: '26%',
        justifyContent: "center"
    },
    test: {
        width: 100
    }
});

export default ProfileEditView;