import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors, Fonts } from '../../utils/colorUtils';

const AwesomeSegmentedControls = ({ options = [], onSelect, selectedOption }) => {
    const defaultOption = options.includes("1d") ? "1d" : options[0];
    const [selected, setSelected] = useState(selectedOption ?? defaultOption);

    useEffect(() => {
        if (selectedOption) {
            setSelected(selectedOption);
            return;
        }

        if (defaultOption) {
            onSelect?.(defaultOption);
        }
    }, [defaultOption, selectedOption]);

    const handlePress = (option) => {
        setSelected(option);
        onSelect?.(option);
    };

    return (
        <View style={styles.container}>
            <View style={styles.switcher}>
                {options.map((option) => {
                    const isSelected = selected === option;
                    return (
                        <Pressable
                            key={option}
                            style={[
                                styles.tabBase,
                                isSelected ? styles.tabSelected : styles.tabDefault,
                                styles.shadow,
                            ]}
                            onPress={() => handlePress(option)}
                        >
                            <Text style={[
                                isSelected ? styles.textSelected : styles.textDefault,
                                styles.tabText
                            ]}>
                                {option}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: '100%',
    },
    switcher: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    tabBase: {
        flex: 1,
        borderColor: Colors.black,
        borderWidth: 1,
        borderRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 7
    },
    tabDefault: {
        backgroundColor: Colors.white,
    },
    tabSelected: {
        backgroundColor: Colors.black,
    },
    shadow: {
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
        paddingLeft: 2,
    },
    textDefault: {
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    textSelected: {
        color: Colors.white,
        fontFamily: Fonts.medium,
    },
    tabText: {
        marginVertical: 7,
        fontSize: 14,
    },
});

export default AwesomeSegmentedControls;
