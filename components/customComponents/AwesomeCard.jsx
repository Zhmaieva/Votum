import React from "react";
import {StyleSheet, View} from "react-native";
import AwesomeUserHeader from "./AwesomeUserHeader";
import AwesomeVote from "./AwesomeVote";
import {globalEventEmitter} from "../../shared/common";
import {deletePoll} from "../../shared/api/apiClient";
import AwesomeLoadingHeader from "./AwesomeLoadingHeader";
import AwesomeLoadingPoll from "./AwesomeLoadingPoll";

const AwesomeCard = ({ item, handleVote, loggedInUserId, loading = false }) => {

    const [isDeleted, setIsDeleted] = React.useState(false);

    const handleDeletePoll = (pollId) => {
        if (isDeleted) {
            return;
        }
        setIsDeleted(true);
        deletePoll(pollId).then(() => {});

        globalEventEmitter.emit("deletePoll", { pollId });
    };

    return (
        <View>
            <View style={styles.margin15}>
                {loading ? (
                    <AwesomeLoadingHeader />
                ) : (
                    <AwesomeUserHeader
                        userData={item.user}
                        loggedInUserId={loggedInUserId}
                        isInsideCard={true}
                    />
                )}
            </View>

            {loading ? (
                <AwesomeLoadingPoll />
            ) : (
                <AwesomeVote
                    key={item?.id ?? item}
                    id={item?.id ?? item}
                    question={item?.question}
                    options={item?.options}
                    timeLeft={item?.timeLeft}
                    isLiked={item?.isLiked ?? false}
                    onVote={(optionId) => handleVote(item?.id, optionId)}
                    createdByUser={item.user?.userId === loggedInUserId}
                    onDeletePoll={() => handleDeletePoll(item?.id)}
                />
            )}
        </View>
    );
};

export default AwesomeCard;

const styles = StyleSheet.create({
    margin15: {
        marginBottom: 15
    }
});
