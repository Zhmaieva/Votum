import React, {useState} from "react";
import {View, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import { Colors } from '../../utils/colorUtils'
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeFeed from "../customComponents/AwesomeFeed";

const pollData = [
];

const LikedView = () => {

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
        <AwesomeFeed data={polls} isLikedPollsView={true} onRefresh={onRefresh} renderItem={(item) => {
            return (
                <View style={styles.container}>
                    <AwesomeCard item={item} handleVote={handleVote} />
                </View>
            )}
        }/>
    );
};

export default LikedView;

const styles = StyleSheet.create({
    container: {
        padding: 15
    }
});