import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AwesomeUserHeader from "./AwesomeUserHeader";
import AwesomeVote from "./AwesomeVote";

const AwesomeCard = ({item, handleVote}) => {
    return (
        <View>
            <AwesomeUserHeader  userName='Artem Ovechko' followersNumber='109' image={require('../../assets/images/emil.jpg')} />
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
