import React, { useRef, useEffect, useState } from 'react';
import { View, Animated, Dimensions, StyleSheet, RefreshControl } from 'react-native';
const { height, width } = Dimensions.get('window');
const POLL_HEIGHT = height * 0.82; // 90% of the screen height
const NEXT_POLL_OFFSET = height * 0.18; // 10% of the next poll visible
import { Colors } from '../../utils/colorUtils';

const AwesomeFeed = ({ data, onRefresh, refreshing, renderItem }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [preloadedData, setPreloadedData] = useState([]);

    useEffect(() => {
        if (data.length > 0) {
            setPreloadedData(data.slice(0, 5)); // Preload first 5 polls
        }
    }, [data]);

    const loadMorePolls = () => {
        setPreloadedData((prevData) => [
            ...prevData,
            ...data.slice(prevData.length, prevData.length + 5),
        ]);
    };

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={preloadedData}
                keyExtractor={(item) => item?.id ?? item}
                pagingEnabled
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                snapToOffsets={preloadedData.map((_, index) => index * (POLL_HEIGHT - NEXT_POLL_OFFSET))}
                decelerationRate="fast"
                refreshControl={
                    <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh ?? (() => {})} tintColor="#888" />
                }
                renderItem={({ item }) => (
                    <View style={styles.pollContainer}>{renderItem(item)}</View>
                )}
                onEndReached={loadMorePolls}
                onEndReachedThreshold={0.5}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
            />
        </View>
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
        marginBottom: -NEXT_POLL_OFFSET, // Partially show the next poll
        justifyContent: 'flex-start',
    },
});

export default AwesomeFeed;
