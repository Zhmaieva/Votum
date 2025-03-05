import React, {useState} from "react";
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import { Colors } from '../../utils/colorUtils'
import AwesomeVote from "../customComponents/AwesomeVote";
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeSwitcher from "../customComponents/AwesomeSwitcher";
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

const UserProfileView = () => {

    const [polls, setPolls] = useState(pollData);

    const [refreshing, setRefreshing] = useState(false);

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
                <View style={styles.contentWrapper}>
                    <AwesomeUserHeader userName='Yullia Zhmaieva' followersNumber='15K' image={require('../../assets/images/emil.jpg')} />
                    <View style={[styles.followersContainer, styles.row]}>
                        <View style={styles.followersLeftSubContainer}>
                            <Text style={styles.followersText}>21</Text>
                            <Text style={styles.followersText}>polls</Text>
                        </View>
                        <View style={styles.followersCenterSubContainer}>
                            <Text style={styles.followersText}>15K</Text>
                            <Text style={styles.followersText}>followers</Text>
                        </View>
                        <View style={styles.followersRightSubContainer}>
                            <Text style={styles.followersText}>103</Text>
                            <Text style={styles.followersText}>following</Text>
                        </View>
                    </View>
                    <View style={styles.bottomMargin20}>
                        <AwesomeSwitcher leftOption='active' rightOption='closed' />
                    </View>
                    {/*<ScrollView>
                        {pollData.map((item) => (
                            <View style={styles.bottomMargin20}>
                                <AwesomeVote
                                    totalVotes={item.totalVotes}
                                    question={item.question}
                                    options={item.options}
                                    timeLeft={item.timeLeft}
                                    results={item.results}
                                />
                            </View>
                        ))}
                    </ScrollView>*/}
                    <AwesomeFeed data={polls} onRefresh={onRefresh} refreshing={refreshing} renderItem={(item) => {
                        return (
                            /*<AwesomeCard item={item} handleVote={handleVote} />*/
                            <AwesomeVote
                                totalVotes={item.totalVotes}
                                timeLeft={item.timeLeft}
                                question={item.question}
                                options={item.options}
                                results={item.results}
                            />
                        )}
                    }/>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default UserProfileView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: "100%",
    },
    contentWrapper: {
        padding: 20,
        height: '100%'
    },
    safeArea: {
        backgroundColor: Colors.white,
    },
    row: {
        flexDirection: 'row'
    },
    bottomMargin20: {
        marginBottom: 20
    },
    userContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
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
    greyTextStyle: {
        color: Colors.grey,
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
    followersContainer: {
        //borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#888',
        justifyContent: 'space-between',
        //paddingTop: 5,
        paddingBottom: 5,
        //height: 50,
        //marginBottom:  20
    },
    followersLeftSubContainer: {
        //borderRightWidth: 1,
        width: '23%',
        //borderColor: Colors.grey,
        alignItems: 'center',
        //backgroundColor: Colors.green
    },
    followersCenterSubContainer: {
        //borderRightWidth: 1,
        width: '23%',
        //borderColor: Colors.grey,
        alignItems: 'center'
    },
    followersRightSubContainer: {
        //borderRightWidth: 1,
        width: '23%',
        //borderColor: Colors.grey,
        alignItems: 'center'
    },
    followersText: {
        color: Colors.grey
    }
});