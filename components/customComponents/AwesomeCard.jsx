import React from "react";
import { View } from "react-native";
import AwesomeUserHeader from "./AwesomeUserHeader";
import AwesomeVote from "./AwesomeVote";

const AwesomeCard = ({item, handleVote}) => {
    return (
        <View>
            <AwesomeUserHeader
                userName={item?.userName}
                followersNumber={item?.followersNumber}
                image={item?.image}
            />
            <AwesomeVote
                key={item?.id ?? item}
                question={item?.question}
                options={item?.options}
                results={item?.results}
                timeLeft={item?.timeLeft}
                totalVotes={item?.totalVotes}
                onVote={(option) => handleVote(item?.id, option)}
            />
        </View>
    );
};

export default AwesomeCard;
