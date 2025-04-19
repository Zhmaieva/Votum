import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../utils/colorUtils';
import {uploadProfileImage} from "../../shared/api/apiClient";
import {AwesomeModal} from "./AwesomeModal";
import {getDataService} from "../../shared/common";

const AwesomeProfilePhoto = ({ profileImage, setProfileImage }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const handleImagePick = async () => {
        const oldImage = profileImage;

        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission required', 'We need permission to access your gallery');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.Images,
                quality: 1,
            });

            if (!result.canceled) {
                getDataService().getUser().image = result.assets[0].uri;
                getDataService().commitUserChanges();

                setProfileImage(getDataService().getUser().image);

                await uploadProfileImage(result.assets[0]);
            }
        } catch (err) {
            setProfileImage(oldImage);
            getDataService().getUser().image = oldImage;
            getDataService().commitUserChanges();

            setModalVisible(true);
        }
    };

    return (
        <View style={styles.profileImageContainer}>
            <TouchableOpacity style={styles.profileImage} onPress={handleImagePick}>
                <Image source={{ uri: profileImage }} style={styles.profileImage}/>
            </TouchableOpacity>
            <AwesomeModal visible={isModalVisible}
                          text={"Image upload failed, try again"}
                          onPress={_ => {setModalVisible(false)}}
                          onBackPress={_ => {setModalVisible(false)}}/>
        </View>
    );
};

const styles = StyleSheet.create({
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
        width: '100%'
    },
    profileImage: {
        width: '100%',
        height: 300,
        /*borderColor: Colors.white,
        backgroundColor: Colors.white,
        borderWidth: 1,
        shadowRadius: 0,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 1,
        shadowColor: Colors.grey,*/
    },
});

export default AwesomeProfilePhoto;
