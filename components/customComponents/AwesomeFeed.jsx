import React, { useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, RefreshControl } from 'react-native';
const { height, width } = Dimensions.get('window');
const POLL_HEIGHT = height * 0.82; // 90% of the screen height
const NEXT_POLL_OFFSET = height * 0.18; // 10% of the next poll visible

const AwesomeFeed = ({data, onRefresh, refreshing, renderItem,}) => {
    const scrollY = useRef(new Animated.Value(0)).current;

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={data}
                keyExtractor={(item) => item?.id ?? item}
                pagingEnabled
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                snapToOffsets={data.map((_, index) => index * (POLL_HEIGHT - NEXT_POLL_OFFSET))}
                decelerationRate="fast"
                refreshControl={
                    <RefreshControl refreshing={refreshing ?? false} onRefresh={onRefresh ?? (_ => {})} tintColor="#007bff" />
                }
                renderItem={({item}) => {
                    return <View style={styles.pollContainer}>
                        {renderItem(item)}
                    </View>
                }}
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
        backgroundColor: '#f5f5f5',
    },
    pollContainer: {
        height: POLL_HEIGHT,
        backgroundColor: '#ffffff',
        borderRadius: 0,
        marginBottom: -NEXT_POLL_OFFSET, // Partially show the next poll
        justifyContent: 'flex-start',
    },
});

export default AwesomeFeed;
