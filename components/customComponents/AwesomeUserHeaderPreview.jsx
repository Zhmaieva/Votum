import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "./AwesomeButton";
import { followProfile, unfollowProfile } from "../../shared/api/apiClient";
import { globalEventEmitter } from "../../shared/common";
import { useNavigation } from "@react-navigation/native";

const followChangedEventName = "followChanged";

const formatFollowers = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
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

    useEffect(() => {
        setUser(userData);
        setIsFollowing(userData?.isFollowing);
    }, [userData]);

    if (!user) return null;

    const handleFollowToggle = () => {
        const newFollowState = !isFollowing;
        setIsFollowing(newFollowState);
        if (newFollowState) {
            followProfile(user.userId);
        } else {
            unfollowProfile(user.userId);
        }
        globalEventEmitter.emit(followChangedEventName, { ...user, isFollowing: newFollowState });
    };

    const handlePress = () => {
        if (isOwnProfile) {
            navigation.navigate("Profile");
        } else {
            navigation.navigate("Somebodys Profile", { userId: user.userId });
        }
    };

    const formattedFollowers = formatFollowers(user.followersNumber);
    const followersText = user.followersNumber === 1 ? "follower" : "followers";

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <Image source={{ uri: user.image }} style={styles.avatar} />
            <View style={styles.textContainer}>
                <Text style={styles.username}>{user.username}</Text>
                {isOwnProfile ? (
                    <Text style={styles.subText} numberOfLines={1} ellipsizeMode="tail">
                        {user.bio ?? ""}
                    </Text>
                ) : (
                    <Text style={styles.subText}>
                        {formattedFollowers} {followersText}
                    </Text>
                )}
            </View>
            {!isOwnProfile && (
                <View style={styles.buttonContainer}>
                    <AwesomeButton
                        color={Color.BLACK}
                        isInChangedTextMode={isFollowing}
                        additionalFunc={() => {
                            user.isFollowing = !user.isFollowing;
                            setIsFollowing(user.isFollowing);
                            if (user.isFollowing) {
                                followProfile(user.userId);
                            } else {
                                unfollowProfile(user.userId);
                            }
                            globalEventEmitter.emit(followChangedEventName, { ...user });
                        }}
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
        fontSize: 14,
        color: Colors.black,
        marginBottom: 1
    },
    subText: {
        fontSize: 14,
        color: Colors.grey,
    },
    buttonContainer: {
        marginLeft: 10,
        width: 80,
        alignSelf: "flex-end"
    },
});
