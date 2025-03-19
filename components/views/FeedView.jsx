import React, { useState, useEffect } from 'react';
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeCard from "../customComponents/AwesomeCard";
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchPolls } from "../../shared/api/apiClient";
import {fetchMyProfile, isLoggedIn} from "../../shared/api/apiClient";

const FeedView = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null); // Store the user ID

    useEffect(() => {
        // Fetch user's profile to get their ID
        const fetchUserProfile = async () => {
            const profile = await fetchMyProfile();
            if (profile?.userId) {
                setLoggedInUserId(profile.userId);
            }
        };

        // Fetch polls data
        fetchPolls().then(res => setPolls(res));

        fetchUserProfile(); // Fetch user profile on mount
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            const newPolls = [
                { id: String(Date.now()), question: 'What is your favorite sport?', options: ['Football', 'Basketball', 'Tennis', 'Swimming'] },
                ...polls,
            ];
            setPolls(newPolls);
            setRefreshing(false);
        }, 1500);
    };

    const handleVote = (pollId, selectedOption) => {
        setPolls(polls.map(poll =>
            poll.id === pollId ? {
                ...poll,
                results: { ...poll.results, [selectedOption]: (poll.results[selectedOption] || 0) + 1 },
                totalVotes: poll.totalVotes + 1
            } : poll
        ));
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
                            handleVote={handleVote}
                            loggedInUserId={loggedInUserId} // ✅ Now passing loggedInUserId
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
