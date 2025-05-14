import React, { useState } from 'react';
import {
    View, TextInput, Dimensions, Text, StyleSheet,
    Pressable, SafeAreaView
} from 'react-native';
import { Colors } from "../../utils/colorUtils";
import { Ionicons } from "@expo/vector-icons";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import { AwesomeModal } from "../customComponents/AwesomeModal";
import { useNavigation } from '@react-navigation/native';
import AwesomeCategory from "../customComponents/AwesomeCategory";

const { width } = Dimensions.get('window');

const AddView = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([
        { id: '1', text: '', label: 'Answer 1' },
        { id: '2', text: '', label: 'Answer 2' }
    ]);
    const [selectedDuration, setSelectedDuration] = useState('1h');
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();

    const durations = ['1h', '1d', '1w', '1m'];

    const addOption = () => {
        if (options.length < 4) {
            const newOptionNumber = options.length + 1;
            setOptions([...options, {
                id: String(Date.now()),
                text: '',
                label: `Answer ${newOptionNumber}`
            }]);
        }
    };

    const removeOption = (id) => {
        if (options.length > 2) {
            const updated = options
                .filter(option => option.id !== id)
                .map((o, i) => ({ ...o, label: `Answer ${i + 1}` }));
            setOptions(updated);
        }
    };

    const updateOption = (id, text) => {
        setOptions(options.map(o => o.id === id ? { ...o, text } : o));
    };

    const filteredOptions = options.filter(o => o.text.trim());

    const handleCreatePoll = () => {
        const isQuestionValid = question.trim().length > 0;
        const validAnswers = filteredOptions.length >= 2;

        if (!isQuestionValid || !validAnswers) {
            setShowModal(true);
            return;
        }

        navigation.navigate('Preview Poll', {
            question,
            options: filteredOptions,
            selectedDuration
        });
    };

    const [focusedField, setFocusedField] = useState(null);

    const getFocusedLength = () => {
        if (focusedField === 'question') return question.length;
        const option = options.find(o => o.id === focusedField);
        return option?.text.length || 0;
    };

    const [selectedOption, setSelectedOption] = useState('1d');

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={[styles.row, styles.bottomMargin10]}>
                    <Text style={[styles.qTextStyle, styles.fontFamily]}>Q:</Text>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={[styles.inputQuestion, styles.fontFamily]}
                            placeholder="question"
                            placeholderTextColor='#ababab'
                            value={question}
                            onChangeText={setQuestion}
                            maxLength={40}
                            onFocus={() => setFocusedField('question')}
                        />
                    </View>
                </View>
                <View style={styles.votingFrame}>
                    {options.map(item => (
                        <View style={styles.inputWrapper} key={item.id}>
                            <TextInput
                                style={[styles.inputWithIcon, styles.fontFamily]}
                                placeholder={item.label}
                                value={item.text}
                                placeholderTextColor='#ababab'
                                onChangeText={(text) => updateOption(item.id, text)}
                                maxLength={40}
                                onFocus={() => setFocusedField(item.id)}
                            />
                            {options.length > 2 && (
                                <Pressable style={styles.iconOverlay} onPress={() => removeOption(item.id)}>
                                    <Ionicons name='trash-outline' size={18} color='#ababab' />
                                </Pressable>
                            )}
                        </View>
                    ))}

                    {options.length < 4 && (
                        <View style={styles.addAnswerContainer}>
                            <AwesomeButton text='Add answer' color={Color.WHITE} additionalFunc={addOption} />
                        </View>
                    )}
                    <View style={[styles.row, styles.endsInRow]}>
                        <Text>Ends in</Text>
                        <View style={styles.row}>
                            {["1h", "1d", "1w", "1m"].map((duration) => (
                                <View style={styles.marginCategory} key={duration}>
                                    <AwesomeCategory
                                        categoryName={duration}
                                        isSelected={selectedOption === duration}
                                        onPress={() => setSelectedOption(duration)}
                                        noShadow={true}
                                        size={14}
                                    />
                                </View>
                            ))}
                        </View>
                    </View>
                    {focusedField && (
                        <Text style={styles.charCounter}>
                            {getFocusedLength()}/40
                        </Text>
                    )}
                </View>
            </View>
            <View style={styles.container}>
                <AwesomeButton
                    color={Color.BLACK}
                    text="Create poll"
                    additionalFunc={handleCreatePoll}
                />
            </View>

            <AwesomeModal
                visible={showModal}
                text="Please fill in the question and at least two answers"
                buttonText="OK"
                onBackPress={() => setShowModal(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
        justifyContent: 'space-between',
    },
    container: {
        padding: 15,
    },
    inputQuestion: {
        fontWeight: 'bold',
        fontSize: 20,
        color: Colors.black,
        paddingTop: 1,
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 10
    },
    inputWithIcon: {
        borderWidth: 1,
        borderColor: Colors.black,
        height: 40,
        paddingLeft: 10,
        paddingRight: 35,
        fontSize: 14,
        borderRadius: 0,
    },
    iconOverlay: {
        position: 'absolute',
        right: 3,
        top: 7,
        padding: 4
    },
    qTextStyle: {
        color: Colors.black,
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: 5,
    },
    row: {
        flexDirection: 'row'
    },
    bottomMargin10: {
        marginBottom: 10
    },
    votingFrame: {
        borderWidth: 1,
        borderColor: Colors.black,
        backgroundColor: Colors.white,
        padding: 14,
        marginBottom: 20,
    },
    endsInRow: {
        alignItems: 'center',
        marginTop: 16,
    },
    addAnswerContainer: {
        width: '100%'
    },
    charCounter: {
        color: Colors.grey,
        fontSize: 12,
        alignSelf: 'flex-end',
        paddingBottom: 2
    },
    marginCategory: {
        marginLeft: 8
    }
});

export default AddView;