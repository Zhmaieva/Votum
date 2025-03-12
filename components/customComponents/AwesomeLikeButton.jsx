import { View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "../../utils/colorUtils";

export default function AwesomeLikeButton() {
    const [isLiked, setIsLiked] = useState(false);

    function onPressHandler() {
        setIsLiked(!isLiked);
    }

    return (
        <View>
            <Pressable onPress={onPressHandler}>
                <Ionicons
                    name={isLiked ? 'heart-sharp' : 'heart-outline'}
                    size={26}
                    color={isLiked ? Colors.green : Colors.grey}
                />
            </Pressable>
        </View>
    );
}
