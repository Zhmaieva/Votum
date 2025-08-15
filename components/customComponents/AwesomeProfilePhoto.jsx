import React, {useEffect, useState} from 'react';
import { View, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '../../utils/colorUtils';
import { uploadProfileImage } from "../../shared/api/apiClient";
import { AwesomeModal } from "./AwesomeModal";
import {getDataService, globalEventEmitter, Logger} from "../../shared/common";

const AwesomeProfilePhoto = ({ profileImage, setProfileImage }) => {
    const [isModalVisible, setModalVisible] = useState(false);

    const [image, setImage] = useState(profileImage);

    useEffect(() => {
        console.log('applying image...', profileImage);
        setImage(profileImage);
    }, [profileImage])

    const handleImagePick = async () => {
        const oldImage = image;

        try {
            Logger.log('Requesting media library permission...');
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permission required', 'We need permission to access your gallery');
                return;
            }

            Logger.log('Launching media library...');
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });

            Logger.log('Reading image picker results...');
            if (!result.canceled) {
                Logger.log('Image result available');
                const uri = result.assets[0].uri;
                getDataService().getUser().image = uri;
                getDataService().commitUserChanges();
                setProfileImage(uri);
                globalEventEmitter.emit('imagePicked', {imageUri: uri, userId: getDataService().getUser().userId});

                Logger.log('Uploading image...');
                await uploadProfileImage(result.assets[0]);
            }
        } catch (err) {
            Logger.error('image upload fail', err);
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
                    source={(image && !image?.includes('default_avatar')) ? { uri: image } : require('../../assets/images/default-avatar.png')}
                    style={styles.image}
                    contentFit="cover"
                    transition={100}
                    cachePolicy="disk"
                />
                <View style={styles.iconOverlay}>
                    <Image
                        source={require('../../assets/images/photoWhite.png')}
                        style={styles.icon}
                        contentFit="cover"
                        transition={100}
                        cachePolicy="disk"
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
        maxHeight: 160,
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
        backgroundColor: Colors.lightGrey
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