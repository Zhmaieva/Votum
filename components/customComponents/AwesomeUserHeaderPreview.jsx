import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "./AwesomeButton";
import { followProfile, unfollowProfile } from "../../shared/api/apiClient";
import { globalEventEmitter } from "../../shared/common";
import { useNavigation } from "@react-navigation/native";

const followChangedEventName = "followChanged";

const formatVotes = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
};

const AwesomeUserHeaderPreview = ({ userData, loggedInUserId }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(userData);
    const [isFollowing, setIsFollowing] = useState(userData?.isFollowing);

    const isOwnProfile = user?.userId === loggedInUserId;

    useEffect(() => {
        const handler = (updatedUser) => {
            if (updatedUser?.userId === user?.userId) {
                setUser(updatedUser);
                setIsFollowing(updatedUser.isFollowing);
            }
        };
        globalEventEmitter.on(followChangedEventName, handler);
        return () => {
            globalEventEmitter.off(followChangedEventName, handler);
        };
    }, [user?.userId]);

    globalEventEmitter.on('imagePicked', ({userId, imageUri}) => {
        if (user?.userId !== userId)
            return;

        const newUser = { ...user };
        newUser.image = imageUri;
        setUser(newUser);
    });

    useEffect(() => {
        setUser(userData);
        setIsFollowing(userData?.isFollowing);
    }, [userData]);

    if (!user) return null;

    const handlePress = () => {
        if (isOwnProfile) {
            navigation.navigate("Profile");
        } else {
            navigation.navigate("Somebodys Profile", { userId: user.userId });
        }
    };

    const formattedVotes = formatVotes(user.votesNumber || 0);

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <Image source={{ uri: user.image }} style={styles.avatar} />
            <View style={styles.textContainer}>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.subText}>
                    {formattedVotes} votes
                </Text>
            </View>
            {!isOwnProfile && (
                <View style={styles.buttonContainer}>
                    <AwesomeButton
                        color={Color.BLACK}
                        isInChangedTextMode={isFollowing}
                        additionalFunc={handleFollowToggle}
                        text="Follow"
                        changedText="Unfollow"
                    />
                </View>
            )}
        </TouchableOpacity>
    );
};

export default AwesomeUserHeaderPreview;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        width: "100%",
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
        alignSelf: "flex-end"
    },
    username: {
        fontWeight: "bold",
        fontSize: 15,
        color: Colors.black,
        marginBottom: 1,
        fontFamily: Fonts.medium
    },
    subText: {
        fontSize: 14,
        color: Colors.grey,
        fontFamily: Fonts.regular
    },
    buttonContainer: {
        marginLeft: 10,
        width: 85,
        alignSelf: "flex-end"
    },
});
