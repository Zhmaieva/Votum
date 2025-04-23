import React, {useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Pressable
} from "react-native";
import { Colors } from '../../utils/colorUtils';
import { Ionicons } from '@expo/vector-icons';
import ReportPoll from "./AwesomeReportPoll";
import {globalEventEmitter, onShare} from "../../shared/common";
import AwesomeLikeButton from "./AwesomeLikeButton";
import { AwesomeModal } from './AwesomeModal'
import {voteOnPoll} from "../../shared/api/apiClient";

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
                         timeLeft = 0,
                         onVote,
                         isLiked = false,
                         createdByUser = false,
                         onDeletePoll,
                     }) => {
    const [optionsData, setOptionsData] = useState(options);
    const [selected, setSelected] = useState(options?.filter(x => x.voted)[0]?.id ?? null);
    const [animation, setAnimation] = useState(new Animated.Value(0));
    const [modalVisible, setModalVisible] = useState(false);
    const [isReportVisible, setIsReportVisible] = useState(true);
    const [remainingTime, setRemainingTime] = useState(timeLeft);
    const [pollExpired, setPollExpired] = useState(timeLeft <= 0);
    const percentMap = useRef(null);
    const prevPercentMap = useRef(null);

    useEffect(() => {
        if (selected || pollExpired || createdByUser) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 600,
                useNativeDriver: false,
            }).start();
        }
    }, [selected, pollExpired, createdByUser]);

    useEffect(() => {
        refreshOptions(options);
    }, [options]);

    const refreshOptions = (newOptions) => {
        let optionsMapped = [];
        setOptionsData(prevOptions =>
            {
                optionsMapped = prevOptions.map(o => {
                    const updated = newOptions.find(u => u.id === o.id);
                    return updated ? { ...o, votesCount: updated.votesCount } : o;
                });
                return optionsMapped;
            }
        );

        const totalVotes = optionsMapped.reduce((sum, o) => sum + (o.votesCount || 0), 0);

        // Calculate raw percentages
        let percentages = optionsMapped.map((o) => ({
            id: o.id,
            percent: totalVotes ? (o.votesCount || 0) / totalVotes * 100 : 0
        }));

        // Round each, track total, and find the index of the max
        let roundedTotal = 0;
        let maxIndex = 0;

        percentages = percentages.map((p, i) => {
            const rounded = Math.round(p.percent);
            if (p.percent > percentages[maxIndex].percent) maxIndex = i;
            roundedTotal += rounded;
            return { ...p, rounded };
        });

        // Fix rounding error by adjusting the highest
        const roundingError = 100 - roundedTotal;
        if (percentages[maxIndex]?.rounded > 0)
            percentages[maxIndex].rounded += roundingError;

        // Create a map for quick lookup by id
        prevPercentMap.current = percentMap.current;
        percentMap.current = new Map(percentages.map(p => [p.id, p.rounded]));

        const hasChange =
            !percentMap.current ||
            newOptions.some((opt) => {
                const prev = prevPercentMap.current?.get(opt.id);
                const curr = percentMap.current.get(opt.id);
                return prev !== curr;
            });

        if (!hasChange) {
            return;
        }

        if (prevPercentMap.current)
            animation.setValue(0);

        Animated.timing(animation, {
            toValue: 1,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }

    const handleVote = async (optionId) => {
        const newOptions = optionsData.map(opt =>
            opt.id === optionId ? {
                ...opt,
                votesCount: opt.votesCount + 1,
                voted: true,
            } : opt);

        refreshOptions(newOptions);

        setSelected(optionId);

        const result = await voteOnPoll(optionId);

        if (result.success) {
            console.log('Voted successfully!');
        } else {
            console.error('Vote failed:', result.error);
        }

        setTimeout(() => {
            globalEventEmitter.emit('vote', { pollId: id, options: newOptions});
        },500);

        if (onVote) {
            onVote(optionId);
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
                            <TouchableOpacity style={styles.iconContainer} onPress={() => onShare(id)}>
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
                            <TouchableOpacity style={styles.iconContainer} onPress={() => onShare(id)}>
                                <Ionicons name="share-outline" size={28} color={Colors.black} />
                            </TouchableOpacity>
                            <View style={styles.iconContainer}>
                                <AwesomeLikeButton pollId={id} isLikedParam={isLiked} />
                            </View>
                        </>
                    )}
                </View>
                {!selected && !pollExpired && !createdByUser ? (
                    optionsData?.map((option) => (
                        <TouchableOpacity key={option.id} style={styles.button} onPress={() => handleVote(option.id)}>
                            <Text style={[styles.buttonText, styles.fontFamilyStyle]} numberOfLines={2} ellipsizeMode="tail">{option.text}</Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    optionsData?.map((option) => {
                        let percent = percentMap.current?.get(option.id) || 1;
                        let prevPercent = prevPercentMap.current?.get(option.id) || 1;

                        if (percent < 1) {
                            percent = 1;
                        }

                        if (prevPercent < 1) {
                            prevPercent = 1;
                        }
                        const animatedWidth = animation.interpolate({
                            inputRange: [0.01, 1],
                            outputRange: [`${prevPercent}%`, `${percent}%`],
                        });

                        return (
                            <View key={option.id} style={styles.buttonContainer}>
                                <View style={styles.resultBarContainer}>
                                    <Animated.View
                                        style={[styles.resultBar, {
                                            width: animatedWidth,
                                            backgroundColor: selected === option.id ? Colors.green : Colors.lightGrey,
                                        }]}
                                    />
                                    <View style={styles.answerStyle}>
                                        <Text style={[styles.answerTextStyle, {
                                            color: Colors.black,
                                            fontWeight: selected === option.id ? "600" : "400"
                                        }]}>
                                            {option.text}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.resultsNumberContainer}>
                                    <Text style={[styles.buttonText, styles.fontFamilyStyle, {
                                        color: Colors.black,
                                        fontWeight: selected === option.id ? "600" : "400"
                                    }]}>{percentMap.current?.get(option.id) || 0}%</Text>
                                </View>
                            </View>
                        );
                    })
                )}
                <View style={[styles.countStyle, styles.row]}>
                    <Text style={[styles.greyTextStyle, styles.fontFamilyStyle]}>{pollExpired ? "Expired" : `Ends in ${formatTimeLeft(remainingTime)}`}</Text>
                    <Text style={[styles.greyTextStyle, styles.fontFamilyStyle]}>{formatFollowers(optionsData?.reduce((sum, option) => sum + option.votesCount, 0))} voted</Text>
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
        padding: 14,
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
        marginLeft: 10
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