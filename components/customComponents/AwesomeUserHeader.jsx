import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import { Colors } from '../../utils/colorUtils'

const AwesomeUserHeader = () => {

    return (
        <View style={[styles.row, styles.bottomMargin20, styles.userContainer]}>
            <View style={styles.row}>
                <View style={styles.avatar}>
                    <Image source={require('../../assets/images/emil.jpg')} style={styles.avatar}/>
                </View>
                <View style={styles.userSubContainer}>
                    <Text style={[styles.font14, styles.userNameBold, styles.fontFamily]}>Emil Ovechko</Text>
                    <Text style={[styles.font14, styles.greyTextStyle, styles.fontFamily]}>15K followers</Text>
                </View>
            </View>
            <View style={styles.followButton}>
                <Text style={styles.followButtonText}>follow</Text>
            </View>
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
    bottomMargin20: {
        marginBottom: 20
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
    userContainer: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    }
});