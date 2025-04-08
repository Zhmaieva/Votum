import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, SafeAreaView, ScrollView, Modal, Pressable} from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeVote from "../customComponents/AwesomeVote";
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeSwitcher from "../customComponents/AwesomeSwitcher";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import { fetchMyProfile } from "../../shared/api/apiClient";
import {useFocusEffect} from "@react-navigation/native";
import { useNavigation } from '@react-navigation/native';
import {getDataService} from "../../shared/common";

const pollData = [
    {
        id: 1,
        question: "What is your favorite color?",
        options: ["Red", "Blue"],
        results: { "Red": 20, "Blue": 80 },
        timeLeft: "10m 30s",
        totalVotes: 1457
    },
    {
        id: 2,
        question: "What is your favorite city?",
        options: ["NY", "London", "Gdansk", "Kherson"],
        results: { "NY": 20, "London": 50, "Gdansk": 15, "Kherson": 15 },
        timeLeft: "1m 15s",
        totalVotes: 2
    }
];

const closedPollData = [
    {
        id: 3,
        question: "What is your favorite singer?",
        options: ["Weeknd", "Lady Gaga"],
        results: { "Weeknd": 50, "Lady Gaga": 50 },
        timeLeft: "Expired",
        totalVotes: 1457
    },
    {
        id: 4,
        question: "What is your favorite animal?",
        options: ["Lion", "Dog", "Cat", "Chicken"],
        results: { "Lion": 80, "Dog": 10, "Cat": 3, "Chicken": 7 },
        timeLeft: "Expired",
        totalVotes: 209543
    }
];

const MyUserProfileView = () => {
    const [selectedOption, setSelectedOption] = useState("active");

    const [modalVisible, setModalVisible] = useState(false);

    const [user, setUser] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            if (getDataService().getUser()) {
                setUser(getDataService().getUser());
            } else {
                fetchMyProfile().then(res => {
                    setUser(res);
                });
            }
        }, [])
    );

    const navigation = useNavigation();

    const onPressHandler = (screenName) => {
        navigation.navigate(screenName)
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentWrapper}>
                    <View style={styles.bottomMargin20}>
                        <AwesomeUserHeader userData={user} loggedInUserId={user?.userId} isProfilePage={true}/>
                    </View>
                    <View style={[styles.followersContainer, styles.row]}>
                        <View style={styles.followersLeftSubContainer}>
                            <Text style={styles.followersText}>213</Text>
                            <Text style={styles.followersText}>polls</Text>
                        </View>
                        <Pressable style={styles.followersCenterSubContainer}
                                   onPress={()=>onPressHandler('Followers')}>
                            <Text style={styles.followersText}>15K</Text>
                            <Text style={styles.followersText}>followers</Text>
                        </Pressable>
                        <Pressable style={styles.followersRightSubContainer}
                                   onPress={()=>onPressHandler('Following')}>
                            <Text style={styles.followersText}>103</Text>
                            <Text style={styles.followersText}>following</Text>
                        </Pressable>
                    </View>

                    <View style={styles.bottomMargin20}>
                        <AwesomeSwitcher
                            leftOption='active'
                            rightOption='expired'
                            onDisplayModeChangedHandler={setSelectedOption}
                        />
                    </View>
                    <AwesomeFeed
                        data={selectedOption === "active" ? pollData : closedPollData}
                        onRefresh={() => {}}
                        refreshing={false}
                        renderItem={(item) => (
                            <AwesomeVote
                                key={item?.id ?? item}
                                id={item?.id ?? item}
                                question={item?.question}
                                options={item?.options}
                                results={item?.results}
                                timeLeft={item?.timeLeft}
                                totalVotes={item?.totalVotes}
                                isLiked={item?.isLiked ?? false}
                                //onVote={(option) => handleVote(item?.id, option)}
                                createdByUser={item.createdByUser}
                                //onDeletePoll={() => handleDeletePoll(item.id)}
                            />
                        )}
                    />
                </View>
            </SafeAreaView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    //Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <Text>TEST TEST</Text>
            </Modal>
        </View>
    );
};

export default MyUserProfileView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: "100%",
    },
    contentWrapper: {
        padding: 15,
        height: '100%',
    },
    safeArea: {
        backgroundColor: Colors.white,
    },
    row: {
        flexDirection: 'row'
    },
    bottomMargin20: {
        marginBottom: 20
    },
    userContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    avatar: {
        height: 46,
        width: 46,
        marginRight: 8,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
    },
    userSubContainer: {
        justifyContent: 'flex-end',
    },
    font14: {
        fontSize: 14,
    },
    usernameBold: {
        fontWeight: "bold"
    },
    fontFamily: {
        fontFamily: 'arial',
    },
    greyTextStyle: {
        color: Colors.grey,
    },
    followButton: {
        height: 30,
        width: 70,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: "center"
    },
    followButtonText: {
        color: Colors.white,
        fontSize: 14
    },
    followersContainer: {
        //borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#888',
        justifyContent: 'space-between',
        //paddingTop: 5,
        paddingBottom: 5,
        //height: 50,
        //marginBottom:  20
    },
    followersLeftSubContainer: {
        //borderRightWidth: 1,
        width: '23%',
        //borderColor: Colors.grey,
        alignItems: 'center',
        //backgroundColor: Colors.green
    },
    followersCenterSubContainer: {
        //borderRightWidth: 1,
        width: '23%',
        //borderColor: Colors.grey,
        alignItems: 'center'
    },
    followersRightSubContainer: {
        //borderRightWidth: 1,
        width: '23%',
        //borderColor: Colors.grey,
        alignItems: 'center'
    },
    followersText: {
        color: Colors.grey
    },
    visible: {
        display: 'flex'
    },
    invisible: {
        display: 'none'
    },
});