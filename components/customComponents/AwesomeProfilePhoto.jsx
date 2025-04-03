import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../utils/colorUtils';

const AwesomeProfilePhoto = ({ profileImage, setProfileImage }) => {
    const handleImagePick = async () => {
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
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.profileImageContainer}>
            <TouchableOpacity style={styles.profileImage} onPress={handleImagePick}>
                <Image source={{ uri: profileImage }} style={styles.profileImage}/>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 140,
        height: 140,
        backgroundColor: Colors.green,
        /*borderColor: Colors.green,
        backgroundColor: Colors.white,
        borderWidth: 1,
        shadowRadius: 0,
        shadowOffset: {
            width: 2,
            height: 2
        },
        shadowOpacity: 1,
        shadowColor: Colors.green,*/
    },
});

export default AwesomeProfilePhoto;
