import { View, Pressable } from 'react-native';
import React, {useEffect, useState} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "../../utils/colorUtils";
import {likePoll} from "../../shared/api/apiClient";

export default function AwesomeLikeButton({pollId, isLikedParam}) {

    const [isLiked, setIsLiked] = useState(isLikedParam);

    function onPressHandler() {
        setIsLiked(!isLiked);
        likePoll(pollId).then(res => {
            setIsLiked(res.isLiked ?? false);
        });
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
