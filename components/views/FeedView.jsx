import React, {useState, useEffect, useRef} from 'react';
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeCard from "../customComponents/AwesomeCard";
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {fetchPolls, fetchMyProfile, fetchTrendingPolls} from "../../shared/api/apiClient";
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeSwitcher from "../customComponents/AwesomeSwitcher";
import {
    calculateTimeDifference,
    getDataService,
    globalEventEmitter, Loader, Logger,
} from "../../shared/common";
import * as Linking from 'expo-linking';

const FeedView = ({ route }) => {
    const [selectedOption, setSelectedOption] = useState("my feed");
    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state
    const [trendingPolls, setTrendingPolls] = useState(null); // default to null for loading state
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const feedRef = useRef(null);

    const loader = new Loader(setLoading);

    useEffect(() => {
        let handler = () => {};
        try {
            handler = ({ pollId }) => {
                Logger.log('Feed view: shared poll', pollId);
                fetchPolls(pollId).then(res => {
                    setPolls(res);
                });
                setSelectedOption('my feed');
            };
            globalEventEmitter.on('sharedPoll', handler);

            Linking.getInitialURL().then(url => {
                const { path } = Linking.parse(url);
                const parts = path?.split('/') ?? [];
                loadAll(parts[parts.length - 1]);
            }).catch(() => {
                loadAll();
            });
        } catch {
            loadAll();
            handler = () => {};
        }

        return () => {
            globalEventEmitter.off('sharedPoll', handler);
        };
    }, []);

    const loadAll = function(featuredPoll = '') {
        loader.load([
            fetchMyProfile().then(async res => {
                if (res?.userId) {
                    setLoggedInUserId(res.userId);
                }
            }),
            fetchPolls(featuredPoll)
                .then(res => {
                    setPolls(res);
                    setError(null);
                })
                .catch(() => {
                    setPolls([]);
                    setError('network'); // custom flag for error
                }),
            fetchTrendingPolls()
                .then(res => {
                    if (!res) return;
                    setTrendingPolls(res);
                })
                .catch(() => {
                    setTrendingPolls([]);
                    setError('network'); // custom flag for error
                }),
        ]).then(_ => {});
    }

    const onRefresh = async () => {
        setRefreshing(true);

        if (selectedOption.toLowerCase() === 'my feed') {
            await loader.load([
                fetchPolls().then(async res => {
                    setPolls(res);
                    setRefreshing(false);
                })
            ]);
        }
        else
            await loader.load([
                fetchTrendingPolls().then(async res => {
                    setTrendingPolls(res);
                    setRefreshing(false);
                })
            ]);
    };

    if (error === 'network') {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    Something went wrong, check your network connection.
                </Text>
            </View>
        );
    }

    // if (polls?.length === 0) {
    //     return (
    //         <View style={styles.emptyContainer}>
    //             <Text style={styles.emptyText}>
    //                 No polls to show right now — check back later!
    //             </Text>
    //         </View>
    //     );
    // }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top']}>
            <View style={styles.container}>
                <View style={styles.switcherContainer}>
                    <AwesomeSwitcher
                        leftOption='MY FEED'
                        rightOption='TRENDING'
                        onDisplayModeChangedHandler={async (value) => {
                            const refresh = selectedOption !== value
                            setSelectedOption(value);
                            globalEventEmitter.emit('feedSwitch',{});
                            if (refresh)
                                await loadAll();
                            // setLoading(true); // will show <AwesomeLoadingPoll /> in AwesomeFeed
                            // setTimeout(() => setLoading(false), 300); // short delay to smoothen UI
                        }}
                    />
                </View>
                <AwesomeFeed
                    screenName={'FEED'}
                    ref={feedRef}
                    data={selectedOption.toLowerCase() === 'my feed' ? polls : trendingPolls}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    isLoading={loading}
                    renderItem={(item) => {
                        item.timeLeft = calculateTimeDifference(item.endsIn);
                        return (
                            <AwesomeCard
                                item={item}
                                handleVote={async (itemId, optionId) => {
                                }}
                        loggedInUserId={loggedInUserId}
                        />
                    )
                    }}
                    appendFunction={async (excludedPollIds) => {
                        return await getDataService().getMorePolls();
                    }}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingRight: 15,
        paddingLeft: 15,
    },
    switcherContainer: {
        marginBottom: 5,
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