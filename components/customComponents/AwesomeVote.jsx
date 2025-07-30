import React, {useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Pressable,
    Image
} from "react-native";
import { Colors, Fonts } from '../../utils/colorUtils';
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

const generateRandomId = () => {
    const random = Math.floor(Math.random() * 1e9); // up to 9 digits
    const timestamp = Date.now(); // current time in ms
    return `${random}_${timestamp}`;
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
    const [voteCardId] = useState(generateRandomId());
    const [animation, setAnimation] = useState(new Animated.Value(0));
    const [modalVisible, setModalVisible] = useState(false);
    const [isReportVisible, setIsReportVisible] = useState(true);
    const [remainingTime, setRemainingTime] = useState(timeLeft);
    const [pollExpired, setPollExpired] = useState(timeLeft <= 0);
    const percentMap = useRef(null);
    const getBarColor = (percent) => {
        if (percent >= 76) return '#93a548';
        if (percent >= 51) return '#93a548';
        if (percent >= 26) return '#b5c478';
        return '#dfe5bd';
    };

    useEffect(() => {
        if (selected) {
            Animated.timing(animation, {
                toValue: 1,
                duration: 600,
                useNativeDriver: false,
            }).start();
        }
    }, [selected]);

    useEffect(() => {
        refreshOptions(options);
    }, [options]);

    // At the top of component:
    const animationMap = useRef(new Map()); // key: option.id, value: Animated.Value

    // In your refreshOptions function:
    const refreshOptions = (newOptions) => {
        const totalVotes = newOptions.reduce((sum, o) => sum + o.votesCount, 0);

        let percentages = newOptions.map((o) => ({
            id: o.id,
            percent: totalVotes ? (o.votesCount || 0) / totalVotes * 100 : 0
        }));

        let roundedTotal = 0;
        let maxIndex = 0;

        percentages = percentages.map((p, i) => {
            const rounded = Math.round(p.percent);
            if (p.percent > percentages[maxIndex].percent) maxIndex = i;
            roundedTotal += rounded;
            return { ...p, rounded };
        });

        const roundingError = 100 - roundedTotal;
        if (percentages[maxIndex]?.rounded > 0)
            percentages[maxIndex].rounded += roundingError;

        percentMap.current = new Map(percentages.map(p => [p.id, p.rounded]));

        newOptions.forEach((opt) => {
            const percent = totalVotes ? (opt.votesCount / totalVotes) * 100 : 0;
            const rounded = Math.round(percent);

            // Get or create Animated.Value
            let anim = animationMap.current.get(opt.id);
            if (!anim) {
                anim = new Animated.Value(rounded);
                animationMap.current.set(opt.id, anim);
            }

            Animated.timing(anim, {
                toValue: rounded,
                duration: 500,
                useNativeDriver: false,
            }).start();
        });

        setOptionsData(newOptions.map(opt => ({ ...opt }))); // clone to trigger re-render
    };

    const handleVote = async (optionId) => {
        const newOptions = optionsData.map(opt =>
            opt.id === optionId ? {
                ...opt,
                votesCount: opt.votesCount + 1,
                voted: true,
            } : opt);

        refreshOptions(options, { forceAnimation: true });
        setSelected(optionId);

        const result = await voteOnPoll(optionId);

        if (result.success) {
            console.log('Voted successfully!');
        } else {
            console.error('Vote failed:', result.error);
        }

        globalEventEmitter.emit('vote', { pollId: id, options: newOptions, optionId, cardId: voteCardId});

        if (onVote) {
            onVote(optionId);
        }
    };

    useEffect(() => {
        const onVote = ({ pollId, options, optionId, cardId }) => {
            if (pollId !== id || cardId === voteCardId) return;

            refreshOptions(options, { forceAnimation: true });

            setSelected(optionId);
            onVote?.(optionId);
        };

        globalEventEmitter.on('vote', onVote);
        return () => globalEventEmitter.off('vote', onVote); // cleanup
    }, [id, voteCardId]);

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
                <Text style={[styles.qTextStyle, styles.fontFamilyStyleBold]}>Q: </Text>
                <Text style={[styles.title, styles.fontFamilyStyleBold]}>{question}</Text>
            </View>
            <View style={styles.votingFrame}>
                <View style={[styles.controlSignsContainer, styles.row]}>
                    {createdByUser ? (
                        <>
                            <Pressable style={styles.iconContainer} onPress={()=>setModalVisible(true)}>
                                <Image
                                    source={require('../../assets/images/deleteBlack.png')}
                                    style={{ width: 27, height: 27 }}
                                    resizeMode="contain"
                                />
                            </Pressable>
                            <TouchableOpacity style={styles.iconContainer} onPress={() => onShare(id)}>
                                <Image
                                    source={require('../../assets/images/shareBlack.png')}
                                    style={{ width: 26, height: 26 }}
                                    resizeMode="contain"
                                />
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
                                <Image
                                    source={require('../../assets/images/shareBlack.png')}
                                    style={{ width: 28, height: 28 }}
                                    resizeMode="contain"
                                />
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
                        return (
                            <View key={option.id} style={styles.buttonContainer}>
                                <View style={styles.resultBarContainer}>
                                    <Animated.View
                                        style={[
                                            styles.resultBar,
                                            {
                                                width: animationMap.current.get(option.id)?.interpolate({
                                                    inputRange: [0, 100],
                                                    outputRange: ['0%', '100%'],
                                                }) || '0%',
                                                backgroundColor: getBarColor(percentMap.current?.get(option.id) || 1),
                                            },
                                        ]}
                                    />
                                    <View style={styles.answerStyle}>
                                        <View style={styles.answerRow}>
                                            {selected === option.id && <View style={styles.selectionDot} />}
                                            <Text
                                                style={[
                                                    styles.answerTextStyle,
                                                    styles.fontFamilyStyle,
                                                    {
                                                        color: Colors.black,
                                                        fontFamily:
                                                            selected === option.id ? Fonts.medium : Fonts.regular,
                                                    },
                                                ]}
                                            >
                                                {option.text}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.resultsNumberContainer}>
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            styles.fontFamilyStyle,
                                            {
                                                color: Colors.black,
                                                fontFamily:
                                                    selected === option.id ? Fonts.medium : Fonts.regular,
                                            },
                                        ]}
                                    >
                                        {percentMap.current?.get(option.id) || 0}%
                                    </Text>
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
                text="CONFIRM DELETION"
                subtext="Are you sure you want to delete this poll?"
                buttons={[
                    { label: "NO", onPress: () => setModalVisible(false) },
                    { label: "YES, DELETE", onPress: () => {
                            if (onDeletePoll) {
                                onDeletePoll();
                            }
                            setModalVisible(false);
                    } },
                ]}
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
        fontSize: 20,
        fontFamily: Fonts.medium
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
        marginLeft: 10,
    },
    countStyle: {
        justifyContent: 'space-between',
        marginTop: 3
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
        fontFamily: Fonts.regular
    },
    fontFamilyStyleBold: {
        fontFamily: Fonts.medium
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
        fontSize: 20,
        fontFamily: Fonts.medium,
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
        marginLeft: 10,
        fontFamily: Fonts.regular
    },
    rightPartBar: {
        height: 40,
        position: 'absolute'
    },
    questionContainer: {
        paddingRight: 25,
        marginBottom: 10
    },
    answerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0,
        paddingLeft: 10,
    },
    selectionDot: {
        width: 6,
        height: 6,
        backgroundColor: Colors.black,
        borderRadius: 1,
    },

});