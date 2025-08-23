import React, { useRef, useState } from "react";
import {
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Image, View, Pressable, TextInput
} from "react-native";
import {
    BottomSheetModal,
    BottomSheetView,
    useBottomSheetModal
} from "@gorhom/bottom-sheet";
import {Colors, Fonts} from "../../utils/colorUtils";
import {addComment, getComments} from "../../shared/api/apiClient";
import AwesomeButton, {Color} from "./AwesomeButton";
import ReportPoll from "./AwesomeReportPoll";
import {getDataService, globalEventEmitter, Loader} from "../../shared/common";

const Comments = ({ pollId }) => {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useRef(null);
    const bottomSheetModalRef = useRef(null);
    useBottomSheetModal();

    const loader = new Loader(setIsLoading);

    const updateComments = async () => {
        const data = await getComments(pollId)
        setComments(data);

        return data;
    }

    const openSheet = async () => {
        await loader.load([ new Promise(async (res) => {
                await updateComments();
                res();
            })
        ]);
        bottomSheetModalRef.current?.present();
    };

    const isOwnPost = data => data.userid === getDataService().getUser().userId;

    return (
        <>
            <TouchableOpacity onPress={openSheet}>
                <Image
                    source={require('../../assets/images/feedBlack.png')}
                    style={{ width: 28, height: 28 }}
                    resizeMode="contain"
                />
            </TouchableOpacity>

            <BottomSheetModal
                ref={bottomSheetModalRef}
                backgroundStyle={{
                    backgroundColor: Colors.white,
                    borderTopWidth: 1,
                    borderColor: Colors.black,
                    borderRadius: 0
                }}
                enablePanDownToClose={true}
                enableDismissOnClose={true}
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={styles.modalTitle}>Comments</Text>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            ref={inputRef}
                            style={[styles.inputWithIcon, styles.fontFamily]}
                            placeholder={'enter your comment...'}
                            value={commentText}
                            placeholderTextColor='#ababab'
                            onChangeText={(text) => {setCommentText(text);}}
                            maxLength={100}
                            onFocus={() => {}}
                        />
                        <View style={styles.buttonContainer}>
                            <AwesomeButton
                                disabled={!commentText}
                                disableNavigation = {true}
                                color={Color.BLACK}
                                additionalFunc={async () => {
                                    const text = commentText;
                                    setCommentText('');

                                    await loader.load([
                                        new Promise(resolve => {
                                            addComment(pollId, text).then(async result => {
                                                if (result) {
                                                    const commentsData = await updateComments();
                                                    globalEventEmitter.emit('comment', { pollId: pollId, updatedCount: commentsData?.length ?? 0});
                                                    resolve();
                                                }
                                            });
                                        })
                                    ]);

                                }}
                                text="Send"
                            />
                        </View>
                    </View>

                    {
                        isLoading ? (
                            <></>
                        ) : (
                            <FlatList
                                data={comments}
                                keyExtractor={(item) => item.id}
                                renderItem={(item) => {
                                    const data = item.item;

                                    return (
                                        <View style={styles.container}>
                                            <Image source={(data?.image && !data?.image?.includes('default')) ? { uri: data?.image } : require('../../assets/images/default-avatar.png')} style={styles.avatar} contentFit="cover"
                                                   transition={100}
                                                   cachePolicy="disk" />
                                            <View style={styles.textContainer}>
                                                <Text style={styles.username}>{data?.username ?? ''} {isOwnPost(data) ? '(you)' : ''} </Text>
                                                <Text style={styles.subText}>
                                                    {data?.created_at ?? ''}
                                                </Text>
                                                <Text style={styles.subText}>
                                                    {data?.text ?? ''}
                                                </Text>
                                            </View>

                                                {
                                                    isOwnPost(data) ? (
                                                        <></>
                                                    ) : (
                                                        <View style={styles.buttonContainer}>
                                                            <Pressable style={styles.iconContainer} onPress={()=>{
                                                                    const text = commentText;
                                                                    if (text.indexOf(`@${data.username}`) < 0)
                                                                        setCommentText(`@${data.username} ${text}`)
                                                                    inputRef.current?.focus();
                                                                }}>
                                                                <Image
                                                                    source={require('../../assets/images/feedBlack.png')}
                                                                    style={{ width: 27, height: 27 }}
                                                                    resizeMode="contain"
                                                                />
                                                            </Pressable>
                                                            <ReportPoll
                                                                onReport={(reason) => {
                                                                    // TODO: create another bottom sheet
                                                                    // TODO: logic for sending to API
                                                                }}
                                                            />
                                                        </View>
                                                    )
                                                }
                                        </View>
                                    )
                                }

                                }
                            />
                        )
                    }
                </BottomSheetView>
            </BottomSheetModal>
        </>
    );
};

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 3,
        width: "100%",
    },
    avatar: {
        width: 50,
        height: 50,
        marginRight: 10,
        backgroundColor: Colors.lightGrey
    },
    textContainer: {
        flex: 1,
        alignSelf: "flex-end"
    },
    username: {
        fontWeight: "bold",
        fontSize: 15,
        color: Colors.black,
        marginBottom: 1,
        fontFamily: Fonts.medium
    },
    subText: {
        fontSize: 14,
        color: Colors.grey,
        fontFamily: Fonts.regular
    },
    buttonContainer: {
        marginLeft: 10,
        width: 85,
        alignSelf: "flex-end",
    },

    inputWrapper: {
        position: 'relative',
        width: '100%',
        marginBottom: 10,
        minHeight: 100
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
        flex: 4
    },
    iconOverlay: {
        position: 'absolute',
        right: 3,
        top: 7,
        padding: 4
    },

    contentContainer: {
        flex: 1,
        height: 600
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: Colors.black,
        marginLeft: 9,
        fontFamily: Fonts.medium
    },
    reasonButton: {
        padding: 10,
    },
    selectedButton: {
        backgroundColor: Colors.green
    },
    reasonText: {
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.regular
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        marginBottom: 20
    },
    submitButton: {
        backgroundColor: Colors.black,
        padding: 10,
        alignItems: "center",
        width: '47%',
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    cancelButton: {
        width: '47%',
        padding: 10,
        borderWidth: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.black,
        alignItems: "center",
        shadowRadius: 0,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowColor: Colors.green,
    },
    submitText: {
        color: Colors.white,
        fontFamily: Fonts.regular
    },
    cancelText: {
        color: Colors.black,
        fontFamily: Fonts.regular
    },
});

export default Comments;