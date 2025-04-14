import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from '../../utils/colorUtils';

const AwesomeSegmentedControls = ({ leftOption, centerOption, rightOption, lastOption, onDisplayModeChangedHandler }) => {
    const [selected, setSelected] = useState(leftOption);

    const onPressHandler = (option) => {
        setSelected(option);
        onDisplayModeChangedHandler(option);
    };

    return (
        <View style={styles.container}>
            <View style={styles.switcher}>
                <Pressable style={[styles.tab, selected === leftOption && styles.activeTab]} onPress={() => onPressHandler(leftOption)}>
                    <Text style={[styles.text, selected === leftOption && styles.activeText]}>
                        {leftOption}
                    </Text>
                </Pressable>
                <Pressable style={[styles.tab, selected === centerOption && styles.activeTab]} onPress={() => onPressHandler(centerOption)}>
                    <Text style={[styles.text, selected === centerOption && styles.activeText]}>
                        {centerOption}
                    </Text>
                </Pressable>
                <Pressable style={[styles.tab, selected === rightOption && styles.activeTab]} onPress={() => onPressHandler(rightOption)}>
                    <Text style={[styles.text, selected === rightOption && styles.activeText]}>
                        {rightOption}
                    </Text>
                </Pressable>
                <Pressable style={[styles.tab, selected === lastOption && styles.activeTab]} onPress={() => onPressHandler(lastOption)}>
                    <Text style={[styles.text, selected === lastOption && styles.activeText]}>
                        {lastOption}
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
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: "center",
        borderColor: Colors.black
    },
    text: {
        fontSize: 14,
        color: Colors.grey,
    },
    activeTab: {
        backgroundColor: Colors.black
    },
    activeText: {
        color: Colors.white,
        fontWeight: "bold",
    },
});

export default AwesomeSegmentedControls;