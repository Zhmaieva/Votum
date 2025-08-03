import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, SafeAreaView, ActivityIndicator} from "react-native";
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import AwesomeSearch from "../customComponents/AwesomeSearch";
import {fetchMyProfile, searchPolls} from "../../shared/api/apiClient";
import {calculateTimeDifference, Loader, MIN_LOADING_TIME} from "../../shared/common";

const SEARCH_FLAGS = {
    question: 1,
    answer: 2,
    username: 4,
    all: 7, // QUESTION | ANSWER | USERNAME
};

const SearchView = () => {
    const [polls, setPolls] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const [loading, setLoading] = useState(false);

    const loader = new Loader(setLoading);

    useEffect(() => {
        fetchMyProfile().then(res => {
            if (res?.userId) {
                setLoggedInUserId(res.userId);
            }
        });

        setPolls([]);
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await loader.load([
            searchPolls(searchQuery).then(res => {
                setPolls(res.slice());
                setRefreshing(false);
            })
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.searchContainer}>
                    <AwesomeSearch onSearchPress={async (query, selectedCategories) => {
                        if (query) {
                            let searchFlags = 0;
                            selectedCategories.forEach((category) => {
                                searchFlags += SEARCH_FLAGS[category.toLowerCase()];
                            })

                            await loader.load([
                                searchPolls(query, searchFlags).then(async res => {
                                    setPolls(res.slice());
                                    setRefreshing(false);
                                })
                            ]);
                        }
                        setTimeout(() => {
                            setSearchQuery(query);
                        }, MIN_LOADING_TIME)
                    }} />
                </View>
                <View style={styles.centered}>
                    <AwesomeFeed
                        data={polls}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                        isLoading={loading}
                        isSearchView={true}
                        searchQuery={searchQuery}
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
        fontFamily: Fonts.regular,
    },
    centered: {
        justifyContent: "center",
        flex: 1
    },
    searchContainer: {
        marginBottom: 0
    }
});
