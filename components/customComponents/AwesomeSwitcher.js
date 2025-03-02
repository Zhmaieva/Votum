import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Colors } from '../../utils/colorUtils'

const AwesomeSwitcher = () => {
    const [activeTab, setActiveTab] = useState("Active");

    return (
        <View style={styles.container}>
            <View style={styles.switcher}>
                <View
                    style={[
                        styles.indicator,
                        { left: activeTab === "Active" ? 0 : "50%" },
                    ]}
                />
                <Pressable style={styles.tab} onPress={() => setActiveTab("Active")}>
                    <Text style={[styles.text, activeTab === "Active" && styles.activeText]}>active</Text>
                </Pressable>
                <Pressable style={styles.tab} onPress={() => setActiveTab("Closed")}>
                    <Text style={[styles.text, activeTab === "Closed" && styles.activeText]}>closed</Text>
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
        width: '100%',
        position: "relative",
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
        fontFamily: 'arial'
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
        borderColor: '#888'
    },
});

export default AwesomeSwitcher;
