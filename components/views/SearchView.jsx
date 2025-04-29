import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, SafeAreaView, ActivityIndicator} from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeSearch from "../customComponents/AwesomeSearch";
import {fetchLikedPolls, fetchMyProfile, searchPolls} from "../../shared/api/apiClient";
import {calculateTimeDifference} from "../../shared/common";

const SearchView = () => {
    const [polls, setPolls] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        fetchMyProfile().then(res => {
            if (res?.userId) {
                setLoggedInUserId(res.userId);
            }
        });

        setPolls([]);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        searchPolls(searchQuery).then(res => {
            setPolls(res.slice());
            setRefreshing(false);
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <AwesomeSearch onSearchPress={(query) => {
                        setSearchQuery(query);
                        searchPolls(query).then(res => {
                            setPolls(res.slice());
                            setRefreshing(false);
                        });
                    }} />
                </View>
                <View style={styles.centered}>
                    {(!polls || polls?.length === 0) && searchQuery !== "" ? (
                        <Text style={styles.noResultsText}>No polls found for "{searchQuery}"</Text>
                    ) : (
                        <AwesomeFeed
                            data={polls}
                            onRefresh={onRefresh}
                            refreshing={refreshing}
                            isSearchView={true}
                            renderItem={(item) => {
                                item.timeLeft = calculateTimeDifference(item.endsIn);
                                return (
                                    <View>
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
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SearchView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 10,
        flex: 1
    },
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1
    },
    alignStyle: {
        justifyContent: 'space-between'
    },
    noResultsText: {
        fontSize: 16,
        color: Colors.grey,
        textAlign: 'center',
    },
    centered: {
        justifyContent: "center",
        flex: 1
    },
    searchContainer: {
        marginBottom: 10
    }
});
