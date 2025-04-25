import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Modal, Pressable } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeVote from "../customComponents/AwesomeVote";
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeSwitcher from "../customComponents/AwesomeSwitcher";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeLoadingPoll from "../customComponents/AwesomeLoadingPoll";
import AwesomeLoadingHeader from "../customComponents/AwesomeLoadingHeader";
import {fetchMyProfile, fetchUserPolls, fetchUserProfile} from "../../shared/api/apiClient";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {calculateTimeDifference, getDataService} from "../../shared/common";
import AwesomeCard from "../customComponents/AwesomeCard";

const MyUserProfileView = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state

    const navigation = useNavigation();

    const onPressHandler = (screenName) => {
        navigation.navigate(screenName);
    };

    const MIN_LOADING_TIME = 500;

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;
            const startTime = Date.now();

            const finishLoading = (userData) => {
                const loadDuration = Date.now() - startTime;
                const delay = Math.max(0, MIN_LOADING_TIME - loadDuration);
                setTimeout(() => {
                    if (isMounted) {
                        setUser(userData);
                        setLoggedInUserId(userData.userId);
                        fetchUserPolls(userData.userId).then(res => {
                            if (isMounted) setPolls(res);
                        });
                    }
                }, delay);
            };

            if (getDataService().getUser()) {
                finishLoading(getDataService().getUser());
            } else {
                fetchMyProfile().then(res => {
                    getDataService().setUser(res);
                    finishLoading(res);
                });
            }

            return () => {
                isMounted = false;
            };
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        if (getDataService().getUser()?.userId)
            fetchUserPolls(getDataService().getUser()?.userId).then(res => {
                setPolls(res.slice());
                setRefreshing(false);
            });
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentWrapper}>
                    <View style={{marginBottom: 15}}>
                        {user === null ? (
                            <AwesomeLoadingHeader />
                        ) : (
                            <AwesomeUserHeader userData={user} loggedInUserId={user?.userId} isProfilePage={true} />
                        )}
                    </View>
                    <View style={[styles.followersContainer, styles.row, styles.bottomMargin20]}>
                        <View style={styles.followersLeftSubContainer}>
                            <Text style={styles.followersText}>213</Text>
                            <Text style={styles.followersText}>polls</Text>
                        </View>
                        <Pressable
                            style={styles.followersCenterSubContainer}
                            onPress={() => onPressHandler('Followers')}
                        >
                            <Text style={styles.followersText}>{user?.followersNumber ?? 0}</Text>
                            <Text style={styles.followersText}>followers</Text>
                        </Pressable>
                        <Pressable
                            style={styles.followersRightSubContainer}
                            onPress={() => onPressHandler('Following')}
                        >
                            <Text style={styles.followersText}>{user?.followingNumber ?? 0}</Text>
                            <Text style={styles.followersText}>following</Text>
                        </Pressable>
                    </View>

                    {!user || !polls ? (
                        <View style={styles.container}>
                            {[1, 2, 3].map((_, idx) => (
                                <AwesomeLoadingPoll key={idx} />
                            ))}
                        </View>
                    ) : (
                        <AwesomeFeed
                            data={polls}
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                            isUserProfileView={true}
                            renderItem={(item) => {
                                item.timeLeft = calculateTimeDifference(item.endsIn);
                                return (
                                    <View style={styles.container}>
                                        <AwesomeCard
                                            hideHeader={true}
                                            item={item}
                                            handleVote={async (itemId, optionId) => {
                                            }}
                                            loggedInUserId={loggedInUserId}
                                        />
                                    </View>
                                )
                            }}
                        />
                    )}
                </View>
            </SafeAreaView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <Text>TEST TEST</Text>
            </Modal>
        </View>
    );
};

export default MyUserProfileView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: "100%",
    },
    contentWrapper: {
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        height: '100%',
    },
    safeArea: {
        backgroundColor: Colors.white,
    },
    row: {
        flexDirection: 'row'
    },
    bottomMargin20: {
        marginBottom: 20
    },
    userContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    avatar: {
        height: 46,
        width: 46,
        marginRight: 8,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
    },
    userSubContainer: {
        justifyContent: 'flex-end',
    },
    font14: {
        fontSize: 14,
    },
    usernameBold: {
        fontWeight: "bold"
    },
    fontFamily: {
        fontFamily: 'arial',
    },
    greyTextStyle: {
        color: Colors.grey,
    },
    followButton: {
        height: 30,
        width: 70,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: "center"
    },
    followButtonText: {
        color: Colors.white,
        fontSize: 14
    },
    followersContainer: {
        borderBottomWidth: 1,
        borderColor: '#888',
        justifyContent: 'space-between',
        paddingBottom: 5,
    },
    followersLeftSubContainer: {
        width: '23%',
        alignItems: 'center',
    },
    followersCenterSubContainer: {
        width: '23%',
        alignItems: 'center'
    },
    followersRightSubContainer: {
        width: '23%',
        alignItems: 'center'
    },
    followersText: {
        color: Colors.grey
    },
    visible: {
        display: 'flex'
    },
    invisible: {
        display: 'none'
    },
});