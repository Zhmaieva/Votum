import React, {useEffect, useState} from "react";
import {View, StyleSheet, ActivityIndicator, Text} from "react-native";
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import {calculateTimeDifference} from "../../shared/common";
import {fetchLikedPolls, fetchMyProfile} from "../../shared/api/apiClient";

    const LikedView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        fetchMyProfile().then(res => {
            if (res?.userId) {
                setLoggedInUserId(res.userId);
            }
        });

        fetchLikedPolls().then(res => {
            setPolls(res);
        });
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchLikedPolls().then(res => {
            setPolls(res.slice());
            setRefreshing(false);
        });
    };

    if (polls === null) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!polls?.length) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    Something went wrong, check your network connection.
                </Text>
            </View>
        );
    }

    return (
        <AwesomeFeed
            data={polls}
            onRefresh={onRefresh}
            refreshing={refreshing}
            isLikedPollsView={true}
            renderItem={(item) => {
                item.timeLeft = calculateTimeDifference(item.endsIn);
                return (
                    <View style={styles.container}>
                        <AwesomeCard
                            item={item}
                            handleVote={async (itemId, optionId) => {
                            }}
                            loggedInUserId={loggedInUserId}
                        />
                    </View>
                )
            }}
        />
    );
};

export default LikedView;

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingRight: 15,
        paddingLeft: 15
    }
});