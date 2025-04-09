import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Modal,
    TouchableWithoutFeedback,
    Pressable
} from "react-native";
import { Colors } from '../../utils/colorUtils';
import { Ionicons } from '@expo/vector-icons';
import ReportPoll from "./AwesomeReportPoll";
import { onShare } from "../../shared/common";
import AwesomeLikeButton from "./AwesomeLikeButton";
import { AwesomeModal } from './AwesomeModal'

const formatFollowers = (num) => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num;
};

const formatTimeLeft = (millisecondsLeft) => {
    if (millisecondsLeft <= 0) return "Expired";

    const secondsLeft = Math.floor(millisecondsLeft / 1000);
    const days = Math.floor(secondsLeft / (60 * 60 * 24));
    const hours = Math.floor((secondsLeft % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((secondsLeft % (60 * 60)) / 60);
    const seconds = secondsLeft % 60;

    if (secondsLeft < 60) {
        return `${seconds} second${seconds !== 1 ? "s" : ""}`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""}`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""}`;
    } else {
        return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    }
};


const AwesomeVote = ({
                         id = "",
                         question = "No question provided",
                         options = [],
                         results = {},
                         timeLeft = 0,
                         totalVotes = 0,
                         onVote,
                         isLiked = false,
                         createdByUser = false,
                         onDeletePoll
                     }) => {
    const [selected, setSelected] = useState(null);
    const [animation] = useState(new Animated.Value(0));
    const [modalVisible, setModalVisible] = useState(false);
    const [isReportVisible, setIsReportVisible] = useState(true);
    const [remainingTime, setRemainingTime] = useState(timeLeft);
    const [pollExpired, setPollExpired] = useState(timeLeft <= 0);

    useEffect(() => {
        if (selected || pollExpired || createdByUser) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 600,
                useNativeDriver: false,
            }).start();
        }
    }, [selected, pollExpired, createdByUser]);

    const handleVote = (option) => {
        setSelected(option);
        if (onVote) {
            onVote(option);
        }
    };

    useEffect(() => {
        if (remainingTime <= 0) {
            setPollExpired(true);
            return;
        }

        let interval = setInterval(() => {
            setRemainingTime((prev) => {
                const newTime = prev - 1000;
                if (newTime <= 0) {
                    setPollExpired(true);
                    clearInterval(interval);
                }
                return newTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [remainingTime]);

    return (
        <View style={styles.container}>
            <View style={[styles.row, styles.questionContainer]}>
                <Text style={[styles.qTextStyle, styles.fontFamilyStyle]}>Q: </Text>
                <Text style={[styles.title, styles.fontFamilyStyle]}>{question}</Text>
            </View>
            <View style={styles.votingFrame}>
                <View style={[styles.controlSignsContainer, styles.row]}>
                    {createdByUser ? (
                        <>
                            <Pressable style={styles.iconContainer} onPress={()=>setModalVisible(true)}>
                                <Ionicons name="trash-outline" size={26} color={Colors.black} />
                            </Pressable>
                            <TouchableOpacity style={styles.iconContainer} onPress={onShare}>
                                <Ionicons name="share-outline" size={28} color={Colors.black} />
                            </TouchableOpacity>
                            <View style={styles.iconContainer}>
                                <AwesomeLikeButton pollId={id} isLikedParam={isLiked} />
                            </View>
                        </>
                    ) : (
                        <>
                            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconContainer}>
                                {isReportVisible && (
                                    <ReportPoll
                                        pollId={1}
                                        onReportSubmit={(reason) => setIsReportVisible(false)}
                                        onCancel={() => setIsReportVisible(false)}
                                    />
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconContainer} onPress={onShare}>
                                <Ionicons name="share-outline" size={28} color={Colors.black} />
                            </TouchableOpacity>
                            <View style={styles.iconContainer}>
                                <AwesomeLikeButton pollId={id} isLikedParam={isLiked} />
                            </View>
                        </>
                    )}
                </View>
                {!selected && !pollExpired && !createdByUser ? (
                    options.map((option) => (
                        <TouchableOpacity key={option} style={styles.button} onPress={() => handleVote(option)}>
                            <Text style={[styles.buttonText, styles.fontFamilyStyle]} numberOfLines={2} ellipsizeMode="tail">{option}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    options.map((option) => {
                        const animatedWidth = animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: ["0%", `${results[option] || 0}%`],
                        });

                        return (
                            <View key={option} style={styles.buttonContainer}>
                                <View style={styles.resultBarContainer}>
                                    <Animated.View
                                        style={[styles.resultBar, {
                                            width: animatedWidth,
                                            backgroundColor: selected === option ? Colors.green : '#d5d6d5',
                                        }]}
                                    />
                                    <View style={styles.answerStyle}>
                                        <Text style={[styles.answerTextStyle, {
                                            color: Colors.black,
                                            fontWeight: selected === option ? "600" : "400"
                                        }]}>
                                            {option}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.resultsNumberContainer}>
                                    <Text style={[styles.buttonText, styles.fontFamilyStyle, {
                                        color: Colors.black,
                                        fontWeight: selected === option ? "600" : "400"
                                    }]}>{results[option] || 0}%</Text>
                                </View>
                            </View>
                        );
                    })
                )}
                <View style={[styles.countStyle, styles.row]}>
                    <Text style={[styles.greyTextStyle, styles.fontFamilyStyle]}>{pollExpired ? "Expired" : `Ends in ${formatTimeLeft(remainingTime)}`}</Text>
                    <Text style={[styles.greyTextStyle, styles.fontFamilyStyle]}>{formatFollowers(totalVotes)} voted</Text>
                </View>
            </View>
            <AwesomeModal
                visible={modalVisible}
                text="Are you sure you want to delete this poll?"
                buttonText="Yes, delete"
                onPress={() => {
                    if (onDeletePoll) {
                        onDeletePoll();
                    }
                    setModalVisible(false);
                }}
                onBackPress={() => setModalVisible(false)}
            />
        </View>
    );
};

export default AwesomeVote;

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    title: {
        fontWeight: '500',
        fontSize: 18
    },
    votingFrame: {
        borderWidth: 1,
        borderColor: Colors.black,
        backgroundColor: Colors.white,
        /*shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,*/
        padding: 14,
        //marginRight: 3
    },
    button: {
        backgroundColor: Colors.white,
        height: 40,
        marginBottom: 11,
        borderWidth: 1,
        borderColor: Colors.black,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingRight: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
    },
    buttonText: {
        color: Colors.black,
        fontSize: 16,
        marginLeft: 10
    },
    countStyle: {
        justifyContent: 'space-between'
    },
    greyTextStyle: {
        color: Colors.black
    },
    row: {
        flexDirection: 'row'
    },
    bottomMargin10: {
        marginBottom: 10
    },
    fontFamilyStyle: {
        fontFamily: 'Arial'
    },
    controlSignsContainer: {
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    iconContainer: {
        marginLeft: 8
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: Colors.white,
        //borderRadius: 10,
        alignItems: 'center'
    },
    resultBar: {
        height: 40,
        marginBottom: 11,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    resultsNumberContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
        minWidth: 40,
    },
    resultBarContainer: {
        flex: 1,
    },
    qTextStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
    },
    answerStyle: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
    },
    answerTextStyle: {
        color: Colors.black,
        fontSize: 16,
        marginLeft: 10
    },
    rightPartBar: {
        height: 40,
        position: 'absolute'
    },
    questionContainer: {
        width: '100%',
        paddingRight: 20,
        marginBottom: 10
    }
});