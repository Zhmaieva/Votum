import { View, Pressable, Image } from 'react-native';
import React, { useState } from 'react';
import { likePoll, unlikePoll } from "../../shared/api/apiClient";

export default function AwesomeLikeButton({ pollId, isLikedParam }) {
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
                <Image
                    source={
                        isLiked
                            ? require('../../assets/images/heartGreen.png')
                            : require('../../assets/images/heartBlack.png')
                    }
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                />
            </Pressable>
        </View>
    );
}
