import React, { useState, useEffect } from "react";
import {View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, ScrollView, Image} from "react-native";
import { Colors } from '../../utils/colorUtils'
import { Ionicons, EvilIcons, FontAwesome } from '@expo/vector-icons';

const VotingView = () => {
    const [selected, setSelected] = useState(null);
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (selected) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    }, [selected]);

    const results = {
        optionA: 10,
        optionB: 50,
        optionC: 15,
        optionD: 25,
    };

    const data = [
        { label: 'Telegram', value: 'Telegram' },
        { label: 'Whatsapp', value: 'Whatsapp' },
        { label: 'Facebook', value: 'Facebook' },
        { label: 'Instagram', value: 'Instagram' },
    ];

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView>
                    <View style={styles.contentWrapper}>
                        <View style={[styles.row, styles.bottomMargin20]}>
                            <View style={styles.avatar}>
                                <Image source={require('../../assets/images/emil.jpg')} style={styles.avatar}/>
                            </View>
                            <View style={styles.userSubContainer}>
                                <Text style={[styles.font14, styles.userNameBold, styles.fontFamily]}>Emil Ovechko</Text>
                                <Text style={[styles.font14, styles.greyTextStyle, styles.fontFamily]}>Took part in 105 polls</Text>
                            </View>
                            <View>
                                <Text></Text>
                            </View>
                        </View>
                        <View style={[styles.row, styles.bottomMargin10]}>
                            <Text style={[styles.qTextStyle, styles.fontFamily]}>Q: </Text>
                            <Text style={[styles.title, styles.fontFamily, styles.greyTextStyle]}>What is your favorite?</Text>
                        </View>
                        <View style={styles.votingFrame}>
                            <View style={[styles.controlSignsContainer, styles.row]}>
                                <View style={styles.iconContainer}><Ionicons name='warning-outline' size='26' color={Colors.grey}/></View>
                                <View style={styles.iconContainer}><Ionicons name='share-outline' size='26' color={Colors.grey}/></View>
                                <View style={styles.iconContainer}><Ionicons name='bookmark-outline' size='26' color={Colors.grey}/></View>
                                <View style={styles.iconContainer}><Ionicons name='heart-outline' size='26' color={Colors.grey}/></View>
                            </View>
                            {!selected ? (
                                Object.keys(results).map((option) => (
                                    <TouchableOpacity
                                        key={option}
                                        style={styles.button}
                                        onPress={() => setSelected(option)}
                                    >
                                        <Text style={[styles.buttonText, styles.fontFamily]}>{option.replace("option", "Option ")}</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                Object.keys(results).map((option) => (
                                    <View key={option} style={styles.buttonContainer}>
                                        <Animated.View
                                            style={[styles.resultBar, {
                                                width: `${results[option]}%`,
                                                backgroundColor: selected === option ? Colors.green : Colors.grey,
                                                opacity: animation,
                                            }]}
                                        />
                                        <Text style={styles.resultText}>{results[option]}%</Text>
                                    </View>
                                ))
                            )}
                            <View style={[styles.countStyle, styles.row]}>
                                <Text style={[styles.greyTextStyle, styles.fontFamily]}>Ends in 10m 30s</Text>
                                <Text style={[styles.greyTextStyle, styles.fontFamily]}>1 457 voted</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default VotingView;

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
    row: {
        flexDirection: 'row'
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
    }
});
