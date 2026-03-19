import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Image } from "expo-image";
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "./AwesomeButton";
import {globalEventEmitter, Logger, onShare} from "../../shared/common";
import {fetchUserNotifications, fetchUserProfile, followProfile, unfollowProfile} from "../../shared/api/apiClient";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import { AwesomeModal } from "./AwesomeModal";

const followChangedEventName = "followChanged";

const formatFollowers = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};

const AwesomeUserHeader = ({
                               userData,
                               isFollowing,
                               loggedInUserId,
                               isInsideCard = false,
                               isProfilePage = false
                           }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(userData);
    const [following, setFollowing] = useState(isFollowing);
    const [isBlocked, setIsBlocked] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [hasNewNotifications, setHasNewNotifications] = useState(true);
    const [notifications, setNotifications] = useState({});
    const [totalVotesCount, setTotalVotesCount] = useState(0);

    const isOwnProfile = user?.userId === loggedInUserId;

    useFocusEffect(React.useCallback(() => {
        if (!isOwnProfile)
            return;

        fetchUserNotifications().then((res) => {
            if (res) {
                setNotifications(res);
                Logger.log(res);
                const hasNotifications = res.find(x => !x.isViewed);
                Logger.log(hasNotifications);
                if (hasNotifications)
                    setHasNewNotifications(true)
                else
                    setHasNewNotifications(false);
            }
        });

    }, []));

    const onPollVotedHandler = ({pollCreator}) => {
        if (pollCreator.userId === userData.userId) {
            setTotalVotesCount(totalVotesCount + 1);
        }
    }

    useEffect(() => {
        globalEventEmitter.on('pollVoted',onPollVotedHandler);

        return () => {
            globalEventEmitter.off('pollVoted',onPollVotedHandler);
        }
    })

    useFocusEffect(React.useCallback(() => {
        setTotalVotesCount(user.totalVotesNumber || 0);
    }, [user]));

    useFocusEffect(React.useCallback(() => {
        setUser(userData);
        setFollowing(isFollowing);
    }, [userData, isFollowing]));

    if (!user) return <Text>Loading...</Text>;

    // const formattedFollowers = formatFollowers(user.followingNumber);
    // const followersText = user.followingNumber === 1 ? "follower" : "followers";

    const handleFollowToggle = async () => {
        const newFollowState = !user.isFollowing;
        console.log('newFollowState', newFollowState);
        let result = false;
        if (newFollowState) {
            result = await followProfile(user.userId, navigation);
        } else {
            result = await unfollowProfile(user.userId);
        }
        if (result) {
            globalEventEmitter.emit(followChangedEventName, { ...user, isFollowing: newFollowState });
        }
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
                    <Image source={ (user?.image && !user?.image?.includes('default')) ? { uri: user?.image } : require('../../assets/images/default-avatar.png') } style={styles.avatar} contentFit="cover"
                           transition={100}
                           cachePolicy="disk" />
                </View>
                <View>
                    <View style={[styles.followersContainer, styles.row]}>
                        <View style={styles.counterStyleContainerRight}>
                            <Text style={styles.counterTextStyle}>
                                {isOwnProfile ? 'your polls got ' : `user's polls got `}
                            </Text>
                            <Text style={styles.counterStyle}>
                                {formatFollowers(totalVotesCount)}
                            </Text>
                            <Text style={styles.counterTextStyle}>
                                {totalVotesCount === 1 ? ' vote' : ' votes'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 5 }}>
                <Text style={[styles.font14, styles.usernameBold, styles.fontFamilyBold]} numberOfLines={1}>
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
                                text="Account details"
                                color={Color.BLACK}
                                screenName="Edit profile"
                                manual={true}
                            />
                        </View>
                        <View style={styles.row}>
                            {/*<Pressable style={styles.iconContainer} onPress={() => onShare(user)}>
                                <Image
                                    source={require('../../assets/images/shareWhite.png')}
                                    style={{ width: 26, height: 26 }}
                                    resizeMode="contain"
                                />
                            </Pressable>*/}
                            <Pressable
                                style={styles.notificationWrapper}
                                onPress={() => navigation.navigate("Notifications", notifications)}
                            >
                                <Image
                                    source={require('../../assets/images/bellWhite.png')}
                                    style={{ width: 28, height: 28 }}
                                    resizeMode="contain"
                                />
                                {hasNewNotifications && <View style={styles.greenDot} />}
                            </Pressable>
                        </View>
                    </>
                ) : (
                    <>
                        <View style={styles.editButton}>
                            <AwesomeButton
                                text={!following ? "Follow" : "Unfollow"}
                                additionalFunc={handleFollowToggle}
                                color={following ? Color.WHITE : Color.BLACK}
                                textColor={following ? Colors.black : Colors.white}
                            />
                        </View>
                        {/*<View style={styles.editButton}>
                            <AwesomeButton
                                text={isBlocked ? "Unblock" : "Block"}
                                color={Color.BLACK}
                                additionalFunc={handleBlockPress}
                            />
                        </View>
                        <View style={styles.iconContainer}>
                            <Image
                                source={require('../../assets/images/shareWhite.png')}
                                style={{ width: 26, height: 26 }}
                                resizeMode="contain"
                            />
                        </View>*/}
                    </>
                )}
            </View>
        </View>
    );

    return (
        <>
            {isInsideCard ? (
                <TouchableOpacity onPress={() => {
                    navigation.navigate(isOwnProfile ? "Profile" : "User Profile", { userId: user.userId });
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
        justifyContent: 'space-between'
    },
    userContainer: {
        width: '100%',
        paddingRight: 2,
    },
    avatarContainer: {
        height: 60,
        width: 60,
    },
    avatar: {
        height: 60,
        width: 60,
        backgroundColor: Colors.lightGrey,
    },
    font14: {
        fontSize: 14,
        fontFamily: Fonts.regular
    },
    usernameBold: {
        fontFamily: Fonts.medium
    },
    fontFamily: {
        fontFamily: Fonts.regular
    },
    fontFamilyBold: {
        fontFamily: Fonts.medium
    },
    followersContainer: {
        justifyContent: 'center',
        flex: 1,
        alignItems: "flex-end",
        marginBottom: -2
    },
    followersSubContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    followersText: {
        color: Colors.black,
        fontSize: 15,
        fontFamily: Fonts.medium
    },
    buttonsContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 0,
        marginTop: 5,
    },
    editButton: {
        flex: 1,
        marginRight: 0,
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
        top: 10,
        right: 8,
        width: 10,
        height: 10,
        borderRadius: 0,
        backgroundColor: Colors.white,
    },
    counterStyle: {
        fontFamily: Fonts.medium,
        fontSize: 42,
        color: Colors.black,
        marginBottom: -7
    },
    counterTextStyle: {
        fontFamily: Fonts.bold,
        fontSize: 15,
    },
    counterStyleContainerLeft: {
        alignItems: 'center',
    },
    counterStyleContainerRight: {
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    counterStyleContainerCenter: {
        marginRight: 0,
        marginLeft: 5,
    },
    counterSignStyle: {
        fontFamily: Fonts.pixel,
        fontSize: 30,
    },
    counterTopTextStyle: {
        marginBottom: 2,
        fontFamily: Fonts.pixel,
        fontSize: 10,
        color: Colors.black,
    }
});