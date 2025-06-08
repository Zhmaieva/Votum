import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Modal, ActivityIndicator} from "react-native";
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeLoadingHeader from "../customComponents/AwesomeLoadingHeader";
import {fetchLikedPolls, fetchMyProfile, fetchUserPolls, fetchUserProfile} from "../../shared/api/apiClient";
import {calculateTimeDifference, getDataService} from "../../shared/common";
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeLoadingPoll from "../customComponents/AwesomeLoadingPoll";

const SomebodysProfileView = ({ route }) => {
    const { userId } = route.params;
    const [selectedOption, setSelectedOption] = useState("active");
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state

    useEffect(() => {
        const myId = getDataService().getUser()?.userId;
        setLoggedInUserId(myId);
        fetchUserProfile(userId).then(setUser);

        fetchUserPolls(userId).then(res => {
            setPolls(res);
        });
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchUserPolls(userId).then(res => {
            setPolls(res.slice());
            setRefreshing(false);
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.contentWrapper}>
                <View style={{marginBottom: 10}}>
                    {user === null ? (
                        <AwesomeLoadingHeader />
                    ) : (
                        <AwesomeUserHeader
                            userData={user}
                            loggedInUserId={loggedInUserId}
                            isProfilePage={true}
                        />
                    )}
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