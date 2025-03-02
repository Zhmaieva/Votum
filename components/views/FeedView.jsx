import React, { useState, useRef } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeCard from "../customComponents/AwesomeCard";

const pollData = [
    {
        id: 1,
        question: "What is your favorite color?",
        options: ["Red", "Blue"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "10m 30s",
        totalVotes: 1457
    },
    {
        id: 2,
        question: "What is your favorite city?",
        options: ["NY", "London", "Gdansk", "Kherson"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "1m 15s",
        totalVotes: 2
    },
    {
        id: 3,
        question: "What is your favorite singer?",
        options: ["Weeknd", "Lady Gaga"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "10m 30s",
        totalVotes: 1457
    },
    {
        id: 4,
        question: "What is your favorite animal?",
        options: ["Lion", "Dog", "Cat", "Chicken"],
        results: { Red: 80, Blue: 10, Green: 3, Yellow: 7 },
        timeLeft: "5h 0s",
        totalVotes: 209543
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
                <AwesomeCard item={item} handleVote={handleVote} />
            )}
        }/>
    );
};

export default FeedView;
