import React from "react";
import {StyleSheet, View} from "react-native";
import AwesomeUserHeader from "./AwesomeUserHeader";
import AwesomeVote from "./AwesomeVote";
import {Colors} from "../../utils/colorUtils";

const AwesomeCard = ({ item, handleVote, loggedInUserId }) => {  // Pass loggedInUserId as a prop

    const handleDeletePoll = (pollId) => {
        setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
        console.log(`Poll ${pollId} deleted!`);
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
                createdByUser={item.createdByUser}
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
