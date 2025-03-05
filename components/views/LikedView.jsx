import React from "react";
import {View, StyleSheet, SafeAreaView, ScrollView} from "react-native";
import { Colors } from '../../utils/colorUtils'
import AwesomeCard from "../customComponents/AwesomeCard";

const LikedView = () => {

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.contentWrapper}>
                        <AwesomeCard />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default LikedView;

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
});