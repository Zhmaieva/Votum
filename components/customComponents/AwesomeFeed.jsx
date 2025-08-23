import React, { forwardRef, useRef, useEffect, useState } from 'react';
import {
    View,
    Animated,
    Dimensions,
    StyleSheet,
    RefreshControl,
    SafeAreaView,
    Text
} from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import { getDataService, globalEventEmitter } from "../../shared/common";
import { useFocusEffect } from "@react-navigation/native";
import { fetchMyProfile, getPollOptions, viewPoll } from "../../shared/api/apiClient";
import AwesomeLoadingPoll from "./AwesomeLoadingPoll";

const minimumOptionsUpdateInterval = 1500;
const maximumOptionsUpdateIntervalIncrease = 10000;
const AnimatedFlatList = Animated.createAnimatedComponent(Animated.FlatList);

const AwesomeFeed = forwardRef(({
                                    data,
                                    onRefresh,
                                    refreshing,
                                    renderItem,
                                    appendFunction,
                                    isUserProfileView = false,
                                    isVotedPollsView = false,
                                    isSearchView = false,
                                    isLoading = false,
                                    searchQuery = null,
                                    isPollCreatedScrollTop = false,
                                    screenName = ''
                                }, externalRef) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const { height } = Dimensions.get('window');
    const NEXT_POLL_OFFSET = height * 0.16;
    const POLL_HEIGHT = isUserProfileView ? height * .72 : height * 0.84;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: Colors.white,
        },
        pollContainer: {
            height: POLL_HEIGHT,
            backgroundColor: Colors.white,
            marginBottom: -NEXT_POLL_OFFSET,
            justifyContent: 'flex-start',
        },
        placeholderContainerFeed: {
            height: POLL_HEIGHT,
            backgroundColor: Colors.white,
            marginBottom: -NEXT_POLL_OFFSET,
            justifyContent: 'center',
        },
        placeholderContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.white,
        },
        placeholderContainerUserProfile: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 100,
            backgroundColor: Colors.white,
        },
        placeholderContainerSearch: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: Colors.white,
            paddingBottom: 50
        },
        placeholderContainerLikes: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 60,
            backgroundColor: Colors.white,
        },
        placeholderText: {
            fontSize: 16,
            color: Colors.grey,
            textAlign: 'center',
            fontFamily: Fonts.regular,
        },
        row: {
            flexDirection: 'row'
        }
    });

    const [preloadedData, setPreloadedData] = useState(data);

    const flatListRef = externalRef || useRef(null);
    const timeoutRef = useRef(setTimeout(() => {}, 100));

    const scrollToTop = (data) => {
        if (data?.tabName === screenName)
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    };

    useEffect(() => {
        const pollCreatedHandler = () => {
            if (!isPollCreatedScrollTop) return;
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        };

        globalEventEmitter.on('sharedPoll', scrollToTop);
        globalEventEmitter.on('feedSwitch', scrollToTop);
        globalEventEmitter.on('pollCreated', pollCreatedHandler);

        if (data === null || data === undefined) {
            // Wait for actual data
            return;
        }

        // Keep placeholder ONLY when feed is empty; otherwise keep real data only
        if (data.length === 0) {
            setPreloadedData([{ id: 'empty-feed', type: 'placeholder' }]);
        } else {
            setPreloadedData(data);
        }

        return () => {
            globalEventEmitter.off('feedSwitch', scrollToTop);
            globalEventEmitter.off('sharedPoll', scrollToTop);
            globalEventEmitter.off('pollCreated', pollCreatedHandler);
        };
    }, [data]);

    useEffect(() => {
        if (!getDataService().getUser())
            fetchMyProfile().then(res => {
                getDataService().setUser(res);
            });

        if (
            preloadedData?.length > 0 &&
            preloadedData[0]?.user?.userId === getDataService().getUser()?.userId
        ) {
            requestAnimationFrame(() => {
                handleSnapChange(0);
            });
        }

        globalEventEmitter.on('deletePoll', onDeletePoll);
        return () => globalEventEmitter.off('deletePoll', onDeletePoll);
    }, [preloadedData]);

    const loadMorePolls = async () => {
        const realItems = preloadedData.filter(p => p.type !== 'placeholder');

        // If we've already displayed all provided `data`, try appendFunction (no end-of-feed message)
        if (data && realItems.length >= data.length) {
            if (appendFunction) {
                const newPolls = await appendFunction([]);
                if (newPolls?.length > 0) {
                    setPreloadedData(prev => [...realItems, ...newPolls]);
                }
            }
            return;
        }

        // Pull next batch from `data`
        const nextBatch = data?.slice(realItems.length, realItems.length + 5) ?? [];
        if (nextBatch.length > 0) {
            setPreloadedData(prev => [...realItems, ...nextBatch]);
        } else if (appendFunction) {
            // Fallback to appendFunction, still no placeholder if nothing comes back
            const newPolls = await appendFunction([]);
            if (newPolls?.length > 0) {
                setPreloadedData(prev => [...realItems, ...newPolls]);
            }
        }
    };

    const onDeletePoll = ({ pollId }) => {
        setPreloadedData(prevData => {
            const newData = prevData.filter((poll) => poll.id !== pollId);
            // If removing leaves zero real polls, show the empty-state placeholder
            if (newData.filter(x => x.type !== 'placeholder').length === 0) {
                return [{ id: 'empty-feed', type: 'placeholder' }];
            }
            return newData;
        });
    };

    const renderWithPlaceholder = (item) => {
        // Only render placeholders for truly empty feeds
        if (item?.type === 'placeholder') {
            const wereOtherPolls = false; // by design, this placeholder is only for completely empty feeds

            if (isUserProfileView) {
                const isCurrentUser = !!getDataService().getUser()?.userId &&
                    (!!data && data.length === 0) &&
                    // when viewing a profile, `data[0]?.user` doesn't exist; we only care about empty
                    true;

                return (
                    <View style={wereOtherPolls ? styles.placeholderContainerFeed : styles.placeholderContainerUserProfile}>
                        <Text style={styles.placeholderText}>
                            {isCurrentUser ? 'Create a new poll' : 'No polls yet'}
                        </Text>
                    </View>
                );
            }

            if (isVotedPollsView) {
                return (
                    <View style={styles.placeholderContainerLikes}>
                        <Text style={styles.placeholderText}>
                            You haven’t voted yet. Explore polls to get started!
                        </Text>
                    </View>
                );
            }

            if (isSearchView) {
                return (
                    <View style={styles.placeholderContainerSearch}>
                        <Text style={styles.placeholderText}>
                            {searchQuery ? `No polls found for "${searchQuery}"` : 'Start your search'}
                        </Text>
                    </View>
                );
            }

            // Main (personalized/trending) feed completely empty
            return (
                <View style={[styles.placeholderContainer, styles.row]}>
                    <Text style={styles.placeholderText}>
                        No polls available right now. Try again later or create one.
                    </Text>
                </View>
            );
        }

        return renderItem(item);
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const lastIndexRef = useRef(-1);

    const handleSnapChange = React.useCallback(async (index) => {
        await onSnapChange(index ?? 0);
    }, [preloadedData]);

    const onSnapChange = async (index, view = true) => {
        if (lastIndexRef.current !== index) {
            const snappedItem = preloadedData[index];
            if (snappedItem && snappedItem.id) {
                lastIndexRef.current = index;
                setCurrentIndex(index);

                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(
                    () => updatePoll(lastIndexRef.current),
                    minimumOptionsUpdateInterval + Math.random() * maximumOptionsUpdateIntervalIncrease
                );

                if (view &&
                    preloadedData[index] &&
                    preloadedData[index].type !== 'placeholder' &&
                    preloadedData[index].user?.userId !== getDataService().getUser()?.userId) {
                    await viewPoll(preloadedData[index].id);
                }

                // Preload more if < 10 left (no end-of-feed placeholder)
                if (appendFunction && ((preloadedData.length - index) <= 10)) {
                    const newPolls = await appendFunction([]);
                    if (newPolls?.length > 0) {
                        const existingIds = new Set(preloadedData.map(p => p.id));
                        const uniquePolls = newPolls.filter(p => !existingIds.has(p.id));
                        if (uniquePolls.length > 0) {
                            setPreloadedData([
                                ...preloadedData.filter(p => p.type !== 'placeholder'),
                                ...uniquePolls
                            ]);
                        }
                    }
                }
            }
        }
    };

    globalEventEmitter.on('vote', ({ pollId, options }) => {
        setPreloadedData(prevData => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(
                () => updatePoll(lastIndexRef.current),
                minimumOptionsUpdateInterval + Math.random() * maximumOptionsUpdateIntervalIncrease
            );

            const updatedData = [...prevData];
            const poll = updatedData.find(x => x.id === pollId);
            if (poll) {
                console.log('found poll to update');
                poll.options = options;
                return updatedData;
            }
            return prevData;
        });
    });

    const updatePoll = async (index) => {
        index = index > -1 ? index : 0;

        try {
            if (preloadedData[index]?.options?.some(x => x.voted) ||
                preloadedData[index]?.user?.userId === getDataService().getUser()?.userId) {
                const pollOptions = await getPollOptions(preloadedData[index].id);
                if (pollOptions) {
                    setPreloadedData(prevData => {
                        const updatedData = [...prevData];
                        const user = { ...updatedData[index]?.user };

                        if (screenName === 'MY PROFILE')
                            globalEventEmitter.emit('myProfileRefresh',{});

                        if (screenName === 'SOMEBODY PROFILE')
                            globalEventEmitter.emit('somebodyProfileRefresh',{});

                        updatedData[index] = {
                            ...updatedData[index],
                            user: {
                              ...user,
                              totalVotesNumber: pollOptions.votesCount
                            },
                            options: pollOptions.options,
                        };
                        return updatedData;
                    });
                }
            }

            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(
                () => updatePoll(lastIndexRef.current),
                minimumOptionsUpdateInterval + Math.random() * maximumOptionsUpdateIntervalIncrease
            );
        } catch (e) {
            console.log(e);
        }
    };

    useFocusEffect(React.useCallback(() => {
        lastIndexRef.current = -1;
        setCurrentIndex(-1);

        if (preloadedData?.length > 0) {
            onSnapChange(0, false);
        }
    }, [preloadedData]));

    const filteredUniqueData = (preloadedData?.filter((item, index, self) =>
        index === self.findIndex((t) => t.id === item.id)
    ) ?? []);

    return (
        <>
            {
                isLoading ? (
                    <View style={styles.container}>
                        {[1, 2, 3].map((_, idx) => (
                            <AwesomeLoadingPoll key={idx} />
                        ))}
                    </View>
                ) : (
                    <SafeAreaView style={styles.container}>
                        <AnimatedFlatList
                            ref={flatListRef}
                            data={filteredUniqueData}
                            keyExtractor={(item) => item?.id ?? String(Math.random())}
                            pagingEnabled
                            scrollEventThrottle={16}
                            showsVerticalScrollIndicator={false}
                            snapToAlignment="start"
                            snapToOffsets={filteredUniqueData.map((_, index) => index * (POLL_HEIGHT - NEXT_POLL_OFFSET))}
                            decelerationRate="fast"
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing ?? false}
                                    onRefresh={onRefresh ?? (() => {})}
                                    tintColor="#888"
                                />
                            }
                            renderItem={({ item }) => (
                                <View style={styles.pollContainer}>{renderWithPlaceholder(item)}</View>
                            )}
                            onEndReached={loadMorePolls}
                            onEndReachedThreshold={0.5}
                            onScroll={({ nativeEvent }) => {
                                const offsetY = nativeEvent.contentOffset.y;
                                const index = Math.round(offsetY / (POLL_HEIGHT - NEXT_POLL_OFFSET));
                                handleSnapChange(index);

                                Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                    { useNativeDriver: false }
                                )
                            }}
                        />
                    </SafeAreaView>
                )
            }
        </>
    );
});

export default AwesomeFeed;