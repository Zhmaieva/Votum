import React, { useState } from 'react';
import {View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeCategory from "../customComponents/AwesomeCategory";
import { SafeAreaView } from 'react-native-safe-area-context';
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import { AwesomeModal } from "../customComponents/AwesomeModal";
import {globalEventEmitter, Loader, Logger} from "../../shared/common";
import {setUserCategories} from "../../shared/api/apiClient"; // Assuming path is correct

const categoryList = [
    'social life', 'health', 'entertainment', 'food', 'lifestyle',
    'fashion', 'tech', 'opinions', 'media', 'games'
];

const categoriesId = {
    'social life': 1,
    'health': 2,
    'entertainment': 3,
    'food': 4,
    'lifestyle': 5,
    'fashion': 6,
    'tech': 7,
    'opinions': 8,
    'media': 9,
    'games': 10,
}

const CategoriesView = ({ route }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    const loader = new Loader(setIsLoading);

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

            setIsFinished(true);

            loader.load([new Promise(resolve => resolve()).then(async () => {
                await setUserCategories(selectedCategoryIds);
            })]).then(() => {
                Logger.log("Proceeding with:", selectedCategories);
                globalEventEmitter.emit('signIn', {});
            });
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ffffff" }}>
                <ActivityIndicator size="large" color="#93a548" />
            </View>
    )}

    if (isFinished) {
        return (<></>)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top', 'bottom']}>
            <View style={styles.container}>
                <View style={styles.margin10}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Choose Your Interests</Text>
                        <Text style={styles.instructionText}>Select at least one to proceed</Text>
                    </View>
                    <View style={styles.row}>
                        <View style={styles.marginTag}>
                            <AwesomeCategory
                                categoryName='all of them!'
                                isSelected={allSelected}
                                onPress={toggleAll}
                                size={15}
                            />
                        </View>
                        {categoryList.map((cat) => (
                            <View key={cat} style={styles.marginTag}>
                                <AwesomeCategory
                                    categoryName={cat}
                                    isSelected={selectedCategories.includes(cat)}
                                    onPress={() => toggleCategory(cat)}
                                    size={15}
                                />
                            </View>
                        ))}
                    </View>
                </View>
                <AwesomeButton text='Next' color={Color.BLACK} additionalFunc={handleContinue} />
                <AwesomeModal
                    visible={showError}
                    text="PICK A CATEGORY"
                    subtext="Please select at least 1 category"
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
        fontFamily: Fonts.medium
    },
    instructionText: {
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    headerContainer: {
        marginBottom: 30
    },
    margin10: {
        marginBottom: 25
    },
    marginTag: {
        marginBottom: 7,
        marginRight: 7
    }
});

export default CategoriesView;