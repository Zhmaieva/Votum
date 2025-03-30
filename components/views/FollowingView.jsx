import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated, RefreshControl, SafeAreaView} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import {fetchFollowers, fetchFollows, fetchMyProfile} from "../../shared/api/apiClient";
import {useFocusEffect} from "@react-navigation/native";

const FollowingView = () => {
    const scrollY = useRef(new Animated.Value(0)).current;

    const [user, setUser] = useState(null);
    const [follows, setFollows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetchMyProfile();
            setUser(res);
            const followsData = await fetchFollows(res.userId);
            setFollows(followsData?.users);
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.FlatList
                data={follows ?? []}
                keyExtractor={(item) => item?.userId ?? item}
                pagingEnabled
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                snapToAlignment="start"
                decelerationRate="fast"
                renderItem={({ item }) => {
                    console.log('render follow', item);
                    return <AwesomeUserHeader userData={item} loggedInUserId={user?.userId} />;
                }}
                onEndReached={() => {
                    // TODO: load more followers if we decide to implement paging
                }}
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
        padding: 14,
        backgroundColor: Colors.white,
    },
});

export default FollowingView;