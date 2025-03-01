import React from "react";
import {View, Text, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import { Colors } from '../../utils/colorUtils'
import AwesomeVote from "../customComponents/AwesomeVote";
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";

const UserProfileView = () => {

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentWrapper}>
                    <AwesomeUserHeader />
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
                    <ScrollView>
                        <AwesomeVote />
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default UserProfileView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: "100%",
    },
    contentWrapper: {
        padding: 20,
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
    userNameBold: {
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
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#888',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 10,
        marginBottom:  20
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
    }
});