import { View, Pressable, Image } from 'react-native';
import React, {useEffect, useState} from 'react';
import { likePoll, unlikePoll } from "../../shared/api/apiClient";
import {globalEventEmitter} from "../../shared/common";

export default function AwesomeLikeButton({ pollId, isLikedParam }) {
    const [isLiked, setIsLiked] = useState(isLikedParam);

    function onPressHandler() {
        const liked = !isLiked;
        setIsLiked(liked);

        globalEventEmitter.emit('like', { pollId, isLiked: liked });

        if (liked) {
            likePoll(pollId).then(res => {
                const finalLiked = res.success ?? !liked;
                setIsLiked(finalLiked);
                globalEventEmitter.emit('like', { pollId, isLiked: finalLiked });
            });
        } else {
            unlikePoll(pollId).then(res => {
                const finalLiked = !(res.success ?? true);
                setIsLiked(finalLiked);
                globalEventEmitter.emit('like', { pollId, isLiked: finalLiked });
            });
        }
    }

    // Listen to like updates from other components
    useEffect(() => {
        const handler = ({ pollId: eventPollId, isLiked: liked }) => {
            if (eventPollId === pollId) {
                setIsLiked(liked);
            }
        };

        globalEventEmitter.on('like', handler);
        return () => globalEventEmitter.off('like', handler);
    }, [pollId]);

    return (
        <View>
            <Pressable onPress={onPressHandler} style={{marginLeft: 4}}>
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
