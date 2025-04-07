import React, { useState } from "react";
import {StyleSheet} from "react-native";
import { Colors } from '../../utils/colorUtils'
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeFeed from "../customComponents/AwesomeFeed";

const pollData = [
    {
        id: 1,
        question: "What is your favorite color?",
        options: ["Red", "Blue", "Green", "Yellow"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "10m 30s",
        totalVotes: 1457,
        username: "Yuliia Zhmaieva",
        followersNumber: 13,
        image: "require('../../assets/images/emil.jpg')"
    },
    {
        id: 2,
        question: "What is your favorite city?",
        options: ["NY", "London", "Gdansk", "Kherson"],
        results: { "NY": 20, "London": 50, "Gdansk": 15, "Kherson": 15 },
        timeLeft: "1m 15s",
        totalVotes: 2,
        username: "Yuliia Zhmaieva",
        followersNumber: 13,
        image: "require('../../assets/images/emil.jpg')"
    },
];

const VotingView = () => {

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

    return (
        <AwesomeFeed data={polls} onRefresh={onRefresh} renderItem={(item) => {
            return (
                <AwesomeCard item={item} handleVote={handleVote} />
            )}
        }/>
    );
};

export default VotingView;

const styles = StyleSheet.create({

});