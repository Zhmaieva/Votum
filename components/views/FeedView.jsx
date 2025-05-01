import React, { useState, useEffect } from 'react';
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeCard from "../customComponents/AwesomeCard";
import {View, StyleSheet, ActivityIndicator, Text, SafeAreaView} from 'react-native';
import {fetchPolls, fetchMyProfile, voteOnPoll, fetchTrendingPolls} from "../../shared/api/apiClient";
import { Colors } from '../../utils/colorUtils';
import AwesomeSwitcher from "../customComponents/AwesomeSwitcher";
import {calculateTimeDifference, globalEventEmitter} from "../../shared/common";

const FeedView = ({ route }) => {
    const [selectedOption, setSelectedOption] = useState("my feed");
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state
    const [trendingPolls, setTrendingPolls] = useState(null); // default to null for loading state
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    globalEventEmitter.on('sharedPoll', ({ pollId }) => {
        fetchPolls(pollId).then(res => {
            setPolls(res);
        });
    })

    useEffect(() => {
        fetchMyProfile().then(res => {
            if (res?.userId) {
                setLoggedInUserId(res.userId);
            }
        });

        fetchPolls().then(res => {
            setPolls(res);
        });

        fetchTrendingPolls().then(res => {
            if (!res)
                return;
            setTrendingPolls(res);
        });
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        if (selectedOption.toLowerCase() === 'my feed')
            fetchPolls().then(res => {
                setPolls(res);
                setRefreshing(false);
            });
        else
            fetchTrendingPolls().then(res => {
                setTrendingPolls(res);
                setRefreshing(false);
            });
    };

    if (polls === null) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (!polls?.length) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    Something went wrong, check your network connection.
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.switcherContainer}>
                <AwesomeSwitcher
                    leftOption='MY FEED'
                    rightOption='TRENDING'
                    onDisplayModeChangedHandler={(value) => {
                        setSelectedOption(value);
                    }}
                />
            </View>
            <AwesomeFeed
                data={selectedOption.toLowerCase() === 'my feed' ? polls : trendingPolls}
                onRefresh={onRefresh}
                refreshing={refreshing}
                renderItem={(item) => {
                    item.timeLeft = calculateTimeDifference(item.endsIn);
                    return (
                        <View style={styles.container}>
                            <AwesomeCard
                                item={item}
                                handleVote={async (itemId, optionId) => {
                                }}
                                loggedInUserId={loggedInUserId}
                            />
                        </View>
                    )
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1
    },
    container: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    switcherContainer: {
        marginTop: 2,
        marginBottom: 15,
        marginLeft: 15,
        marginRight: 15
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: Colors.white,
    },
    emptyText: {
        fontSize: 16,
        color: '#555',
        textAlign: 'center',
    },
    line: {
        marginTop: 15,
        borderBottomWidth: 1,
        borderColor: Colors.lightGrey
    }
});

export default FeedView;