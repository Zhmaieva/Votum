import React, {useState} from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import {fetchMyProfile} from "../../shared/api/apiClient";
import {useFocusEffect} from "@react-navigation/native";

const FollowingView = () => {

    const [user, setUser] = useState(null);

    if (!user)
        fetchMyProfile().then(res => {
            setUser(res);
        })

    useFocusEffect(
        React.useCallback(() => {
            fetchMyProfile().then(res => {
                setUser(res);
            });
        }, [])
    );

    return (
        <View style={styles.container}>
            <AwesomeUserHeader userData={user} loggedInUserId={"test"}/>
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