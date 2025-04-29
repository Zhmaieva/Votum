import React, {useState} from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeCategory from "./AwesomeCategory";

const categoriesList = ['all', 'username', 'question', 'answer'];

const AwesomeSearch = ({ onSearchPress }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState(['all', 'username', 'question', 'answer']);

    const toggleCategory = (category) => {
        if (category === 'all') {
            // Toggle all on/off
            if (selectedCategories.includes('all')) {
                setSelectedCategories([]);
            } else {
                setSelectedCategories(['all', 'username', 'question', 'answer']);
            }
        } else {
            let newSelected = [...selectedCategories];

            if (newSelected.includes(category)) {
                newSelected = newSelected.filter(cat => cat !== category);
            } else {
                newSelected.push(category);
            }

            const manualCategories = ['username', 'question', 'answer'];
            const areAllManualSelected = manualCategories.every(cat => newSelected.includes(cat));

            if (areAllManualSelected) {
                newSelected = ['all', ...manualCategories];
            } else {
                newSelected = newSelected.filter(cat => cat !== 'all');
            }

            setSelectedCategories(newSelected);
        }
    };

    const isSelected = (category) => selectedCategories.includes(category);

    return (
        <View style={styles.searchContainer}>
            <View style={styles.row}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search polls"
                    placeholderTextColor={Colors.grey}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => onSearchPress(searchQuery, selectedCategories)}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.row, styles.categoriesContainer]}>
                {categoriesList.map((category) => (
                    <View style={{marginRight: 8}}>
                        <AwesomeCategory
                            key={category}
                            categoryName={category}
                            isSelected={isSelected(category)}
                            onPress={() => toggleCategory(category)}
                            size={14}
                            noShadow={true}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    searchContainer: {
        marginBottom: 10,
    },
    categoriesContainer: {
        marginTop: 10,
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