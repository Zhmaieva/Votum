import { View, Pressable } from 'react-native';
import React, {useEffect, useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "../../utils/colorUtils";
import {likePoll, unlikePoll} from "../../shared/api/apiClient";

export default function AwesomeLikeButton({pollId, isLikedParam}) {

    const [isLiked, setIsLiked] = useState(isLikedParam);

    function onPressHandler() {
        const liked = !isLiked;
        setIsLiked(liked);

        if (liked) {
            likePoll(pollId).then(res => {
                setIsLiked(res.success ?? !liked);
            });
        } else {
            unlikePoll(pollId).then(res => {
                setIsLiked(res.success ? false : !liked);
            });
        }
    }

    return (
        <View>
            <Pressable onPress={onPressHandler}>
                <Ionicons
                    name={isLiked ? 'heart-sharp' : 'heart-outline'}
                    size={26}
                    color={isLiked ? Colors.green : Colors.black}
                />
            </Pressable>
        </View>
    );
}
