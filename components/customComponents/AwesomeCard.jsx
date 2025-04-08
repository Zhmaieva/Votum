import React from "react";
import {StyleSheet, View} from "react-native";
import AwesomeUserHeader from "./AwesomeUserHeader";
import AwesomeVote from "./AwesomeVote";
import {Colors} from "../../utils/colorUtils";
import {globalEventEmitter} from "../../shared/common";
import awesomeFeed from "./AwesomeFeed";
import {deletePoll} from "../../shared/api/apiClient";

const AwesomeCard = ({ item, handleVote, loggedInUserId }) => {  // Pass loggedInUserId as a prop

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
                <AwesomeUserHeader
                    userData={item.user}
                    loggedInUserId={loggedInUserId} // Pass it down
                />
            </View>
            <AwesomeVote
                key={item?.id ?? item}
                id={item?.id ?? item}
                question={item?.question}
                options={item?.options}
                results={item?.results}
                timeLeft={item?.timeLeft}
                totalVotes={item?.totalVotes}
                isLiked={item?.isLiked ?? false}
                onVote={(option) => handleVote(item?.id, option)}
                createdByUser={item.user.userId === loggedInUserId}
                onDeletePoll={() => handleDeletePoll(item.id)}
            />
        </View>
    );
};

export default AwesomeCard;

const styles = StyleSheet.create({
    margin15: {
        marginBottom: 15
    }
});
