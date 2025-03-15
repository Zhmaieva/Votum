import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import { Colors } from '../../utils/colorUtils'
import AwesomeButton, { Color } from "./AwesomeButton";

const AwesomeUserHeader = ({userData}) => {
    const [user, setUser] = useState(userData);

    if (userData && userData !== user)
        setUser(userData)

    if (!user) return <Text>Loading...</Text>;

    return (
        <View style={[styles.row, styles.bottomMargin18, styles.userContainer]}>
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Image source={{ uri: user.image }} style={styles.avatar} />
                </View>
                <View style={styles.userSubContainer}>
                    <Text style={[styles.font14, styles.userNameBold, styles.fontFamily]}>{user.userName}</Text>
                    <Text style={[styles.font14, styles.greyTextStyle, styles.fontFamily]}>
                        {user.followersNumber} followers
                    </Text>
                </View>
            </View>
            <AwesomeButton color={Color.BLACK} text="Follow" changedText="Unfollow" />
        </View>
    );
};

export default AwesomeUserHeader;

const styles = StyleSheet.create({
    greyTextStyle: {
        color: Colors.grey,
    },
    row: {
        flexDirection: 'row'
    },
    bottomMargin18: {
        marginBottom: 18
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
        fontWeight: "bold"
    },
    fontFamily: {
        fontFamily: 'arial',
    },
    followButton: {
        height: 40,
        width: 65,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: "center"
    },
    followButtonText: {
        color: Colors.white,
        fontSize: 14
    },
    userContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    }
});
