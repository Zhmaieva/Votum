import React, { useState } from 'react';
import {View, StyleSheet, Text, SafeAreaView} from 'react-native';
import { Colors } from '../../utils/colorUtils';
import AwesomeCategory from "../customComponents/AwesomeCategory";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import { AwesomeModal } from "../customComponents/AwesomeModal";
import {globalEventEmitter} from "../../shared/common";
import {setUserCategories} from "../../shared/api/apiClient"; // Assuming path is correct

const categoryList = [
    'Social life', 'Health', 'Entertainment', 'Food', 'Lifestyle',
    'Fashion', 'Tech', 'Opinions', 'Media', 'Games'
];

const categoriesId = {
    'Social life': 1,
    'Health': 2,
    'Entertainment': 3,
    'Food': 4,
    'Lifestyle': 5,
    'Fashion': 6,
    'Tech': 7,
    'Opinions': 8,
    'Media': 9,
    'Games': 10,
}

const CategoriesView = ({ route }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showError, setShowError] = useState(false);

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    const allSelected = selectedCategories.length === categoryList.length;

    const toggleAll = () => {
        if (allSelected) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories([...categoryList]);
        }
    };

    const handleContinue = async () => {
        if (selectedCategories.length === 0) {
            setShowError(true);
        } else {
            const selectedCategoryIds = selectedCategories.map(name => categoriesId[name]);

            await setUserCategories(selectedCategoryIds);;

            console.log("Proceeding with:", selectedCategories);
            globalEventEmitter.emit('signIn', {});
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.margin10}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Choose Your Interests</Text>
                        <Text style={styles.instructionText}>Select at least one to proceed</Text>
                    </View>
                    <View style={styles.row}>
                        {categoryList.map((cat) => (
                            <AwesomeCategory
                                key={cat}
                                categoryName={cat}
                                isSelected={selectedCategories.includes(cat)}
                                onPress={() => toggleCategory(cat)}
                                size={18}
                            />
                        ))}
                        <AwesomeCategory
                            categoryName='All of them!'
                            isSelected={allSelected}
                            onPress={toggleAll}
                        />
                    </View>
                </View>
                <AwesomeButton text='Next' color={Color.BLACK} additionalFunc={handleContinue} />
                <AwesomeModal
                    visible={showError}
                    text="Please select at least one category."
                    buttons={[
                        { label: "OK", onPress: () => setShowError(false) },
                    ]}
                    onBackPress={() => setShowError(false)}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center"
    },
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    instructionText: {
        fontSize: 14
    },
    headerContainer: {
        marginBottom: 30
    },
    margin10: {
        marginBottom: 25
    }
});

export default CategoriesView;