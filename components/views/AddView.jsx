import React, { useState, useEffect } from 'react';
import { getDataService, globalEventEmitter } from '../../shared/common';
import {
    View, TextInput, Dimensions, Text, StyleSheet,
    Pressable, SafeAreaView, Image
} from 'react-native';
import { Colors, Fonts } from "../../utils/colorUtils";
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
    const [selectedDuration, setSelectedDuration] = useState('1d');
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
            selectedDuration,
            resetAddViewForm
        });
    };

    const [focusedField, setFocusedField] = useState(null);

    const getFocusedLength = () => {
        if (focusedField === 'question') return question.length;
        const option = options.find(o => o.id === focusedField);
        return option?.text.length || 0;
    };

    const resetAddViewForm = () => {
        setQuestion('');
        setOptions([
            { id: '1', text: '', label: 'Answer 1' },
            { id: '2', text: '', label: 'Answer 2' }
        ]);
        setSelectedDuration('1d');
    };

    useEffect(() => {
        const off = globalEventEmitter.on('pollCreated', () => {
            resetAddViewForm();
            });
        return () => off();
        }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={[styles.row, styles.bottomMargin10]}>
                    <Text style={[styles.qTextStyle]}>Q:</Text>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={[styles.inputQuestion]}
                            placeholder="question"
                            placeholderTextColor='#ababab'
                            value={question}
                            onChangeText={setQuestion}
                            maxLength={50}
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
                                    <Image
                                        source={require('../../assets/images/trashGrey.png')}
                                        style={{ width: 20, height: 20 }}
                                        resizeMode="contain"
                                    />
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
                        <View style={[styles.row]}>
                            <Text style={{fontFamily: Fonts.regular, alignSelf: 'center',}}>Ends in</Text>
                            {durations.map((duration) => (
                                <View style={styles.marginCategory} key={duration}>
                                    <AwesomeCategory
                                        categoryName={duration}
                                        isSelected={selectedDuration === duration}
                                        onPress={() => setSelectedDuration(duration)}
                                        noShadow={true}
                                        size={14}
                                    />
                                </View>
                            ))}
                        </View>
                        {focusedField && (
                            <Text style={styles.charCounter}>
                                {getFocusedLength()}/{focusedField === 'question' ? 50 : 40}
                            </Text>
                        )}
                    </View>
                </View>
                <AwesomeButton
                    color={Color.BLACK}
                    text="Create poll"
                    additionalFunc={handleCreatePoll}
                />
            </View>

            <AwesomeModal
                visible={showModal}
                text="EMPTY FIELD(S)"
                subtext='Please fill in the question and at least two answers'
                onBackPress={() => setShowModal(false)}
                buttons={[
                    { label: "OK", onPress: () => setShowModal(false) }
                ]}
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
        fontSize: 20,
        color: Colors.black,
        paddingTop: 1,
        fontFamily: Fonts.medium,
    },
    inputWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 10,
    },
    inputWithIcon: {
        borderWidth: 1,
        borderColor: Colors.black,
        height: 40,
        paddingLeft: 10,
        paddingRight: 35,
        fontSize: 14,
        borderRadius: 0,
        fontFamily: Fonts.regular,
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
        marginRight: 5,
        fontFamily: Fonts.medium,
    },
    row: {
        flexDirection: 'row',
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
        marginTop: 16,
        justifyContent: 'space-between'
    },
    addAnswerContainer: {
        width: '100%'
    },
    charCounter: {
        color: Colors.black,
        fontSize: 14,
        alignSelf: 'center',
        fontFamily: Fonts.regular,
    },
    marginCategory: {
        marginLeft: 8
    },
    fontFamily: {
        fontFamily: Fonts.regular,
    }
});

export default AddView;