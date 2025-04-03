import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Alert, TouchableWithoutFeedback, Modal} from 'react-native';
import { Colors } from '../../utils/colorUtils'; // assuming Colors is your utility file for color styles
import * as ImagePicker from 'expo-image-picker';
import AwesomeButton, {Color} from '../customComponents/AwesomeButton'; // Reuse your AwesomeButton component
import { Ionicons } from '@expo/vector-icons';
import AwesomeEditButton from "../customComponents/AwesomeEditButton";
import {fetchMyProfile, signOut} from "../../shared/api/apiClient";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {useFocusEffect} from "@react-navigation/native";

const ProfileEditView = ({ route }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bioD, setBioD] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

    const dataService = getDataService();

    useFocusEffect(() => {
        dataService.resetUserChanges();

        const savedEmail = dataService.getUser()?.email;
        if (savedEmail) // immediately get last locally saved email
            setEmail(savedEmail);

        const savedUsername = dataService.getUser()?.userName;
        if (savedUsername) // immediately get last locally saved username
            setUsername(savedUsername);

        const savedBio = dataService.getUser()?.bio;
        if (savedBio) // immediately get last locally saved bio
            setBioD(savedBio);

        if (!dataService.getUser()) { // fallback to fetching data from server if no local temp data
            fetchMyProfile().then(res => {
                if (res?.userName) {
                    setUsername(res.userName);
                    setEmail(res.email);
                    setBioD(res.bio);
                    setProfileImage(res.image);
                    dataService.setUser(res);
                }
            });
        }
    });

    const handleImagePick = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'We need permission to access your gallery');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={{ uri: profileImage }}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                        <Ionicons name="camera" size={24} color={Colors.white} />
                    </TouchableOpacity>
                </View>

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
                additionalFunc={()=>setModalVisible(true)}
            />

            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalText}>Are you sure you want to delete your profile? This action is irreversible and will permanently remove all your data.</Text>
                            <View style={styles.row}>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalButton}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalButton}>Delete my profile</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        //borderRadius: 10,
        alignItems: 'center',
        width: '70%'
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
});

export default ProfileEditView;