import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView} from 'react-native';
import {useRoute, useNavigation, useFocusEffect} from '@react-navigation/native';
import { Colors } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import {createPoll, durationMap, fetchMyProfile} from '../../shared/api/apiClient';
import {getDataService, onShare} from '../../shared/common';
import AwesomeUserHeader from '../customComponents/AwesomeUserHeader';
import {Ionicons} from "@expo/vector-icons";

const PreviewPollView = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { question, options, selectedDuration } = route.params;

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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {user && (
                    <View style={styles.headerContainer}>
                        <AwesomeUserHeader userData={user} loggedInUserId={user?.userId} isInsideCard={true} />
                    </View>
                )}
                <View style={[styles.questionContainer, styles.row]}>
                    <Text style={styles.qTextStyle}>Q: </Text>
                    <Text style={styles.questionText}>{question}</Text>
                </View>
                <View style={styles.pollBox}>
                    <View style={[styles.row, styles.alignToTheRight]}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="trash-outline" size={28} color={Colors.black} />
                        </View>
                        <View style={styles.iconContainer}>
                            <Ionicons name="share-outline" size={28} color={Colors.black} />
                        </View>
                        <View style={styles.iconContainer}>
                            <Ionicons name="heart-outline" size={28} color={Colors.black} />
                        </View>
                    </View>
                    {options.map((option, index) => (
                        <View key={index} style={styles.optionRow}>
                            <Text style={styles.optionText}>{option.text}</Text>
                        </View>
                    ))}
                    <View style={[styles.row, styles.alignment]}>
                        <Text style={styles.endsIn}>Ends in {selectedDuration}</Text>
                        <Text style={styles.voted}>0 voted</Text>
                    </View>
                </View>
            </View>
            <View style={styles.container}>
                <View style={styles.margin10}>
                    <AwesomeButton
                        color={Color.BLACK}
                        text="Publish"
                        additionalFunc={async () => {
                            await createPoll(question, options.map(o => o.text), selectedDuration);
                            navigation.goBack();
                        }}
                    />
                </View>
                <AwesomeButton
                    color={Color.WHITE}
                    text="Go back and edit"
                    additionalFunc={() => navigation.goBack()}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
        justifyContent: 'space-between',
    },
    container: {
        padding: 20,
    },
    headerContainer: {
        marginBottom: 20
    },
    row: {
        flexDirection: 'row',
    },
    alignToTheRight: {
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    alignment: {
        justifyContent: 'space-between'
    },
    questionContainer: {
        marginBottom: 15,
    },
    qTextStyle: {
        color: Colors.green,
        fontSize: 18,
        fontWeight: 'bold'
    },
    questionText: {
        fontSize: 18,
        color: Colors.black,
        fontWeight: 'bold',
    },
    pollBox: {
        borderWidth: 1,
        borderColor: Colors.black,
        padding: 14,
        marginBottom: 20,
        backgroundColor: Colors.white,
    },
    optionRow: {
        borderWidth: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        padding: 11,
        marginBottom: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
    },
    optionText: {
        color: Colors.black,
        fontSize: 14
    },
    endsIn: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.grey
    },
    voted: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.grey
    },
    editButton: {
        height: 40,
        backgroundColor: Colors.white,
        width: '49%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.grey
    },
    editButtonText: {
        color: Colors.grey,
        fontWeight: 'bold'
    },
    publishButton: {
        width: '49%'
    },
    margin10: {
        marginBottom: 15
    },
    iconContainer: {
        marginLeft: 8
    },
});

export default PreviewPollView;