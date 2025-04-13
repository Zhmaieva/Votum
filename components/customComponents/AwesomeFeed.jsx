import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Animated,
    Dimensions,
    StyleSheet,
    RefreshControl,
    SafeAreaView,
    Text,
} from 'react-native';
const { height, width } = Dimensions.get('window');
const POLL_HEIGHT = height * 0.82;
const NEXT_POLL_OFFSET = height * 0.18;
import { Colors } from '../../utils/colorUtils';
import { globalEventEmitter } from "../../shared/common";
import AwesomeLink from "./AwesomeLink";
import {useFocusEffect} from "@react-navigation/native";
import {getPollOptions} from "../../shared/api/apiClient";

const AwesomeFeed = ({ data, onRefresh, refreshing, renderItem }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [preloadedData, setPreloadedData] = useState(data);

    const timeoutRef = useRef(setTimeout(() => {}, 100));

    useEffect(() => {
        if (data.length === 0) {
            // If no data, show the "no more polls" item
            setPreloadedData([{ id: 'no-more-polls', type: 'placeholder' }]);
        } else {
            setPreloadedData(data.slice());
        }
    }, [data]);

    const loadMorePolls = () => {
        const nextBatch = data.slice(preloadedData.length, preloadedData.length + 5);
        if (nextBatch.length === 0) {
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
            return (
                <View style={[styles.placeholderContainer, styles.row]}>
                    <Text style={styles.placeholderText}>No new polls, try later or</Text>
                    <AwesomeLink text="create one." screenName='Add'/>
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
            }
        }
    };

    const updatePoll = async (index) => {
        console.log('loading poll', preloadedData[index].question);
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
                keyExtractor={(item) => item?.id ?? String(Math.random())}
                pagingEnabled
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                snapToOffsets={preloadedData.map((_, index) => index * (POLL_HEIGHT - NEXT_POLL_OFFSET))}
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
        borderRadius: 0,
        marginBottom: -NEXT_POLL_OFFSET,
        justifyContent: 'flex-start',
    },
    placeholderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40
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
