import React from "react";
import { View } from "react-native";
import AwesomeUserHeader from "./AwesomeUserHeader";
import AwesomeVote from "./AwesomeVote";

const AwesomeCard = ({item, handleVote}) => {

    const handleDeletePoll = (pollId) => {
        setPolls((prevPolls) => prevPolls.filter((poll) => poll.id !== pollId));
        console.log(`Poll ${pollId} deleted!`);
    };

    return (
        <View>
            <AwesomeUserHeader
                userData={item.user}
            />
            <AwesomeVote
                key={item?.id ?? item}
                question={item?.question}
                options={item?.options}
                results={item?.results}
                timeLeft={item?.timeLeft}
                totalVotes={item?.totalVotes}
                onVote={(option) => handleVote(item?.id, option)}
                createdByUser={item.createdByUser}
                onDeletePoll={() => handleDeletePoll(item.id)}
            />
        </View>
    );
};

export default AwesomeCard;
