import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import {Colors, Fonts} from '../../utils/colorUtils';

const AwesomeSegmentedControls = ({ options = [], onSelect }) => {
    const defaultOption = options.includes("1d") ? "1d" : options[0];
    const [selected, setSelected] = useState(defaultOption);

    useEffect(() => {
        if (defaultOption) {
            onSelect?.(defaultOption);
        }
    }, [defaultOption]);

    const handlePress = (option) => {
        setSelected(option);
        onSelect?.(option);
    };

    return (
        <View style={styles.container}>
            <View style={styles.switcher}>
                {options.map((option) => (
                    <Pressable
                        key={option}
                        style={[styles.tab, selected === option && styles.activeTab]}
                        onPress={() => handlePress(option)}
                    >
                        <Text style={[styles.text, selected === option && styles.activeText]}>
                            {option}
                        </Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    switcher: {
        flexDirection: "row",
        width: "100%",
        position: "relative",
        borderColor: Colors.grey,
        overflow: "hidden",
    },
    tab: {
        height: 40,
        minWidth: 40,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: "center",
        borderColor: Colors.black,
    },
    text: {
        fontSize: 14,
        color: Colors.grey,
        fontFamily: Fonts.regular
    },
    activeTab: {
        borderColor: Colors.black,
        borderWidth: 1,
    },
    activeText: {
        color: Colors.black,
        fontFamily: Fonts.medium
    },
});

export default AwesomeSegmentedControls;