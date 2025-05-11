import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Animated,
    Dimensions,
    StyleSheet,
    RefreshControl,
    SafeAreaView,
    Text
} from 'react-native';
const { height, width } = Dimensions.get('window');
const POLL_HEIGHT = height * 0.82;
const NEXT_POLL_OFFSET = height * 0.18;
import { Colors } from '../../utils/colorUtils';
import {getDataService, globalEventEmitter} from "../../shared/common";
import AwesomeLink from "./AwesomeLink";
import {useFocusEffect} from "@react-navigation/native";
import {fetchMyProfile, getPollOptions, viewPoll, viewPollRequest} from "../../shared/api/apiClient";

const AwesomeFeed = ({
                         data,
                         onRefresh,
                         refreshing,
                         renderItem,
                         appendFunction,
                         isUserProfileView = false,
                         isLikedPollsView = false,
                         isSearchView = false
}) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [preloadedData, setPreloadedData] = useState([]);

    const flatListRef = useRef(null);
    const timeoutRef = useRef(setTimeout(() => {}, 100));

    globalEventEmitter.on('sharedPoll', () => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    });

    useEffect(() => {
        if (!getDataService().getUser())
            fetchMyProfile().then(res => {
                getDataService().setUser(res);
                applyData();
            });
        else {
            applyData();
        }
    },[data])

    const applyData = () => {
        if (!data?.length || data.length === 0) {
            // If no data, show the "no more polls" item
            setPreloadedData([{ id: 'no-more-polls', type: 'placeholder' }]);
        } else {
            setPreloadedData(data.slice());
        }
    }

    const loadMorePolls = () => {
        const nextBatch = data?.slice(preloadedData.length, preloadedData.length + 5);
        if (!nextBatch || nextBatch?.length === 0) {
            if (!preloadedData.find(item => item?.type === 'placeholder')) {
                setPreloadedData(prevData => [
                    ...prevData,
                    { id: 'no-more-polls', type: 'placeholder' }
                ]);
            }
        } else {
            setPreloadedData(prevData => [
                ...prevData,
                ...nextBatch
            ]);
        }
    };

    globalEventEmitter.on('deletePoll', ({ pollId }) => {
        const newData = data.filter((poll) => poll.id !== pollId);
        if (newData.length === 0) {
            setPreloadedData([{ id: 'no-more-polls', type: 'placeholder' }]);
        } else {
            setPreloadedData(newData.slice());
        }
    });

    const renderWithPlaceholder = (item) => {
        if (item?.type === 'placeholder') {
            if (isUserProfileView) {
                const isCurrentUser = data && getDataService().getUser()?.userId === data[0]?.user?.userId;

                return (
                    <View style={styles.placeholderContainerUserProfile}>
                        <Text style={styles.placeholderText}>
                            {isCurrentUser
                                ? 'Create your first poll now'
                                : "This user hasn't created any polls yet"}
                        </Text>
                    </View>
                );
            }

            if (isLikedPollsView) {
                return (
                    <View style={styles.placeholderContainerLikes}>
                        <Text style={styles.placeholderText}>
                            You haven't liked any polls yet. Go spread some love
                        </Text>
                    </View>
                );
            }

            if (isSearchView) {
                return (
                    <View style={styles.placeholderContainerSearch}>
                        <Text style={styles.placeholderText}>
                            Start your search
                        </Text>
                    </View>
                );
            }

            return (
                <View style={[styles.placeholderContainer, styles.row]}>
                    <Text style={styles.placeholderText}>
                        No new polls, try later or{' '}
                    </Text>
                    <AwesomeLink text="create one." screenName='Add Poll' />
                </View>
            );
        }

        return renderItem(item);
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const lastIndexRef = useRef(-1);

    const handleSnapChange = React.useCallback(async (index) => {
        await onSnapChange(index);
    }, [preloadedData]);

    const onSnapChange = async (index) => {
        if (lastIndexRef.current !== index) {
            const snappedItem = preloadedData[index];
            if (snappedItem && snappedItem.id) {
                lastIndexRef.current = index;
                setCurrentIndex(index);

                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => updatePoll(lastIndexRef.current),3000 + Math.random() * 10000);

                if (preloadedData[index] && preloadedData[index].type !== 'placeholder' && preloadedData[index].user?.userId !== getDataService().getUser()?.userId) {
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
                            setPreloadedData(existingPolls.concat(uniquePolls));
                        }
                    }
                }
            }
        }
    };

    globalEventEmitter.on('vote', ({ pollId, options }) => {
        setPreloadedData(prevData => {
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
        if (preloadedData[index].options.some(x => x.voted) || preloadedData[index].user?.userId === getDataService().getUser()?.userId) {
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
        timeoutRef.current = setTimeout(() => updatePoll(lastIndexRef.current),3000 + Math.random() * 10000);
    }

    useFocusEffect(React.useCallback(() => {
        lastIndexRef.current = -1;
        setCurrentIndex(-1);
        onSnapChange(0);
    }, []));

    return (
        <SafeAreaView style={styles.container}>
            <Animated.FlatList
                data={preloadedData}
                ref={flatListRef}
                keyExtractor={(item) => item?.id ?? String(Math.random())}
                pagingEnabled
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                snapToOffsets={preloadedData?.map((_, index) => index * (POLL_HEIGHT - NEXT_POLL_OFFSET)) ?? 0}
                decelerationRate="fast"
                refreshControl={
                    <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh ?? (() => { })} tintColor="#888" />
                }
                renderItem={({ item }) => (
                    <View style={styles.pollContainer}>{renderWithPlaceholder(item)}</View>
                )}
                onEndReached={loadMorePolls}
                onEndReachedThreshold={0.5}
                onScroll={({nativeEvent}) => {
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
    );
};

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
    },
    row: {
        flexDirection: 'row'
    }
});

export default AwesomeFeed;
