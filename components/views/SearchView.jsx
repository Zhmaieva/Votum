import React, { useState } from "react";
import {View, Text, StyleSheet, SafeAreaView} from "react-native";
import { Colors } from '../../utils/colorUtils'
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeFeed from "../customComponents/AwesomeFeed";

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

const SearchView = () => {
    const [polls, setPolls] = useState(pollData);

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
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={[styles.row, styles.alignStyle, styles.searchContainer]}>
                    <View style={styles.searchStyle} />
                    <View style={styles.searchButtonStyle}>
                        <Text style={styles.searchButtonTextStyle}>search</Text>
                    </View>
                </View>
                <AwesomeFeed data={polls} onRefresh={onRefresh} refreshing={refreshing} renderItem={(item) => {
                    return (
                        <AwesomeCard item={item} handleVote={handleVote} />
                    )}
                }/>
            </SafeAreaView>
        </View>
    );
};

export default SearchView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: "100%",
        padding: 14,
    },
    contentWrapper: {
        paddingTop: 20
    },
    safeArea: {
        backgroundColor: Colors.white,
        padding: 20,
        height: "100%",
    },
    searchContainer: {
        marginTop: 4,
        marginBottom: 20
    },
    searchStyle: {
      borderColor: Colors.grey,
      borderWidth: 1,
      height: 40,
        flexGrow: 1,
      //margin: 20,
        backgroundColor: Colors.white,
    },
    searchButtonStyle: {
        height: 40,
        width: 64,
        marginLeft: 5,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: "center",
    },
    searchButtonTextStyle: {
        color: Colors.white,
        fontFamily: 'arial'
    },
    row: {
        flexDirection: 'row'
    },
    alignStyle: {
        justifyContent: 'space-between'
    },
});