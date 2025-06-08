import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../utils/colorUtils';
import { uploadProfileImage } from "../../shared/api/apiClient";
import { AwesomeModal } from "./AwesomeModal";
import { getDataService } from "../../shared/common";

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
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            if (!result.canceled) {
                const uri = result.assets[0].uri;
                getDataService().getUser().image = uri;
                getDataService().commitUserChanges();
                setProfileImage(uri);
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
        <View style={styles.container}>
            <TouchableOpacity style={styles.touchable} onPress={handleImagePick} activeOpacity={0.8}>
                <Image
                    source={profileImage ? { uri: profileImage } : require('../../assets/images/default-avatar.png')}
                    style={styles.image}
                    resizeMode="cover"
                />
                <View style={styles.iconOverlay}>
                    <Image
                        source={require('../../assets/images/photoWhite.png')}
                        style={styles.icon}
                        resizeMode="contain"
                    />
                </View>
            </TouchableOpacity>

            <AwesomeModal
                visible={isModalVisible}
                text="UPLOAD FAILED"
                subtext="Check your connection or try an image under 5 MB"
                buttons={[{ label: "OK", onPress: () => setModalVisible(false) }]}
                onBackPress={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1, // makes it square
        width: '100%',
        maxWidth: 160,
        alignSelf: 'center',
    },
    touchable: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    iconOverlay: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: Colors.black,
        borderRadius: 0,
        padding: 6,
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default AwesomeProfilePhoto;