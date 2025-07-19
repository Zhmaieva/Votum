import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, { Color } from '../customComponents/AwesomeButton';
import {
    createPoll,
    fetchMyProfile,
    fetchUserPolls
} from '../../shared/api/apiClient';
import { getDataService } from '../../shared/common';
import AwesomeUserHeaderPreview from "../customComponents/AwesomeUserHeaderPreview";
import AwesomeLoadingHeader from "../customComponents/AwesomeLoadingHeader";

const PreviewPollView = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { question, options, selectedDuration, resetAddViewForm } = route.params;

    const [userDataLoaded, setUserDataLoaded] = useState(false);
    const [user, setUser] = useState(null);

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;

            const loadUserData = async () => {
                let userData = getDataService().getUser();
                if (!userData) {
                    userData = await fetchMyProfile();
                    getDataService().setUser(userData);
                }
                if (isMounted) {
                    setUser(userData);
                    fetchUserPolls(userData.userId).then(res => {
                        if (isMounted) {
                            setUserDataLoaded(true);
                        }
                    });
                }
            };

            loadUserData();

            return () => { isMounted = false; };
        }, [])
    );

    const handlePublish = async () => {
        try {
            const newPoll = await createPoll(
                question,
                options.map(o => o.text),
                selectedDuration
            );

            if (resetAddViewForm) resetAddViewForm();

            navigation.navigate('Interm Page', {
                userId: user?.userId,
                pollId: newPoll?.id || newPoll?.readableId, // Adjust to your backend response
            });
        } catch (e) {
            console.error("Error publishing poll:", e);
            // Optional: show a toast or modal
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <View>
                    {!user || !userDataLoaded ? (
                        <AwesomeLoadingHeader />
                    ) : (
                        <AwesomeUserHeaderPreview
                            userData={user}
                            loggedInUserId={user.userId}
                            isInsideCard={true}
                        />
                    )}
                    <View style={[styles.questionContainer, styles.row]}>
                        <Text style={styles.qTextStyle}>Q: </Text>
                        <Text
                            style={styles.questionText}
                            numberOfLines={3}
                            ellipsizeMode="tail"
                        >
                            {question}
                        </Text>
                    </View>
                    <View style={styles.pollBox}>
                        <View style={[styles.row, styles.alignToTheRight]}>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/images/trashBlack.png')}
                                    style={{ width: 27, height: 27 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/images/shareBlack.png')}
                                    style={{ width: 27, height: 27 }}
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={styles.iconContainer}>
                                <Image
                                    source={require('../../assets/images/heartBlack.png')}
                                    style={{ width: 27, height: 27 }}
                                    resizeMode="contain"
                                />
                            </View>
                        </View>
                        {options.map((option, index) => (
                            <View key={index} style={styles.optionRow}>
                                <Text style={styles.optionText}>{option.text}</Text>
                            </View>
                        ))}
                        <View style={[styles.row, styles.alignment]}>
                            <Text style={styles.endsIn}>Ends in {selectedDuration}</Text>
                            <Text style={styles.voted}>0 voted</Text>
                        </View>
                    </View>
                </View>
                <View style={{ marginBottom: 5 }}>
                    <View style={styles.margin10}>
                        <AwesomeButton
                            color={Color.BLACK}
                            text="Publish"
                            additionalFunc={handlePublish}
                        />
                    </View>
                    <AwesomeButton
                        color={Color.WHITE}
                        text="Go back and edit"
                        additionalFunc={() => navigation.goBack()}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: Colors.white,
        flex: 1,
    },
    container: {
        padding: 15,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
    },
    alignToTheRight: {
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    alignment: {
        justifyContent: 'space-between',
    },
    questionContainer: {
        marginBottom: 10,
        width: '100%',
    },
    qTextStyle: {
        color: Colors.green,
        fontSize: 20,
        fontFamily: Fonts.medium,
    },
    questionText: {
        fontSize: 20,
        color: Colors.black,
        width: '90%',
        fontFamily: Fonts.medium,
    },
    pollBox: {
        borderWidth: 1,
        borderColor: Colors.black,
        padding: 14,
        marginBottom: 20,
        backgroundColor: Colors.white,
    },
    optionRow: {
        borderWidth: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        padding: 11,
        marginBottom: 10,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
    },
    optionText: {
        color: Colors.black,
        fontSize: 14,
        fontFamily: Fonts.regular,
    },
    endsIn: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    voted: {
        marginTop: 10,
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    margin10: {
        marginBottom: 15,
    },
    iconContainer: {
        marginLeft: 10,
    },
});

export default PreviewPollView;
