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
import {Colors, Fonts} from '../../utils/colorUtils';
import {getDataService, globalEventEmitter, Logger} from "../../shared/common";
import {useFocusEffect} from "@react-navigation/native";
import {fetchMyProfile, getPollOptions, viewPoll, viewPollRequest} from "../../shared/api/apiClient";
import AwesomeLoadingPoll from "./AwesomeLoadingPoll";

const minimumOptionsUpdateInterval = 2000;//1500;
const maximumOptionsUpdateIntervalIncrease = 0;//10000;
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
                                }, externalRef) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const { height, width } = Dimensions.get('window');
    const NEXT_POLL_OFFSET = height * 0.17;
    const POLL_HEIGHT = isUserProfileView ? height * .6 : height * 0.83;

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
            fontFamily: Fonts.regular
        },
        row: {
            flexDirection: 'row'
        }
    });

    const [preloadedData, setPreloadedData] = useState(data);


    const flatListRef = externalRef || useRef(null);
    const timeoutRef = useRef(setTimeout(() => {}, 100));

    useEffect(() => {
        const handler = () => {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        };
        const pollCreatedHandler = () => {
            if (!isPollCreatedScrollTop)
                return;

            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        };

        globalEventEmitter.on('sharedPoll', handler);


        globalEventEmitter.on('pollCreated', pollCreatedHandler);
        if (data === null || data === undefined) {
            // Don't update yet — wait for actual data to arrive
            return;
        }

        if (data.length === 0) {
            setPreloadedData([{ id: 'no-more-polls', type: 'placeholder' }]);
        } else {
            setPreloadedData(data);
        }

        return () => {
            globalEventEmitter.off('sharedPoll', handler);
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
        return () => globalEventEmitter.off('deletePoll', onDeletePoll); // cleanup
    },[preloadedData])

    const loadMorePolls = async () => {
        const realItems = preloadedData.filter(p => p.type !== 'placeholder');

        // Check if we've already reached the end
        if (data && realItems.length >= data.length) {
            if (!preloadedData.find(item => item?.type === 'placeholder')) {
                setPreloadedData(prev => [...realItems, { id: 'no-more-polls', type: 'placeholder' }]);
            }
            return;
        }

        // Pull next batch from `data`
        const nextBatch = data?.slice(realItems.length, realItems.length + 5) ?? [];

        if (nextBatch.length > 0) {
            setPreloadedData(prev => [...realItems, ...nextBatch]);
        } else {
            // ✅ Safeguard: fallback to appendFunction
            if (appendFunction) {
                const newPolls = await appendFunction([]);

                // const uniquePolls = (newPolls ?? []).filter(p => !realItems.find(r => r.id === p.id));

                if (uniquePolls.length > 0) {
                    setPreloadedData(prev => [...realItems, ...newPolls]);
                } else if (!preloadedData.find(item => item?.type === 'placeholder')) {
                    setPreloadedData(prev => [...realItems, { id: 'no-more-polls', type: 'placeholder' }]);
                }
            }
        }
    };

    const onDeletePoll = ({ pollId }) => {
        setPreloadedData(prevData => {
            const newData = prevData.filter((poll) => poll.id !== pollId);
            if (newData.length === 0) {
                return [{ id: 'no-more-polls', type: 'placeholder' }];
            } else {
                return newData;
            }
        });
    };

    const renderWithPlaceholder = (item) => {
        if (item?.type === 'placeholder' && (data === null || data === undefined)) {
            return null; // or loading spinner
        }
        if (item?.type === 'placeholder') {
            const wereOtherPolls = data.length > 1;

            if (isUserProfileView) {
                const isCurrentUser = data && getDataService().getUser()?.userId === data[0]?.user?.userId;

                if (item?.id === 'no-more-polls') {
                    return (
                        <View style={wereOtherPolls ? styles.placeholderContainerFeed : styles.placeholderContainerUserProfile}>
                            {isCurrentUser ? (
                                <Text style={styles.placeholderText}>
                                    Create a new poll
                                </Text>
                            ) : (
                                <Text style={styles.placeholderText}>
                                    No new polls
                                </Text>
                            )}
                        </View>
                    );
                } else {
                    return (
                        <View style={wereOtherPolls ? styles.placeholderContainerFeed : styles.placeholderContainerUserProfile}>
                            <Text style={styles.placeholderText}>
                                {isCurrentUser
                                    ? 'No more polls here, time to create a new one'
                                    : "No more polls to show"}
                            </Text>
                        </View>
                    );
                }
            }

            if (isVotedPollsView) {
                return (
                    <View style={wereOtherPolls ? styles.placeholderContainerFeed : styles.placeholderContainerLikes}>
                        <Text style={styles.placeholderText}>
                            You haven't voted yet. Jump in and share your opinion!
                        </Text>
                    </View>
                );
            }

            if (isSearchView) {
                if (searchQuery) {
                    return (
                        <View style={wereOtherPolls ? styles.placeholderContainerFeed : styles.placeholderContainerSearch}>
                            <Text style={styles.placeholderText}>
                                No polls found for "{searchQuery}"
                            </Text>
                        </View>
                    )
                }
                return (
                    <View style={wereOtherPolls ? styles.placeholderContainerFeed : styles.placeholderContainerSearch}>
                        <Text style={styles.placeholderText}>
                            Start your search
                        </Text>
                    </View>
                );
            }

            return (
                <View style={wereOtherPolls ? [styles.placeholderContainerFeed, styles.row] : [styles.placeholderContainer, styles.row]}>
                    <Text style={styles.placeholderText}>
                        No new polls, try later or create one
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
                timeoutRef.current = setTimeout(() => updatePoll(lastIndexRef.current),minimumOptionsUpdateInterval + Math.random() * maximumOptionsUpdateIntervalIncrease);

                if (view && preloadedData[index] && preloadedData[index].type !== 'placeholder' && preloadedData[index].user?.userId !== getDataService().getUser()?.userId) {
                    await viewPoll(preloadedData[index].id);
                }

                // ⬇️ Trigger more loading if fewer than 10 polls left
                if (appendFunction && ((preloadedData.length - index) <= 10)) {
                    const newPolls = await appendFunction([]); // Your method to fetch more polls
                    if (newPolls?.length > 0) {
                        // Filter out duplicates
                        const existingPolls = preloadedData;
                        const existingIds = new Set(existingPolls.map(p => p.id));
                        const uniquePolls = newPolls.filter(p => !existingIds.has(p.id));

                        if (uniquePolls.length > 0) {
                            setPreloadedData([
                                ...existingPolls.filter(p => p.type !== 'placeholder'),
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
            timeoutRef.current = setTimeout(() => updatePoll(lastIndexRef.current),minimumOptionsUpdateInterval + Math.random() * maximumOptionsUpdateIntervalIncrease);

            const updatedData = [...prevData];
            const poll = updatedData.find(x => x.id === pollId);
            if (poll) {
                poll.options = options;
                return updatedData;
            }
            return prevData;
        });
    });

    const updatePoll = async (index) => {
        index = index > -1 ? index : 0;

        if (preloadedData[index]?.options.some(x => x.voted) || preloadedData[index]?.user?.userId === getDataService().getUser()?.userId) {
            const pollOptions = await getPollOptions(preloadedData[index].id);
            if (pollOptions) {
                setPreloadedData(prevData => {
                    const updatedData = [...prevData]; // Create a copy of the data
                    updatedData[index] = {
                        ...updatedData[index],
                        options: pollOptions, // Update the specific poll's options
                    };
                    return updatedData; // Return the updated data
                });
            }
        }

        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => updatePoll(lastIndexRef.current),minimumOptionsUpdateInterval + Math.random() * maximumOptionsUpdateIntervalIncrease);
    }

    useFocusEffect(React.useCallback(() => {
        lastIndexRef.current = -1;
        setCurrentIndex(-1);

        if (preloadedData?.length > 0) {
            onSnapChange(0, false);
        }
    }, [preloadedData]));

    return (
        <>
            {
                isLoading ? (
                    <View style={styles.container}>
                        {[1, 2, 3].map((_, idx) => (
                            <AwesomeLoadingPoll key={idx}/>
                        ))}
                    </View>
                ) : (
                    <SafeAreaView style={styles.container}>
                        <AnimatedFlatList
                            ref={flatListRef}
                            data={preloadedData?.filter((item, index, self) =>
                                index === self.findIndex((t) => t.id === item.id)
                            ) ?? []}
                            keyExtractor={(item) => item?.id ?? String(Math.random())}
                            pagingEnabled
                            scrollEventThrottle={16}
                            showsVerticalScrollIndicator={false}
                            snapToAlignment="start"
                            snapToOffsets={preloadedData?.map((_, index) => index * (POLL_HEIGHT - NEXT_POLL_OFFSET)) ?? 0}
                            decelerationRate="fast"
                            refreshControl={
                                <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh ?? (() => {
                                })} tintColor="#888"/>
                            }
                            renderItem={({item}) => (
                                <View style={styles.pollContainer}>{renderWithPlaceholder(item)}</View>
                            )}
                            onEndReached={loadMorePolls}
                            onEndReachedThreshold={0.5}
                            onScroll={({nativeEvent}) => {
                                const offsetY = nativeEvent.contentOffset.y;
                                const index = Math.round(offsetY / (POLL_HEIGHT - NEXT_POLL_OFFSET));
                                handleSnapChange(index);

                                Animated.event(
                                    [{nativeEvent: {contentOffset: {y: scrollY}}}],
                                    {useNativeDriver: false}
                                )
                            }}
                        />
                    </SafeAreaView>
                )
            }
        </>

    )
});

export default AwesomeFeed;
