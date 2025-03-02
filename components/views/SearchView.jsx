import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, ScrollView, Image, TextInput} from "react-native";
import { Colors } from '../../utils/colorUtils'
import { Ionicons, EvilIcons, FontAwesome } from '@expo/vector-icons';
import {Pressable} from "react-native-gesture-handler";
import AwesomeVote from "../customComponents/AwesomeVote.jsx"
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeSearch from "../customComponents/AwesomeSearch";
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
        marginTop: 4
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













    title: {
        fontSize: 18,
    },
    votingFrame: {
        borderWidth: 1,
        borderColor: Colors.grey,
        backgroundColor: Colors.white,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
        padding: 14
    },
    button: {
        backgroundColor: Colors.white,
        height: 40,
        marginBottom: 10,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: Colors.grey,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonText: {
        color: Colors.grey,
        fontSize: 18,
        marginLeft: 10
    },
    resultBar: {
        height: "100%",
        marginLeft: 0,
        marginTop: 5,
        marginBottom: 5
    },
    resultText: {
        color: Colors.grey,
        fontSize: 14,
        marginRight: 4
    },
    buttonContainer: {
        backgroundColor: Colors.white,
        height: 40,
        width: '100%',
        marginBottom: 10,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: Colors.grey,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdownStyle: {
        borderWidth: 1,
        borderColor: Colors.black,
        height: 40,
        marginBottom: 15,
        backgroundColor: Colors.white,
    },
    optStyle: {
        backgroundColor: Colors.white
    },
    placeholderTextStyle: {
        marginLeft: 5
    },
    containerDropdown: {
        backgroundColor: Colors.white
    },
    countStyle: {
        justifyContent: 'space-between',
    },
    greyTextStyle: {
        color: Colors.grey,
    },
    qTextStyle: {
        color: Colors.green,
        fontSize: 18,
        fontWeight: 'bold'
    },
    bottomMargin10: {
        marginBottom: 10
    },
    bottomMargin20: {
        marginBottom: 20
    },
    avatar: {
        height: 46,
        width: 46,
        marginRight: 8,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
    },
    userSubContainer: {
        justifyContent: 'flex-end',
    },
    font14: {
        fontSize: 14,
    },
    userNameBold: {
        fontWeight: "bold"
    },
    fontFamily: {
        fontFamily: 'arial',
    },
    controlSignsContainer: {
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    iconContainer: {
        marginLeft: 8
    },
    topContainer: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: "#777"
    },
    followButton: {
        height: 30,
        width: 70,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: "center"
    },
    followButtonText: {
        color: Colors.white,
        fontSize: 14
    },
    userContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    }
});