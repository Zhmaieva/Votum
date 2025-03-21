import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Platform
} from 'react-native';
import { Colors } from '../../utils/colorUtils'; // assuming Colors is your utility file for color styles
import * as ImagePicker from 'expo-image-picker';
import AwesomeButton, {Color} from '../customComponents/AwesomeButton'; // Reuse your AwesomeButton component
import { Ionicons } from '@expo/vector-icons';
import AwesomeEmailInput  from '../customComponents/AwesomeEmailInput';

const ProfileEditView = ({ navigation, route }) => {
    const { user } = route.params; // Assume user data is passed via navigation params

    const [username, setUsername] = useState(user.userName);
    const [bioD, setBioD] = useState(user.bio);
    const [profileImage, setProfileImage] = useState(user.image);

    const handleSave = () => {

    };

    useEffect(() => {
        if (user) {
            setUsername(user.userName);
            setBioD(user.bio);
            setProfileImage(user.image);
        }
    }, [user]);

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

    const handleSaveProfile = () => {
        // Perform any validation before saving
        if (username.trim() === '' || bioD.trim() === '') {
            Alert.alert('Error', 'Username and bio cannot be empty');
            return;
        }

        // Here you would send the updated data to your backend or context provider
        // For now, let's just show an alert for the sake of this example
        Alert.alert('Profile Updated', 'Your profile has been updated successfully');
        navigation.goBack(); // Go back to the previous screen after saving
        const updatedData = { username, bioD };
        onSave(updatedData);  // Calls the function from the parent
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

            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
            />

            <TextInput
                style={styles.input}
                value={bioD}
                onChangeText={setBioD}
                placeholder="Bio"
                multiline
                numberOfLines={4}
            />

            <AwesomeEmailInput />

            <AwesomeButton
                text="Save Profile"
                screenName={null} // No navigation needed here since we're saving the profile
                color={Color.GREEN}
                additionalFunc={handleSaveProfile}
            />

            <AwesomeButton
                text="Log out"
                color={Color.BLACK}
                screenName={null}
                additionalFunc={handleSaveProfile}
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
        //borderRadius: 60,
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
        width: '100%',
        height: 40,
        borderColor: Colors.grey,
        borderWidth: 1,
        //borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
});

export default ProfileEditView;