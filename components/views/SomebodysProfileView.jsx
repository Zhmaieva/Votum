import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Modal, ActivityIndicator} from "react-native";
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeLoadingHeader from "../customComponents/AwesomeLoadingHeader";
import {fetchVotedPolls, fetchMyProfile, fetchUserPolls, fetchUserProfile} from "../../shared/api/apiClient";
import {calculateTimeDifference, getDataService, globalEventEmitter, Loader} from "../../shared/common";
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeLoadingPoll from "../customComponents/AwesomeLoadingPoll";
import {isLoading} from "expo-font";
import {useFocusEffect} from "@react-navigation/native";

const followChangedEventName = "followChanged";

const SomebodysProfileView = ({ route }) => {
    const [selectedOption, setSelectedOption] = useState("active");
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(route.params.userData);
    const [isFollowing, setIsFollowing] = useState(route.params?.userData?.isFollowing ?? false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state
    const [loading, setLoading] = useState(false);

    useFocusEffect(React.useCallback(() => {
        const myId = getDataService().getUser()?.userId;
        setLoggedInUserId(myId);

        new Loader(setLoading).load([
            fetchUserProfile(user?.userId).then(async res => {
                setUser(res);
                setIsFollowing(res.isFollowing);
            }),
            fetchUserPolls(user?.userId).then(async res => {
                setPolls(res);
            })
        ]).then(_ => {});
    }, [route.params]));

    const onRefresh = () => {
        setRefreshing(true);

        fetchUserPolls(user?.userId).then(res => {
            setPolls(res.slice());
            setRefreshing(false);
        });
    };

    useEffect(() => {
        const handler = (updatedUser) => {
            if (updatedUser?.userId === user?.userId) {
                fetchUserProfile(user?.userId).then(async res => {
                    setUser(res);
                    setIsFollowing(res.isFollowing);
                });
            }
        };
        globalEventEmitter.on(followChangedEventName, handler);
        globalEventEmitter.on('somebodyProfileRefresh', onSomebodyProfileRefresh);

        // const interval = setInterval(async () => {
        //     fetchUserProfile(user?.userId).then(async res => {
        //         setUser(res);
        //         setIsFollowing(res.isFollowing);
        //     });
        // }, 20000);

        return () => {
            globalEventEmitter.off(followChangedEventName, handler);
            globalEventEmitter.off('somebodyProfileRefresh', onSomebodyProfileRefresh);
            // clearInterval(interval);
        }
    }, []);

    const onSomebodyProfileRefresh = async () => {
        fetchUserProfile(user?.userId).then(async res => {
            setUser(res);
            setIsFollowing(res.isFollowing);
        });
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.contentWrapper}>
                <View style={{marginBottom: 10}}>
                    {loading ? (
                        <AwesomeLoadingHeader />
                    ) : (
                        user && polls ? (
                            <AwesomeUserHeader
                                userData={user}
                                isFollowing={isFollowing}
                                loggedInUserId={loggedInUserId}
                                isProfilePage={true}
                            />
                        ) : (
                            <></>
                        )
                    )}
                </View>
                {user && polls ? (
                    <AwesomeFeed
                        screenName={'SOMEBODY PROFILE'}
                        data={polls}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        isUserProfileView={true}
                        isLoading={loading}
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
                ) : (
                    <></>
                )}
            </View>
        </SafeAreaView>
    );
};

export default SomebodysProfileView;

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
        flex: 1
    },
});