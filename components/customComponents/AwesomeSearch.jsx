import React, {useState} from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';

const AwesomeSearch = ({ onSearchPress }) => {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search polls"
                placeholderTextColor={Colors.grey}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton} onPress={_ => onSearchPress(searchQuery)}>
                <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    searchInput: {
        flex: 1,
        borderColor: Colors.black,
        borderWidth: 1,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: Colors.white,
        color: Colors.black,
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    searchButton: {
        height: 40,
        width: 80,
        marginLeft: 5,
        marginRight: 2,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    searchButtonText: {
        color: Colors.white
    },
});

export default AwesomeSearch;
