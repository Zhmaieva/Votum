import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeUserHeaderPreview from "../customComponents/AwesomeUserHeaderPreview";
import { fetchFollows, fetchMyProfile } from "../../shared/api/apiClient";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from 'react-native-safe-area-context';

const FollowingView = () => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const [user, setUser] = useState(null);
    const [follows, setFollows] = useState([]);

    const fetchData = async () => {
        const res = await fetchMyProfile();
        setUser(res);
        const followsData = await fetchFollows(res.userId);
        setFollows(followsData?.users || []);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['left', 'right']}>
            <View style={styles.container}>
                {follows.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            You're not following anyone yet. Explore feed and start your journey.
                        </Text>
                    </View>
                ) : (
                    <Animated.FlatList
                        data={follows}
                        keyExtractor={(item) => item?.userId ?? item}
                        pagingEnabled
                        scrollEventThrottle={16}
                        showsVerticalScrollIndicator={false}
                        snapToAlignment="start"
                        decelerationRate="fast"
                        renderItem={({ item }) => (
                            <View style={styles.margin10}>
                                <AwesomeUserHeaderPreview
                                    userData={item}
                                    loggedInUserId={user?.userId}
                                />
                            </View>
                        )}
                        onEndReachedThreshold={0.5}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 15,
    },
    margin10: {
        marginBottom: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: Colors.grey,
        textAlign: 'center',
        paddingHorizontal: 20,
        fontFamily: Fonts.regular
    },
});

export default FollowingView;
