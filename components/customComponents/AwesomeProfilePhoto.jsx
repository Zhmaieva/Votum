import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../utils/colorUtils';
import { uploadProfileImage } from "../../shared/api/apiClient";
import { AwesomeModal } from "./AwesomeModal";
import { getDataService } from "../../shared/common";
import { Ionicons } from '@expo/vector-icons';

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
            <TouchableOpacity style={styles.imageWrapper} onPress={handleImagePick}>
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
                <View style={styles.iconButton}>
                    <Ionicons name="camera-outline" size={30} color={Colors.white} />
                </View>
            </TouchableOpacity>
            <AwesomeModal
                visible={isModalVisible}
                text={"Image upload failed, try again"}
                onPress={() => setModalVisible(false)}
                onBackPress={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 10,
        width: '100%'
    },
    imageWrapper: {
        position: 'relative',
        width: '100%',
        height: 300,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    iconButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: Colors.black,
        padding: 6,
    }
});

export default AwesomeProfilePhoto;