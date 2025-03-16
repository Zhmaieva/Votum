import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, TouchableWithoutFeedback } from "react-native";
import { Colors } from '../../utils/colorUtils';
import { Ionicons } from '@expo/vector-icons';
import ReportPoll from "./AwesomeReportPoll";
import { onShare } from "../../shared/common";
import AwesomeLikeButton from "./AwesomeLikeButton";

const AwesomeVote = ({
                         question = "No question provided",
                         options = [],
                         results = {},
                         timeLeft = "N/A",
                         totalVotes = 0,
                         onVote,
                         createdByUser = false, // Flag to check if the current user created the poll
                         onDeletePoll // Function to handle poll deletion
                     }) => {
    const [selected, setSelected] = useState(null);
    const [animation] = useState(new Animated.Value(0));
    const [modalVisible, setModalVisible] = useState(false);
    const [isReportVisible, setIsReportVisible] = useState(true);

    useEffect(() => {
        Animated.timing(animation, {
            toValue: selected ? 1 : 0,
            duration: 600, // Updated duration
            useNativeDriver: false,
        }).start();
    }, [selected]);

    const handleVote = (option) => {
        setSelected(option);
        if (onVote) {
            onVote(option);
        }
    };

    const handleReportSubmit = (reason) => {
        console.log(`Poll reported for: ${reason}`);
        setIsReportVisible(false);
    };

    return (
        <View>
            <View style={[styles.row, styles.bottomMargin10]}>
                <Text style={[styles.qTextStyle, styles.fontFamily]}>Q: </Text>
                <Text style={[styles.title, styles.fontFamily, styles.blackTextStyle]}>
                    {question}
                </Text>
            </View>
            <View style={styles.votingFrame}>
                <View style={[styles.controlSignsContainer, styles.row]}>
                    {!createdByUser && ( // Show report button only for non-creators
                        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconContainer}>
                            {isReportVisible && (
                                <ReportPoll
                                    pollId={1}
                                    onReportSubmit={handleReportSubmit}
                                    onCancel={() => setIsReportVisible(false)}
                                />
                            )}
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.iconContainer} onPress={onShare}>
                        <Ionicons name="share-outline" size={26} color={Colors.grey} />
                    </TouchableOpacity>
                    <View style={styles.iconContainer}>
                        <AwesomeLikeButton />
                    </View>
                    {createdByUser && ( // Show delete button only for the poll creator
                        <TouchableOpacity style={styles.deleteButton} onPress={onDeletePoll}>
                            <Ionicons name="trash-outline" size={26} color={Colors.grey} />
                        </TouchableOpacity>
                    )}
                </View>
                {!selected ? (
                    options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={styles.button}
                            onPress={() => handleVote(option)}
                        >
                            <Text style={[styles.buttonText, styles.fontFamily]}>{option}</Text>
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
                                        style={[
                                            styles.resultBar,
                                            {
                                                width: animatedWidth,
                                                backgroundColor: selected === option ? Colors.green : Colors.grey,
                                            },
                                        ]}
                                    />
                                </View>
                                <View style={styles.resultsNumberContainer}>
                                    <Text style={styles.buttonText}>{results[option] || 0}%</Text>
                                </View>
                            </View>
                        );
                    })
                )}
                <View style={[styles.countStyle, styles.row]}>
                    <Text style={[styles.greyTextStyle, styles.fontFamily]}>
                        {timeLeft === "Expired" ? "Expired" : `Ends in ${timeLeft}`}
                    </Text>
                    <Text style={[styles.greyTextStyle, styles.fontFamily]}>{totalVotes} voted</Text>
                </View>
            </View>
            {/* Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text>test</Text>
                            {isReportVisible && (
                                <ReportPoll
                                    pollId={1}
                                    onReportSubmit={handleReportSubmit}
                                    onCancel={() => setIsReportVisible(false)}
                                />
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default AwesomeVote;

const styles = StyleSheet.create({
    title: {
        fontWeight: '500',
        fontSize: 18
    },
    votingFrame: {
        borderWidth: 1,
        borderColor: Colors.grey,
        backgroundColor: Colors.white,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
        padding: 14,
        marginRight: 3
    },
    button: {
        backgroundColor: Colors.white,
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colors.grey,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonText: {
        color: Colors.grey,
        fontSize: 16,
        marginLeft: 10
    },
    countStyle: {
        justifyContent: 'space-between'
    },
    greyTextStyle: {
        color: Colors.grey
    },
    blackTextStyle: {
        color: Colors.grey
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
    fontFamily: {
        fontFamily: 'arial'
    },
    controlSignsContainer: {
        justifyContent: 'flex-end',
        marginBottom: 10
    },
    iconContainer: {
        marginLeft: 8
    },
    deleteButton: {
        marginLeft: 12,
        padding: 5
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: Colors.white,
        borderRadius: 10,
        alignItems: 'center'
    },
    resultBar: {
        height: 40,
        width: '100%',
        marginBottom: 10,
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
    }
});
