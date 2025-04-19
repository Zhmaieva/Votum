import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeSearch from "../customComponents/AwesomeSearch";

const pollData = [];

const SearchView = () => {
    const [polls, setPolls] = useState(pollData);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredPolls = polls.filter(poll =>
        poll.question.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.searchContainer}>
                    <AwesomeSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                </View>
                <View style={styles.centered}>
                    {filteredPolls.length === 0 && searchQuery !== "" ? (
                        <Text style={styles.noResultsText}>No polls found for "{searchQuery}"</Text>
                    ) : (
                        <AwesomeFeed
                            data={filteredPolls}
                            isSearchView={true}
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                            renderItem={(item) => (
                                <AwesomeCard item={item} handleVote={handleVote} />
                            )}
                        />
                    )}
                </View>
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
    alignStyle: {
        justifyContent: 'space-between'
    },
    noResultsText: {
        fontSize: 16,
        color: Colors.grey,
        textAlign: 'center',
    },
    centered: {
        justifyContent: "center",
        flex: 1
    }
});
