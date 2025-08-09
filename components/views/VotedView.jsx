import React, {useEffect, useState} from "react";
import {View, StyleSheet, ActivityIndicator, Text} from "react-native";
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import {calculateTimeDifference, globalEventEmitter, Loader} from "../../shared/common";
import {fetchVotedPolls, fetchMyProfile} from "../../shared/api/apiClient";
import {useFocusEffect} from "@react-navigation/native";

const VotedView = () => {

    const [refreshing, setRefreshing] = useState(false);
    const [polls, setPolls] = useState(null); // default to null for loading state
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [loading, setLoading] = useState(false);

    const loader = new Loader((value) => {
        setLoading(value);
    });

    useFocusEffect(React.useCallback(() => {
        globalEventEmitter.emit('feedSwitch', {});
    }, []))

    useEffect(() => {
        loader.load([
            fetchMyProfile().then(res => {
                if (res?.userId) {
                    setLoggedInUserId(res.userId);
                }
            }),
            fetchVotedPolls().then(async res => {
                setPolls(res);
            })
        ]).then(() => {});

        globalEventEmitter.on('vote', onVote);
        return () => globalEventEmitter.off('vote', onVote); // cleanup
    }, []);

    const onVote = _ => {
        if ((polls && polls.length > 0) || !polls) {
            loader.load([
                fetchVotedPolls().then(async res => {
                    setPolls(res);
                })
            ]).then(() => {});
        }
    }

    const onRefresh = () => {
        setRefreshing(true);
        loader.load([
            fetchVotedPolls().then(async res => {
                //await new Promise(resolve => setTimeout(resolve, 4000)); //to test delay

                setPolls(res.slice());
                setRefreshing(false);
            })
        ]).then(() => {});
    };

    return (
        (polls || loading) ? (
        <AwesomeFeed
            data={polls}
            onRefresh={onRefresh}
            refreshing={refreshing}
            isVotedPollsView={true}
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
        />
        ) : (
            <></>
        )
    );
};

export default VotedView;

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingRight: 15,
        paddingLeft: 15
    }
});