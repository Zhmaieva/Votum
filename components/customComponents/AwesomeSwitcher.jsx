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
                <Pressable
                    style={[styles.tab, selected === leftOption && styles.activeTabLeft]}
                    onPress={() => onPressHandler(leftOption)}
                >
                    <Text style={[styles.text, selected === leftOption && styles.activeText]}>
                        {leftOption}
                    </Text>
                </Pressable>
                <Pressable
                    style={[styles.tab, selected === rightOption && styles.activeTabRight]}
                    onPress={() => onPressHandler(rightOption)}
                >
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
        //borderColor: Colors.black,
        overflow: "hidden",
    },
    tab: {
        height: 40,
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
    },
    text: {
        fontSize: 15,
        color: Colors.grey,
        fontFamily: 'Ubuntu-Bold',
    },
    activeTabLeft: {
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.black,
        shadowRadius: 0,
        shadowOffset: { width: -1, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
        marginBottom: 3
    },
    activeTabRight: {
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderColor: Colors.black,
        shadowRadius: 0,
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
        marginBottom: 3
    },
    activeText: {
        color: Colors.black,
        fontWeight: '600'
    },
});

export default AwesomeSwitcher;
