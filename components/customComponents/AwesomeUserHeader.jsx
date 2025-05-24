import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "./AwesomeButton";
import {globalEventEmitter, onShare} from "../../shared/common";
import { followProfile, unfollowProfile } from "../../shared/api/apiClient";
import { useNavigation } from "@react-navigation/native";
import { AwesomeModal } from "./AwesomeModal";
import { Ionicons } from "@expo/vector-icons";

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
                               isInsideCard = false,
                               isProfilePage = false
                           }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(userData);
    const [isFollowing, setIsFollowing] = useState(userData?.isFollowing);
    const [isBlocked, setIsBlocked] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [hasNewNotifications, setHasNewNotifications] = useState(true);

    const isOwnProfile = user?.userId === loggedInUserId;

    useEffect(() => {
        const handler = (updatedUser) => {
            if (updatedUser?.userId === user?.userId) {
                setUser(updatedUser);
                setIsFollowing(updatedUser.isFollowing);
            }
        };
        globalEventEmitter.on(followChangedEventName, handler);
        return () => globalEventEmitter.off(followChangedEventName, handler);
    }, [user?.userId]);

    useEffect(() => {
        setUser(userData);
        setIsFollowing(userData?.isFollowing);
    }, [userData]);

    if (!user) return <Text>Loading...</Text>;

    // const formattedFollowers = formatFollowers(user.followingNumber);
    // const followersText = user.followingNumber === 1 ? "follower" : "followers";

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

    const handleBlockPress = () => setShowBlockModal(true);

    const handleBlockConfirm = () => {
        setIsBlocked(true);
        setShowBlockModal(false);
    };

    const content = (
        <View style={styles.userContainer}>
            <View style={[styles.row, styles.aligned]}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: user.image }} style={styles.avatar} />
                </View>
                <View style={{ flex: 1, marginLeft: 20 }}>
                    <View style={[styles.followersContainer, styles.row]}>
                        <View style={styles.followersSubContainer}>
                            <Text style={styles.followersText}>{user.pollsNumber ?? 0}</Text>
                            <Text style={styles.followersText}>{(user.pollsNumber ?? 0) == 1 ? 'poll' : 'polls'}</Text>
                        </View>
                        <Pressable style={styles.followersSubContainer} onPress={() => navigation.navigate('Followers', { userId: user.userId })}>
                            <Text style={styles.followersText}>{user.followersNumber ?? 0}</Text>
                            <Text style={styles.followersText}>followers</Text>
                        </Pressable>
                        <Pressable style={styles.followersSubContainer} onPress={() => navigation.navigate('Following', { userId: user.userId })}>
                            <Text style={styles.followersText}>{user.followingNumber ?? 0}</Text>
                            <Text style={styles.followersText}>following</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 8, marginBottom: 6 }}>
                <Text style={[styles.font14, styles.usernameBold, styles.fontFamily]} numberOfLines={1}>
                    {user.username}
                </Text>
                <Text style={[styles.font14, styles.fontFamily]} numberOfLines={2} ellipsizeMode="tail">
                    {user.bio}
                </Text>
            </View>

            <View style={[styles.row, styles.buttonsContainer]}>
                {isOwnProfile ? (
                    <>
                        <View style={styles.editButton}>
                            <AwesomeButton
                                text="Edit"
                                color={Color.BLACK}
                                screenName="Edit profile"
                            />
                        </View>
                        <View style={styles.row}>
                            <Pressable style={styles.iconContainer} onPress={() => onShare(user)}>
                                <Ionicons name="share-outline" size={26} color={Colors.white} />
                            </Pressable>
                            <Pressable
                                style={styles.notificationWrapper}
                                onPress={() => navigation.navigate("Notifications")}
                            >
                                <Ionicons name="notifications-outline" size={26} color={Colors.white} />
                                {hasNewNotifications && <View style={styles.greenDot} />}
                            </Pressable>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.editButton}>
                            <AwesomeButton
                                text="Follow"
                                changedText="Unfollow"
                                isInChangedTextMode={isFollowing}
                                additionalFunc={handleFollowToggle}
                                color={Color.BLACK}
                                textColor={isFollowing ? Colors.black : Colors.white}
                            />
                        </View>
                        <View style={styles.editButton}>
                            <AwesomeButton
                                text={isBlocked ? "Unblock" : "Block"}
                                color={Color.BLACK}
                                additionalFunc={handleBlockPress}
                            />
                        </View>
                        <View style={styles.iconContainer}>
                            <Ionicons name="share-outline" size={26} color={Colors.white} />
                        </View>
                    </>
                )}
            </View>
        </View>
    );

    return (
        <>
            {isInsideCard ? (
                <TouchableOpacity onPress={() => {
                    navigation.navigate(isOwnProfile ? "Profile" : "Somebodys Profile", { userId: user.userId });
                }}>
                    {content}
                </TouchableOpacity>
            ) : (
                content
            )}

            <AwesomeModal
                visible={showBlockModal}
                text="BLOCK USER"
                subtext='Are you sure you want to block this user?'
                onBackPress={() => setShowBlockModal(false)}
                buttons={[
                    { label: "CANCEL", onPress: () => setShowBlockModal(false) },
                    { label: "OK", onPress: handleBlockConfirm },
                ]}
            />
        </>
    );
};

export default AwesomeUserHeader;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
    },
    aligned: {
        width: '100%',
    },
    userContainer: {
        width: '100%',
        paddingRight: 2,
    },
    avatarContainer: {
        height: 50,
        width: 50,
    },
    avatar: {
        height: 50,
        width: 50,
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
    followersContainer: {
        justifyContent: 'space-between',
        flex: 1,
        alignItems: "center",
    },
    followersSubContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    followersText: {
        color: Colors.black,
        fontSize: 14,
        fontWeight: '600',
    },
    buttonsContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 3,
        marginTop: 5,
    },
    editButton: {
        flex: 1,
        marginRight: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.black,
        borderWidth: 1,
        backgroundColor: Colors.black,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    notificationWrapper: {
        position: 'relative',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.black,
        borderWidth: 1,
        backgroundColor: Colors.black,
        marginLeft: 10,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    greenDot: {
        position: 'absolute',
        top: 9,
        right: 9,
        width: 7,
        height: 7,
        borderRadius: 0,
        backgroundColor: Colors.green,
    },
});
