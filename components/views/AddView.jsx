import React, { useState } from 'react';
import { View, TextInput, Dimensions, Button, Text, StyleSheet, Modal, FlatList, TouchableOpacity, Pressable, TouchableWithoutFeedback } from 'react-native';
import {Colors} from "../../utils/colorUtils";
import {Ionicons} from "@expo/vector-icons";
import AwesomeVote from "../customComponents/AwesomeVote";
import AwesomeButton, {Color} from "../customComponents/AwesomeButton";
import {createPoll, durationMap} from "../../shared/api/apiClient";
const { height, width } = Dimensions.get('window');
const POLL_WIDTH = width * 0.9;

const AddView = () => {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState([
        { id: '1', text: '', label: 'Answer 1' },
        { id: '2', text: '', label: 'Answer 2' }
    ]);

    const addOption = () => {
        if (options.length < 4) {
            const newOptionNumber = options.length + 1;
            setOptions([...options, { id: String(Date.now()), text: '', label: `Answer ${newOptionNumber}` }]);
        }
    };

    const removeOption = (id) => {
        if (options.length > 2) {
            const updatedOptions = options.filter(option => option.id !== id).map((option, index) => ({
                ...option,
                label: `Answer ${index + 1}`
            }));
            setOptions(updatedOptions);
        }
    };

    const updateOption = (id, text) => {
        setOptions(options.map(option => option.id === id ? { ...option, text } : option));
    };

    const [modalVisible, setModalVisible] = useState(false);

    const onPressHandler = () => {
        setModalVisible(true);
    };

    const pollData = [
        {
            id: 1,
            question: "What is your favorite color?",
            options: ["Red", "Blue"],
            results: { Red: 60, Blue: 40 },
            timeLeft: "10m 30s",
            totalVotes: 1457
        }
    ];

    return (
        <View style={styles.cardContainer}>
            <View style={[styles.row, styles.bottomMargin10]}>
                <View>
                    <Text style={[styles.qTextStyle, styles.fontFamily]}>Q: </Text>
                </View>
                <TextInput
                    style={[styles.inputQuestion, styles.fontFamily]}
                    placeholder="Question"
                    value={question}
                    onChangeText={setQuestion}
                    maxLength={40}
                />
            </View>
            <View style={styles.votingFrame}>
                <FlatList
                    data={options}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.optionContainer}>
                            <TextInput
                                style={[styles.inputAnswer, styles.fontFamily]}
                                placeholder={item.label}
                                value={item.text}
                                onChangeText={(text) => updateOption(item.id, text)}
                                maxLength={40}
                            />
                            {options.length > 2 && (
                                <Pressable style={styles.trash} onPress={() => removeOption(item.id)} >
                                    <Ionicons name='trash-outline' size={24} color={Colors.grey} />
                                </Pressable>
                            )}
                        </View>
                    )}
                    extraData={options}
                />
                {options.length < 4 && (
                    <View style={[styles.bottomMargin10, styles.addAnswerContainer]}>
                        <AwesomeButton text='Add answer' color={Color.WHITE} additionalFunc={addOption}/>
                    </View>
                )}
                <View style={[styles.row, styles.test]}>
                    <View style={[styles.row, styles.endsInContainer]}>
                        <Text style={styles.endsInContainer}>Ends in </Text>
                        <View style={[styles.timer]}>
                            <Text>1 h</Text>
                        </View>
                    </View>
                </View>
            </View>
            <AwesomeButton
                color={Color.GREEN}
                text="Create poll"
                //screenName="LikedView"
                additionalFunc={onPressHandler}
            />
            <Modal visible={modalVisible} transparent={true} animationType="fade">
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <View style={styles.finalPollContainer}>
                            <AwesomeVote
                                totalVotes='0'
                                question={question}
                                options={options.map(x => x.text)}
                                timeLeft={durationMap['1d']}
                            />
                        </View>
                        <View style={[styles.row, styles.alignment]}>
                            <View style={styles.editButtonContainer}>
                                <TouchableOpacity style={[styles.editButton]} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.confirmButton}>
                                <AwesomeButton
                                    color={Color.BLACK}
                                    text="Publish"
                                    //screenName='LikedView'
                                    additionalFunc={async () => {
                                        await createPoll(question, options.map(x => x.text), "1d");
                                        setModalVisible(false);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    inputQuestion: {
        borderColor: Colors.white,
        borderRadius: 0,
        flex: 1,
        fontWeight: '500',
        fontSize: 18,
        color: Colors.grey,
    },
    inputAnswer: {
        borderWidth: 1,
        borderColor: Colors.black,
        height: 40,
        borderRadius: 0,
        flex: 1,
        fontWeight: '400',
        fontSize: 14,
        color: Colors.black,
        paddingLeft: 5
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    qTextStyle: {
        color: Colors.green,
        fontSize: 18,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
    },
    bottomMargin10: {
        marginBottom: 10
    },
    fontFamily: {
        fontFamily: 'arial'
    },
    title: {
        fontWeight: '500',
        fontSize: 18
    },
    blackTextStyle: {
        color: Colors.grey
    },
    votingFrame: {
        borderWidth: 1,
        borderColor: Colors.black,
        backgroundColor: Colors.white,
        shadowOffset: { width: 3, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
        paddingTop: 14,
        paddingLeft: 14,
        paddingBottom: 14,
        marginBottom: 20,
    },
    cardContainer: {
        borderColor: Colors.grey,
        backgroundColor: Colors.white,
        padding: 20,
        height: '100%',
        justifyContent: 'center',
    },
    timer: {
        height: 40,
        width: 50,
        justifyContent: "center",
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.grey,
        marginLeft: 2
    },
    endsInContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    test: {
        justifyContent: 'space-between',
        height: 40
    },
    trash: {
        width: 35,
        paddingTop: 5,
        paddingRight: 6,
        height: '100%',
        alignItems: 'flex-end',
    },
    createPollButton: {
        height: 40,
        backgroundColor: Colors.green,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createPollButtonText: {
        color: Colors.white,
        fontFamily: 'arial',
        fontWeight: '500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    finalPollContainer: {
        width: POLL_WIDTH,
        marginBottom: 20
    },
    confirmButton: {
        width: '49%',
    },
    editButtonContainer: {
        width: '49%',
        alignItems: 'center',
    },
    editButton: {
        height: 40,
        backgroundColor: Colors.white,
        width: '86%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: Colors.grey
    },
    editButtonText: {
        color: Colors.grey,
        fontWeight: 'bold',
        fontFamily: 'rial'
    },
    alignment: {
        justifyContent: "space-between",
        width: POLL_WIDTH,
    },
    addAnswerContainer: {
        width: '89%'
    }
});

export default AddView;