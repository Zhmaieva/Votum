import React, {useState, useEffect, useRef} from 'react';
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeCard from "../customComponents/AwesomeCard";
import {View, StyleSheet, ActivityIndicator, Text, SafeAreaView} from 'react-native';
import {fetchPolls, fetchMyProfile, voteOnPoll, fetchTrendingPolls} from "../../shared/api/apiClient";
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeSwitcher from "../customComponents/AwesomeSwitcher";
import {
    calculateTimeDifference,
    getDataService,
    globalEventEmitter,
    MIN_EXTRA_LOADING_TIME,
    MIN_LOADING_TIME
} from "../../shared/common";
import AwesomeLoadingPoll from "../customComponents/AwesomeLoadingPoll";

const FeedView = ({ route }) => {
    const [selectedOption, setSelectedOption] = useState("my feed");
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state
    const [trendingPolls, setTrendingPolls] = useState(null); // default to null for loading state
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const loaded = useRef(false);

    globalEventEmitter.on('sharedPoll', ({ pollId }) => {
        fetchPolls(pollId).then(res => {
            setPolls(res);
        });
    })

    const handleLoading = async function (startTime) {
        loaded.current = true;
        const elapsed = Date.now() - startTime;
        console.log('elapsed', elapsed);
        let delay = Math.max(0, elapsed - MIN_LOADING_TIME);
        if (delay > 0 && loading && !polls) {
            delay = MIN_EXTRA_LOADING_TIME;
        }
        setTimeout(() => {
            setLoading(false);
        }, delay);
    }

    const scheduleLoading = async () => {
        loaded.current = false;
        setTimeout(() => {
            if (!loaded.current && !loading) {
                setLoading(true);
            }
        }, MIN_LOADING_TIME);
    }

    useEffect(() => {
        const startTime = Date.now();

        scheduleLoading().then(_ => {});

        Promise.all([
            fetchMyProfile().then(async res => {
                if (res?.userId) {
                    setLoggedInUserId(res.userId);
                }
            }),
            fetchPolls().then(res => {
                setPolls(res);
            }),
            fetchTrendingPolls().then(res => {
                if (!res)
                    return;
                setTrendingPolls(res);
            })
        ]).then(async (res) => {
           await handleLoading(startTime);
        });
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        const startTime = Date.now();

        if (selectedOption.toLowerCase() === 'my feed') {

            scheduleLoading().then(_ => {});

            fetchPolls().then(async res => {
                //await new Promise(resolve => setTimeout(resolve, 1000)); //to test delay

                setPolls(res);
                setRefreshing(false);

                await handleLoading(startTime);
            });
        }
        else
            fetchTrendingPolls().then(async res => {
                setTrendingPolls(res);
                setRefreshing(false);

               await handleLoading(startTime);
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
                isLoading={loading}
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
                appendFunction={async (excludedPollIds) => {
                    return await getDataService().getMorePolls();
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
        marginBottom: 7,
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
        fontFamily: Fonts.regular,
    },
    line: {
        marginTop: 15,
        borderBottomWidth: 1,
        borderColor: Colors.lightGrey
    }
});

export default FeedView;