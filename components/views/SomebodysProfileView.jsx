import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Modal } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeVote from "../customComponents/AwesomeVote";
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeSwitcher from "../customComponents/AwesomeSwitcher";
import AwesomeFeed from "../customComponents/AwesomeFeed";
import { fetchUserProfile } from "../../shared/api/apiClient";
import { getDataService } from "../../shared/common";
import {useNavigation, useRoute} from '@react-navigation/native';

const SomebodysProfileView = ({route}) => {

    const {userId} = route.params;

    const [selectedOption, setSelectedOption] = useState("active");
    const [modalVisible, setModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    const pollData = [ /* active polls */ ];
    const closedPollData = [ /* expired polls */ ];

    const navigation = useNavigation();

    useEffect(() => {
        const myId = getDataService().getUser()?.userId;
        setLoggedInUserId(myId);

        fetchUserProfile(userId).then(setUser);
    }, []);

    if (!user) return null;

    return (
        <View style={styles.container}>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentWrapper}>
                    <View style={styles.bottomMargin20}>
                        <AwesomeUserHeader
                            userData={user}
                            loggedInUserId={loggedInUserId}
                            isProfilePage={true}
                        />
                    </View>
                    <View style={[styles.followersContainer, styles.row]}>
                        <View style={styles.followersLeftSubContainer}>
                            <Text style={styles.followersText}>21</Text>
                            <Text style={styles.followersText}>polls</Text>
                        </View>
                        <View style={styles.followersCenterSubContainer}>
                            <Text style={styles.followersText}>15K</Text>
                            <Text style={styles.followersText}>followers</Text>
                        </View>
                        <View style={styles.followersRightSubContainer}>
                            <Text style={styles.followersText}>103</Text>
                            <Text style={styles.followersText}>following</Text>
                        </View>
                    </View>
                    <View style={styles.bottomMargin20}>
                        <AwesomeSwitcher
                            leftOption="active"
                            rightOption="expired"
                            onDisplayModeChangedHandler={setSelectedOption}
                        />
                    </View>
                    <AwesomeFeed
                        data={selectedOption === "active" ? pollData : closedPollData}
                        onRefresh={() => {}}
                        refreshing={false}
                        isUserProfileView={true}
                        renderItem={(item) => (
                            <AwesomeVote
                                timeLeft={item.timeLeft}
                                question={item.question}
                                options={item.options}
                            />
                        )}
                    />
                </View>
            </SafeAreaView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <Text>TEST TEST</Text>
            </Modal>
        </View>
    );
};

export default SomebodysProfileView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.yellow,
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