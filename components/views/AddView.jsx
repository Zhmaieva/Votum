import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, ScrollView, Image, TextInput} from "react-native";
import { Colors } from '../../utils/colorUtils'
import { Ionicons, EvilIcons, FontAwesome } from '@expo/vector-icons';
import {Pressable} from "react-native-gesture-handler";
import AwesomeVote from "../customComponents/AwesomeVote.jsx"
import AwesomeUserHeader from "../customComponents/AwesomeUserHeader";
import AwesomeCard from "../customComponents/AwesomeCard";
import AwesomeSearch from "../customComponents/AwesomeSearch";

const AddView = () => {

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView>
                    <View style={[styles.inputQuestionStyle, styles.bottomMargin20]}>
                        <Text style={styles.descriptionTextStyle}>Question</Text>
                    </View>
                    <View style={[styles.row, styles.alignStyle, styles.bottomMargin20]}>
                        <View style={styles.inputOptionStyle}>
                            <Text style={styles.descriptionTextStyle}>Option 1</Text>
                        </View>
                        <View style={styles.alignAtTheBottom}>
                            <Ionicons name='close' size={17} color={Colors.grey} />
                        </View>
                    </View>
                    <View style={[styles.row, styles.alignStyle, styles.bottomMargin20]}>
                        <View style={styles.inputOptionStyle}>
                            <Text style={styles.descriptionTextStyle}>Option 2</Text>
                        </View>
                        <View style={styles.alignAtTheBottom}>
                            <Ionicons name='close' size={17} color={Colors.grey} />
                        </View>
                    </View>
                    <View style={[styles.row, styles.alignStyle, styles.bottomMargin20]}>
                        <View style={styles.inputOptionStyle}>
                            <Text style={styles.descriptionTextStyle}>Option 3</Text>
                        </View>
                        <View style={styles.alignAtTheBottom}>
                            <Ionicons name='close' size={17} color={Colors.grey} />
                        </View>
                    </View>
                    <View style={styles.addOptionContainer}>
                        <Text>+ Add option</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default AddView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: "100%",
        padding: 14,
    },
    contentWrapper: {
        paddingTop: 20
    },
    safeArea: {
        backgroundColor: Colors.white,
        padding: 20
    },
    searchContainer: {
        marginTop: 4
    },
    searchStyle: {
        borderColor: Colors.grey,
        borderWidth: 1,
        height: 40,
        flexGrow: 1,
        //margin: 20,
        backgroundColor: Colors.white,
    },
    searchButtonStyle: {
        height: 40,
        width: 64,
        marginLeft: 5,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: "center",
    },
    searchButtonTextStyle: {
        color: Colors.white,
        fontFamily: 'arial'
    },
    row: {
        flexDirection: 'row'
    },
    alignStyle: {
        justifyContent: 'space-between'
    },
    inputQuestionStyle: {
        height: 40,
        width: '100%',
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.grey,
        //marginBottom: 20,
        justifyContent: 'flex-end',
        paddingBottom: 5
    },
    inputOptionStyle: {
        height: 40,
        flexGrow: 1,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.grey,
        //marginBottom: 20,
        justifyContent: 'flex-end',
        paddingBottom: 5
    },
    alignAtTheBottom: {
        paddingTop: 10,
        //backgroundColor: Colors.blue,
        width: 24,
        alignItems: "flex-end"
    },
    descriptionTextStyle: {
      color: Colors.grey
    },
    addOptionContainer: {

    },













    title: {
        fontSize: 18,
    },
    votingFrame: {
        borderWidth: 1,
        borderColor: Colors.grey,
        backgroundColor: Colors.white,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
        padding: 14
    },
    button: {
        backgroundColor: Colors.white,
        height: 40,
        marginBottom: 10,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: Colors.grey,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonText: {
        color: Colors.grey,
        fontSize: 18,
        marginLeft: 10
    },
    resultBar: {
        height: "100%",
        marginLeft: 0,
        marginTop: 5,
        marginBottom: 5
    },
    resultText: {
        color: Colors.grey,
        fontSize: 14,
        marginRight: 4
    },
    buttonContainer: {
        backgroundColor: Colors.white,
        height: 40,
        width: '100%',
        marginBottom: 10,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: Colors.grey,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    dropdownStyle: {
        borderWidth: 1,
        borderColor: Colors.black,
        height: 40,
        marginBottom: 15,
        backgroundColor: Colors.white,
    },
    optStyle: {
        backgroundColor: Colors.white
    },
    placeholderTextStyle: {
        marginLeft: 5
    },
    containerDropdown: {
        backgroundColor: Colors.white
    },
    countStyle: {
        justifyContent: 'space-between',
    },
    greyTextStyle: {
        color: Colors.grey,
    },
    qTextStyle: {
        color: Colors.green,
        fontSize: 18,
        fontWeight: 'bold'
    },
    bottomMargin10: {
        marginBottom: 10
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
    controlSignsContainer: {
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    iconContainer: {
        marginLeft: 8
    },
    topContainer: {
        height: 50,
        borderBottomWidth: 1,
        borderColor: "#777"
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