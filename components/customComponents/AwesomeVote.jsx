import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated, Modal, TouchableWithoutFeedback } from "react-native";
import { Colors } from '../../utils/colorUtils';
import { Ionicons } from '@expo/vector-icons';
import ReportPoll from "./AwesomeReportPoll";

const pollData = [
    {
        id: 1,
        question: "What is your favorite color?",
        options: ["Red", "Blue"],
        results: { Red: 20, Blue: 50, Green: 15, Yellow: 15 },
        timeLeft: "10m 30s",
        totalVotes: 1457
    }
];

const AwesomeVote = ({
                         question = "No question provided",
                         options = [],
                         results = {},
                         timeLeft = "N/A",
                         totalVotes = 0,
                         onVote
                     }) => {
    const [selected, setSelected] = useState(null);
    const [animation] = useState(new Animated.Value(0));
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (selected) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    }, [selected]);

    const handleVote = (option) => {
        setSelected(option);
        if (onVote) {
            onVote(option);
        }
    };

    const [isReportVisible, setIsReportVisible] = useState(true);

    const handleReportSubmit = (reason) => {
        console.log(`Poll ${pollData.id} reported for: ${reason}`);
        setIsReportVisible(false); // Close the modal after submission
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
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconContainer}>
                        {isReportVisible && (
                            <ReportPoll
                                pollId={pollData.id}
                                onReportSubmit={handleReportSubmit}
                                onCancel={() => setIsReportVisible(false)}
                            />
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer}>
                        <Ionicons name="share-outline" size={26} color={Colors.grey} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} >
                        <Ionicons name="heart-outline" size={26} color={Colors.grey} />
                    </TouchableOpacity>
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
                    options.map((option) => (
                        <View key={option} style={styles.buttonContainer}>
                            <Animated.View
                                style={[styles.resultBar, {
                                    width: `${results[option] || 0}%`,
                                    backgroundColor: selected === option ? Colors.green : Colors.grey,
                                    opacity: animation,
                                }]}
                            />
                            <Text style={styles.resultText}>{results[option] || 0}%</Text>
                        </View>
                    ))
                )}
                <View style={[styles.countStyle, styles.row]}>
                    <Text style={[styles.greyTextStyle, styles.fontFamily]}>Ends in {timeLeft}</Text>
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
                                    pollId={pollData.id}
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
        padding: 14
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
        fontSize: 18,
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
    modalText: {
        fontSize: 18,
        marginBottom: 20
    },
    closeButton: {
        backgroundColor: Colors.green,
        padding: 10,
        borderRadius: 5
    },
    closeButtonText: {
        color: Colors.white,
        fontSize: 16
    },

});
