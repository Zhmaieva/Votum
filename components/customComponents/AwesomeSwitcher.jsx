import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from '../../utils/colorUtils';

const AwesomeSwitcher = ({ leftOption, rightOption, onDisplayModeChangedHandler }) => {
    const [selected, setSelected] = useState(leftOption);

    const onPressHandler = (option) => {
        setSelected(option);
        onDisplayModeChangedHandler(option);
    };

    return (
        <View style={styles.container}>
            <View style={styles.switcher}>
                <View
                    style={[
                        styles.indicator,
                        { left: selected === leftOption ? 0 : "50%" },
                    ]}
                />
                <Pressable style={styles.tab} onPress={() => onPressHandler(leftOption)}>
                    <Text style={[styles.text, selected === leftOption && styles.activeText]}>
                        {leftOption}
                    </Text>
                </Pressable>
                <Pressable style={styles.tab} onPress={() => onPressHandler(rightOption)}>
                    <Text style={[styles.text, selected === rightOption && styles.activeText]}>
                        {rightOption}
                    </Text>
                </Pressable>
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
        flex: 1,
        paddingVertical: 14,
        alignItems: "center",
        zIndex: 1,
    },
    text: {
        fontSize: 14,
        color: Colors.grey,
        fontFamily: "Arial",
    },
    activeText: {
        color: Colors.black,
        fontWeight: "bold",
    },
    indicator: {
        position: "absolute",
        width: "50%",
        height: "100%",
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: "#888",
        transition: "left 0.3s ease",
    },
});

export default AwesomeSwitcher;
