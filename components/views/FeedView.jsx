import React, { useState } from 'react';
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeCard from "../customComponents/AwesomeCard";
import { View, StyleSheet } from 'react-native';

const pollData = [
    {
        id: 1,
        question: "What is your favorite color?",
        options: ["Red", "Blue", "Green", "Yellow"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "10m 30s",
        totalVotes: 1457,
        userName: "Yuliia Zhmaieva",
        followersNumber: 13,
        image: "require('../../assets/images/emil.jpg')"
    },
    {
        id: 2,
        question: "What is your favorite city?",
        options: ["NY", "London", "Gdansk", "Kherson"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "1m 15s",
        totalVotes: 2,
        userName: "Yuliia Zhmaieva",
        followersNumber: 13,
        image: "require('../../assets/images/emil.jpg')"
    },
    {
        id: 3,
        question: "Fav song?",
        options: ["Mil horas", "Start Boy", "None of them"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "1m 15s",
        totalVotes: 20972426,
        userName: "Yuliia Zhmaieva",
        followersNumber: 13,
        image: "require('../../assets/images/emil.jpg')"
    },
    {
        id: 4,
        question: "What to eat now",
        options: ["Chicken", "Noodles", "Fruits"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "15s",
        totalVotes: 20972426,
        userName: "Yuliia Zhmaieva",
        followersNumber: 13,
        image: "require('../../assets/images/emil.jpg')"
    },
];

const FeedView = () => {
    const [refreshing, setRefreshing] = useState(false);

    // Simulate refreshing & loading new polls
    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            const newPolls = [
                { id: String(Date.now()), question: 'What is your favorite sport?', options: ['Football', 'Basketball', 'Tennis', 'Swimming'] },
                ...polls, // Add new poll at the top
            ];
            setPolls(newPolls);
            setRefreshing(false);
        }, 1500);
    };

    const [polls, setPolls] = useState(pollData);

    const handleVote = (pollId, selectedOption) => {
        setPolls(polls.map(poll =>
            poll.id === pollId ? {
                ...poll,
                results: { ...poll.results, [selectedOption]: (poll.results[selectedOption] || 0) + 1 },
                totalVotes: poll.totalVotes + 1
            } : poll
        ));
    };

    return (
        <AwesomeFeed data={polls} onRefresh={onRefresh} refreshing={refreshing} renderItem={(item) => {
            return (
                <View style={styles.container}>
                    <AwesomeCard item={item} handleVote={handleVote} />
                </View>
            )}
        }/>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20
    }
});

export default FeedView;
