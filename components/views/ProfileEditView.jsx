import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import { Colors } from '../../utils/colorUtils'; // assuming Colors is your utility file for color styles
import * as ImagePicker from 'expo-image-picker';
import AwesomeButton, {Color} from '../customComponents/AwesomeButton'; // Reuse your AwesomeButton component
import { Ionicons } from '@expo/vector-icons';
import AwesomeEmailInput  from '../customComponents/AwesomeEmailInput';
import AwesomeEditButton from "../customComponents/AwesomeEditButton";
import {fetchMyProfile, fetchUserProfile} from "../../shared/api/apiClient";
import {getDataService} from "../../shared/common";
import {useFocusEffect} from "@react-navigation/native";

const ProfileEditView = ({ route }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bioD, setBioD] = useState('');
    const [profileImage, setProfileImage] = useState('');

    const dataService = getDataService();

    useFocusEffect(() => {
        const savedEmail = dataService.getUser()?.email;
        if (savedEmail) // immediately get last locally saved email
            setEmail(savedEmail);

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

            <AwesomeButton
                text="Log out"
                color={Color.BLACK}
                screenName={null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.white,
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
        //borderRadius: 20,
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
    }
});

export default ProfileEditView;