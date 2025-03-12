import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search polls..."
                placeholderTextColor={Colors.grey}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton}>
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
        borderColor: Colors.grey,
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
        backgroundColor: Colors.white,
        color: Colors.black,
    },
    searchButton: {
        height: 40,
        width: 80,
        marginLeft: 5,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    searchButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
    },
});

export default SearchBar;
