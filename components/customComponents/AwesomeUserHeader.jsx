import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from "./AwesomeButton";

const formatFollowers = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};

const AwesomeUserHeader = ({ userData, loggedInUserId }) => {
    const [user, setUser] = useState(userData);

    useEffect(() => {
        if (userData && userData !== user) {
            setUser(userData);
        }
    }, [userData]);

    if (!user) return <Text>Loading...</Text>;

    const isOwnProfile = user.userId === loggedInUserId;
    const followersText = user.followersNumber === 1 ? "follower" : "followers";
    const formattedFollowers = formatFollowers(user.followersNumber);

    return (
        <View style={[styles.row, styles.bottomMargin18, styles.userContainer]}>
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Image source={{ uri: user.image }} style={styles.avatar} />
                </View>
                <View style={styles.userSubContainer}>
                    <Text style={[styles.font14, styles.userNameBold, styles.fontFamily]}>
                        {user.userName}
                    </Text>
                    {isOwnProfile ? (
                        <Text style={[styles.font14, styles.greyTextStyle, styles.fontFamily]}>
                            {user.bio}
                        </Text>
                    ) : (
                        <Text style={[styles.font14, styles.greyTextStyle, styles.fontFamily]}>
                            {formattedFollowers} {followersText}
                        </Text>
                    )}
                </View>
            </View>
            {isOwnProfile ? (
                <AwesomeButton
                    color={Color.BLACK}
                    text="Edit"
                    screenName="ProfileEditView"
                    params={{ user }}
                />
            ) : (
                <AwesomeButton color={Color.BLACK} text="Follow" changedText="Unfollow" />
            )}
        </View>
    );
};

export default AwesomeUserHeader;

const styles = StyleSheet.create({
    greyTextStyle: {
        color: Colors.grey,
    },
    row: {
        flexDirection: 'row',
    },
    bottomMargin18: {
        marginBottom: 18,
    },
    avatar: {
        height: 46,
        width: 46,
        marginRight: 8,
    },
    userSubContainer: {
        justifyContent: 'flex-end',
    },
    font14: {
        fontSize: 14,
    },
    userNameBold: {
        fontWeight: "bold",
    },
    fontFamily: {
        fontFamily: 'arial',
    },
    userContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
});
