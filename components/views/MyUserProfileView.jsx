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
import {Ionicons} from "@expo/vector-icons";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";

const MIN_LOADING_TIME = 500;

const MyUserProfileView = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [userDataLoaded, setUserDataLoaded] = useState(false);
    const [user, setUser] = useState(null);
    const [polls, setPolls] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation();

    const onPressHandler = (screenName) => navigation.navigate(screenName);

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;
            const startTime = Date.now();

            const loadUserData = async () => {
                let userData = getDataService().getUser();
                if (!userData) {
                    userData = await fetchMyProfile();
                    getDataService().setUser(userData);
                }
                if (isMounted) {
                    setUser(userData);
                    fetchUserPolls(userData.userId).then(res => {
                        if (isMounted) setPolls(res);
                    });
                }
            };

            loadUserData().then(() => {
                const elapsed = Date.now() - startTime;
                const delay = Math.max(0, MIN_LOADING_TIME - elapsed);
                setTimeout(() => {
                    if (isMounted) setUserDataLoaded(true);
                }, delay);
            });

            return () => { isMounted = false; }
        }, [])
    );

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
                        {!userDataLoaded ? (
                            <AwesomeLoadingHeader />
                        ) : (
                            <AwesomeUserHeader
                                userData={user}
                                loggedInUserId={user?.userId}
                                isProfilePage={true} />
                        )}
                    </View>
                    {!userDataLoaded ? (
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
                                            loggedInUserId={user?.userId}
                                        />
                                    </View>
                                );
                            }}
                        />
                    )}
                </View>
            </SafeAreaView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
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
    followersText: {
        color: Colors.grey,
    },
    visible: {
        display: 'flex'
    },
    invisible: {
        display: 'none'
    },
});