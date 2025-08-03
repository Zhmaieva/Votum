import React, {useEffect, useState, useRef} from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Modal, Pressable } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeLoadingPoll from "../customComponents/AwesomeLoadingPoll";
import AwesomeLoadingHeader from "../customComponents/AwesomeLoadingHeader";
import {fetchMyProfile, fetchUserPolls, fetchUserProfile} from "../../shared/api/apiClient";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import {
    calculateTimeDifference,
    getDataService,
    globalEventEmitter, Loader,
    MIN_EXTRA_LOADING_TIME,
    MIN_LOADING_TIME
} from "../../shared/common";
import AwesomeCard from "../customComponents/AwesomeCard";

const MyUserProfileView = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [userDataLoading, setUserDataLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [polls, setPolls] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const feedRef = useRef();
    const route = useRoute();
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            new Loader(setUserDataLoading).load([
                (async () => {
                    let userData = getDataService().getUser();
                    if (!userData) {
                        userData = await fetchMyProfile();

                        getDataService().setUser(userData);
                    }
                    setUser(userData);

                    const pollsData = await fetchUserPolls(userData.userId);
                    setPolls(pollsData);
                })()
            ]).then(_ => {});

            const interval = setInterval(async () => {
                const userData = await fetchMyProfile();
                getDataService().setUser(userData);
                setUser(userData);
            }, 2000);

            return () => clearInterval(interval); // Cleanup on unmount
        }, [])
    );

    useEffect(() => {
        if (route.params?.scrollToTop) {
            feedRef.current?.scrollToTop?.();

            // Remove the param so it doesn't repeat on tab switch
            navigation.setParams({ scrollToTop: undefined });
        }
    }, [route.params?.scrollToTop]);

    globalEventEmitter.on('deletePoll', async ({ pollId }) => {
        let userData = await fetchMyProfile();
        getDataService().setUser(userData);

        setUser(userData);
    });

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserPolls(getDataService().getUser()?.userId).then(res => {
            setPolls(res.slice());
            setRefreshing(false);
        });
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentWrapper}>
                    <View style={{ marginBottom: 10 }}>
                        {userDataLoading ? (
                            <AwesomeLoadingHeader />
                        ) : (
                            user && polls ? (
                                <AwesomeUserHeader
                                    userData={user}
                                    loggedInUserId={user?.userId}
                                    isProfilePage={true}
                                />
                            ) : (
                                <></>
                            )
                        )}
                    </View>
                    {user && polls ? (
                        <AwesomeFeed
                            ref={feedRef}
                            data={polls}
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                            isUserProfileView={true}
                            isLoading={userDataLoading}
                            renderItem={(item) => {
                                item.timeLeft = calculateTimeDifference(item.endsIn);
                                return (
                                    <View style={styles.container}>
                                        <AwesomeCard
                                            hideHeader={true}
                                            item={item}
                                            loggedInUserId={user?.userId}
                                        />
                                    </View>
                                );
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

export default MyUserProfileView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        flex: 1
    },
    contentWrapper: {
        paddingTop: 10,
        paddingLeft: 15,
        paddingRight: 15,
        height: '100%'
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
    followersContainer: {
        justifyContent: 'space-between',
        marginBottom: 10,
        borderColor: '#999',
    },
    followersLeftSubContainer: {
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    followersCenterSubContainer: {
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    followersRightSubContainer: {
        width: '33%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 2
    },
    visible: {
        display: 'flex'
    },
    invisible: {
        display: 'none'
    },
});