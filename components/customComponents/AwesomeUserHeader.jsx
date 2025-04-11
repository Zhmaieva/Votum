import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "./AwesomeButton";
import { globalEventEmitter } from "../../shared/common";
import { followProfile, unfollowProfile } from "../../shared/api/apiClient";
import { useNavigation } from "@react-navigation/native";
import { AwesomeModal } from "./AwesomeModal"; // make sure path is correct

const formatFollowers = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};

const followChangedEventName = "followChanged";

const AwesomeUserHeader = ({
                               userData,
                               loggedInUserId,
                               isFollowersPage = false,
                               onRemove,
                               isInsideCard = false,
                               isProfilePage = false
                           }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(userData);
    const [isFollowing, setIsFollowing] = useState(userData?.isFollowing);
    const [isBlocked, setIsBlocked] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);

    function handleFollowChangedEvent(userData) {
        if (!userData) return;
        if (user?.userId !== userData?.userId) return;
        setIsFollowing(userData?.isFollowing);
        setUser(userData);
    }

    globalEventEmitter.on(followChangedEventName, handleFollowChangedEvent);

    useEffect(() => {
        setUser(userData);
        setIsFollowing(userData?.isFollowing);
    }, [userData]);

    if (!user) return <Text>Loading...</Text>;

    const isOwnProfile = user.userId === loggedInUserId;
    const followersText = user.followersNumber === 1 ? "follower" : "followers";
    const formattedFollowers = formatFollowers(user.followersNumber);

    const handleBlockPress = () => {
        if (isBlocked) {
            setIsBlocked(false);
        } else {
            setShowBlockModal(true);
        }
    };

    const handleBlockConfirm = () => {
        setIsBlocked(true);
        setShowBlockModal(false);
    };

    const content = (
        <View style={[styles.row, styles.userContainer]}>
            <View style={[styles.row, styles.firstSubContainer]}>
                <View style={styles.avatar}>
                    <Image source={{ uri: user.image }} style={styles.avatar} />
                </View>
            </View>

            <View style={[styles.row, styles.secondSubContainer]}>
                <View>
                    <Text style={[styles.font14, styles.usernameBold, styles.fontFamily]} numberOfLines={1}>
                        {user.username}
                    </Text>

                    {isOwnProfile && isProfilePage ? (
                        <Text style={[styles.font14, styles.greyTextStyle, styles.fontFamily]} numberOfLines={2} ellipsizeMode="tail">
                            {user.bio}
                        </Text>
                    ) : (
                        <Text style={[styles.font14, styles.greyTextStyle, styles.fontFamily]}>
                            {formattedFollowers} {followersText}
                        </Text>
                    )}
                </View>
            </View>

            <View style={styles.thirdSubContainer}>
                <View style={styles.buttonContainer}>
                    {isFollowersPage ? (
                        <View />
                    ) : isOwnProfile ? (
                        isInsideCard ? (
                            <View />
                        ) : (
                            <AwesomeButton
                                color={Color.WHITE}
                                text="Edit"
                                screenName="Edit profile"
                                params={{ user }}
                            />
                        )
                    ) : isProfilePage ? (
                        <AwesomeButton
                            color={Color.BLACK}
                            text={isBlocked ? "Unblock" : "Block"}
                            additionalFunc={handleBlockPress}
                        />
                    ) : (
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
                    )}
                </View>
            </View>
        </View>
    );

    return (
        <>
            {isInsideCard ? (
                <TouchableOpacity onPress={() => {
                    if (isOwnProfile)
                        navigation.navigate("Profile");
                    else
                        navigation.navigate("Somebodys Profile", { userId: user.userId });
                }}>
                    {content}
                </TouchableOpacity>
            ) : (
                content
            )}

            <AwesomeModal
                visible={showBlockModal}
                text="Are you sure you want to block this user?"
                onPress={handleBlockConfirm}
                onBackPress={() => setShowBlockModal(false)}
                buttonText="OK"
            />
        </>
    );
};

export default AwesomeUserHeader;

const styles = StyleSheet.create({
    greyTextStyle: {
        color: Colors.grey,
    },
    row: {
        flexDirection: 'row',
    },
    avatar: {
        height: 46,
        width: 46,
        marginRight: 8,
    },
    font14: {
        fontSize: 14,
    },
    usernameBold: {
        fontWeight: "bold",
    },
    fontFamily: {
        fontFamily: 'arial',
    },
    userContainer: {
        width: '100%',
        paddingRight: 2,
        paddingBottom: 2,
    },
    firstSubContainer: {
        flex: 1,
        alignItems: "flex-start",
        marginRight: 5,
    },
    secondSubContainer: {
        flex: 4,
        alignItems: "flex-end",
    },
    thirdSubContainer: {
        flex: 2,
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    buttonContainer: {
        width: 80,
    },
});