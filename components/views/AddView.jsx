import React, { useState } from 'react';
import {
    View, TextInput, Dimensions, Text, StyleSheet,
    FlatList, TouchableOpacity, Pressable, SafeAreaView
} from 'react-native';
import { Colors } from "../../utils/colorUtils";
import { Ionicons } from "@expo/vector-icons";
import AwesomeButton, { Color } from "../customComponents/AwesomeButton";
import { AwesomeModal } from "../customComponents/AwesomeModal";
import { useNavigation } from '@react-navigation/native';
import AwesomeSegmentedControls from "../customComponents/AwesomeSegmentedControls";

const { width } = Dimensions.get('window');
const POLL_WIDTH = width * 0.9;

const DURATION_OPTIONS = [
    { label: '1 hour', value: '1h' },
    { label: '1 day', value: '1d' },
    { label: '1 month', value: '1m' }
];

const AddView = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([
        { id: '1', text: '', label: 'Answer 1' },
        { id: '2', text: '', label: 'Answer 2' }
    ]);
    const [selectedDuration, setSelectedDuration] = useState('1h');
    const [durationDropdownOpen, setDurationDropdownOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigation = useNavigation();

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

    const [selectedOption, setSelectedOption] = useState('1h');

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={[styles.row, styles.bottomMargin10]}>
                    <Text style={[styles.qTextStyle, styles.fontFamily]}>Q: </Text>
                    <TextInput
                        style={[styles.inputQuestion, styles.fontFamily]}
                        placeholder="Question"
                        placeholderTextColor='#ababab'
                        value={question}
                        onChangeText={setQuestion}
                        maxLength={40}
                        onFocus={() => setFocusedField('question')}
                    />
                </View>
                <View style={styles.votingFrame}>
                    {options.map(item => (
                        <View style={styles.inputWrapper} key={item.id}>
                            <TextInput
                                style={[styles.inputWithIcon, styles.fontFamily]}
                                placeholder={item.label}
                                value={item.text}
                                onChangeText={(text) => updateOption(item.id, text)}
                                maxLength={40}
                                onFocus={() => setFocusedField(item.id)}
                            />
                            {options.length > 2 && (
                                <Pressable style={styles.iconOverlay} onPress={() => removeOption(item.id)}>
                                    <Ionicons name='trash-outline' size={20} color='#ababab' />
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
                        <View style={[styles.row, styles.endsInRow]}>
                            <Text>Ends in </Text>
                            <View style={styles.segmentedControlsContainer}>
                                <AwesomeSegmentedControls
                                    leftOption='1h'
                                    centerOption='1d'
                                    rightOption='1w'
                                    lastOption='1m'
                                    onDisplayModeChangedHandler={setSelectedOption}
                                />
                            </View>
                        </View>
                        {focusedField && (
                            <Text style={styles.charCounter}>
                                {getFocusedLength()}/40
                            </Text>
                        )}
                    </View>
                    {durationDropdownOpen && (
                        <View style={styles.dropdown}>
                            {DURATION_OPTIONS.map(option => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={styles.dropdownOption}
                                    onPress={() => {
                                        setSelectedDuration(option.value);
                                        setDurationDropdownOpen(false);
                                    }}>
                                    <Text>{option.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </View>
            <View style={styles.container}>
                <AwesomeButton
                    color={Color.GREEN}
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
        padding: 20,
    },
    inputQuestion: {
        flex: 1,
        fontWeight: '500',
        fontSize: 18,
        color: Colors.black,
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
        textAlignVertical: 'center',
        borderRadius: 0
    },
    iconOverlay: {
        position: 'absolute',
        right: 8,
        top: 8,
        padding: 4
    },
    qTextStyle: {
        color: Colors.green,
        fontSize: 18,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row'
    },
    bottomMargin10: {
        marginBottom: 10
    },
    fontFamily: {
        fontFamily: 'arial'
    },
    votingFrame: {
        borderWidth: 1,
        borderColor: Colors.black,
        backgroundColor: Colors.white,
        padding: 14,
        marginBottom: 20,
    },
    timer: {
        marginLeft: 6,
        borderWidth: 1,
        borderColor: Colors.grey,
        paddingHorizontal: 10,
        paddingVertical: 6
    },
    endsInRow: {
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between'
    },
    dropdown: {
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        borderWidth: 1,
        marginTop: 5
    },
    dropdownOption: {
        padding: 10
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
    segmentedControlsContainer: {

    }
});

export default AddView;