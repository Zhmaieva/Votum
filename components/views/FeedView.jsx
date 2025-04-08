import React, { useState, useEffect } from 'react';
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeCard from "../customComponents/AwesomeCard";
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { fetchPolls, fetchMyProfile } from "../../shared/api/apiClient";
import { Colors } from '../../utils/colorUtils';

const FeedView = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        fetchMyProfile().then(res => {
            if (res?.userId) {
                setLoggedInUserId(res.userId);
            }
        });

        fetchPolls().then(res => setPolls(res));
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPolls().then(res => {
            setPolls(res.slice());
            setRefreshing(false);
        });
    };

    if (polls === null) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!polls.length) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    No new polls, try later or create one.
                </Text>
            </View>
        );
    }

    return (
        <AwesomeFeed
            data={polls}
            onRefresh={onRefresh}
            refreshing={refreshing}
            renderItem={(item) => {
                item.timeLeft = calculateTimeDifference(item.endsIn);
                return (
                    <View style={styles.container}>
                        <AwesomeCard
                            item={item}
                            handleVote={() => {}}
                            loggedInUserId={loggedInUserId}
                        />
                    </View>
                )
            }}
        />
    );
};

const calculateTimeDifference = (dateString) => {
    const now = new Date();
    const targetDate = new Date(dateString);
    return targetDate - now;
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.white
    },
    emptyText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
});

export default FeedView;