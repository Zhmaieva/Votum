import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "./AwesomeButton";
import {globalEventEmitter} from "../../shared/common";
import {followProfile, unfollowProfile} from "../../shared/api/apiClient";

const formatFollowers = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};

const followChangedEventName = "followChanged";

const AwesomeUserHeader = ({ userData, loggedInUserId }) => {
    const [user, setUser] = useState(userData);
    const [isFollowing, setIsFollowing] = useState(userData?.isFollowing);

    function handleFollowChangedEvent(userData) {
        if (!userData) return; // Ensure errorState is not undefined

        if (user?.userId !== userData.userId)
            return;

        setIsFollowing(userData.isFollowing);
    }

    globalEventEmitter.on(followChangedEventName, handleFollowChangedEvent);

    useEffect(() => {
        if (userData && userData !== user) {
            setUser(userData);
            setIsFollowing(userData?.isFollowing);
        }
    }, [userData]);

    if (!user) return <Text>Loading...</Text>;

    const isOwnProfile = user.userId === loggedInUserId;
    const followersText = user.followersNumber === 1 ? "follower" : "followers";
    const formattedFollowers = formatFollowers(user.followersNumber);

    return (
        <View style={[styles.row, styles.userContainer]}>

            <View style={[styles.row, styles.firstSubContainer]}>
                <View style={styles.avatar}>
                    <Image source={{ uri: user.image }} style={styles.avatar} />
                </View>
            </View>

            <View style={[styles.row, styles.secondSubContainer]}>
                <View>
                    <Text style={[styles.font14, styles.userNameBold, styles.fontFamily]}
                          numberOfLines={1}>
                        {user.userName}
                    </Text>
                    {isOwnProfile ? (
                        <Text style={[styles.font14, styles.greyTextStyle, styles.fontFamily]}
                              numberOfLines={2}
                              ellipsizeMode="tail">
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
                    {isOwnProfile ? (
                        <AwesomeButton
                            color={Color.BLACK}
                            text="Edit"
                            screenName="Edit profile"
                            params={{ user }}
                        />
                    ) : (
                        <AwesomeButton
                            color={Color.BLACK}
                            isInChangedTextMode={isFollowing}
                            additionalFunc={() => {
                                user.isFollowing = !user.isFollowing;
                                setIsFollowing(user.isFollowing);
                                if (user.isFollowing) {
                                    followProfile(user.userId).then(_ => {})
                                } else {
                                    unfollowProfile(user.userId).then(_ => {})
                                }
                                globalEventEmitter.emit(followChangedEventName, { ... user });
                            }}
                            text="Follow"
                            changedText="Unfollow" />
                    )}
                </View>
            </View>

        </View>
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
    userNameBold: {
        fontWeight: "bold",
    },
    fontFamily: {
        fontFamily: 'arial',
    },
    userContainer: {
        width: '100%',
    },
    firstSubContainer: {
        flex: 1,
        alignItems: "flex-start",
        marginRight: 5
    },
    secondSubContainer: {
        flex: 4,
        alignItems: "flex-end"
    },
    thirdSubContainer: {
        flex: 2,
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    buttonContainer: {
        width: 80
    },
});
