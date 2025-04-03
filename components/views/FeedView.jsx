import React, { useState, useEffect } from 'react';
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeCard from "../customComponents/AwesomeCard";
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchPolls } from "../../shared/api/apiClient";
import {fetchMyProfile} from "../../shared/api/apiClient";

const FeedView = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState([]);
    const [loggedInUserId, setLoggedInUserId] = useState(null); // Store the user ID

    useEffect(() => {
        // Fetch user's profile to get their ID
        fetchMyProfile().then(res => {
            if (res?.userId) {
                setLoggedInUserId(res.userId);
            }
        });

        // Fetch polls data
        fetchPolls().then(res => setPolls(res));
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPolls().then(res => {
            setPolls(res.slice());
            setRefreshing(false);
        });
    };

    if (!polls) return <ActivityIndicator size="large" color="#0000ff" />; // Show a loader while fetching

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

const calculateTimeDifference = function(dateString) {
    // Get the current date and the given date
    const now = new Date();
    const targetDate = new Date(dateString);

    // Calculate the time difference in milliseconds
    const timeDifference = targetDate - now;

    return timeDifference;
    }

const styles = StyleSheet.create({
    container: {
        padding: 15
    }
});

export default FeedView;
