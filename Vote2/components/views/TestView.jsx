import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Animated, Dimensions, StyleSheet, RefreshControl } from 'react-native';
import AwesomeVote from "../customComponents/AwesomeVote";
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";

const { height, width } = Dimensions.get('window');
const POLL_HEIGHT = height * 0.8; // 90% of the screen height
const NEXT_POLL_OFFSET = height * 0.2; // 10% of the next poll visible

const pollData = [
    {
        id: 1,
        question: "What is your favorite color?",
        options: ["Red", "Blue", "Green", "Yellow"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "10m 30s",
        totalVotes: 1457
    }
];

const TestView = () => {
    const [refreshing, setRefreshing] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;

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
        <View style={styles.container}>
            {/*<AwesomeUserHeader />
            {polls.map(poll => (
                <AwesomeVote
                    key={poll.id}
                    question={poll.question}
                    options={poll.options}
                    results={poll.results}
                    timeLeft={poll.timeLeft}
                    totalVotes={poll.totalVotes}
                    onVote={(option) => handleVote(poll.id, option)}
                />
            ))}*/}
            <Animated.FlatList
                data={polls}
                keyExtractor={(item) => item.id}
                pagingEnabled
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                snapToOffsets={polls.map((_, index) => index * (POLL_HEIGHT - NEXT_POLL_OFFSET))}
                decelerationRate="fast"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007bff" />
                }
                renderItem={({ item }) => (
                    <View style={styles.pollContainer}>
                        <Text style={styles.question}>{item.question}</Text>
                        {item.options.map((option, index) => (
                            <TouchableOpacity key={index} style={styles.optionButton}>
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    pollContainer: {
        width,
        height: POLL_HEIGHT,
        backgroundColor: '#ffffff',
        borderRadius: 0,
        marginBottom: -NEXT_POLL_OFFSET, // Partially show the next poll
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    question: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionButton: {
        backgroundColor: '#007bff',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    optionText: {
        color: '#ffffff',
        fontSize: 18,
    },
});

export default TestView;
