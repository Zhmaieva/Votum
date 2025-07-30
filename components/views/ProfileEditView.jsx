import React, {useState, useCallback, useEffect} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Modal,
    ScrollView,
    SafeAreaView, Pressable
} from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import AwesomeButton, {Color} from '../customComponents/AwesomeButton';
import AwesomeEditButton from "../customComponents/AwesomeEditButton";
import {deleteUserProfile, fetchMyProfile, signOut} from "../../shared/api/apiClient";
import {getDataService, globalEventEmitter} from "../../shared/common";
import {useFocusEffect} from "@react-navigation/native";
import AwesomeProfilePhoto from "../customComponents/AwesomeProfilePhoto";
import AwesomeCategory from "../customComponents/AwesomeCategory";
import {AwesomeModal} from "../customComponents/AwesomeModal";
import AwesomePollPublishingLoader from "../customComponents/AwesomePollPublishingLoader";
import { useNavigation } from "@react-navigation/native";
import { VERIFICATION_FLOW_TYPE } from "../views/VerificationCodeView";

const followChangedEventName = "followChanged";

const ProfileEditView = ({ route }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [bioD, setBioD] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [user, setUser] = useState(getDataService().getUser());
    const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isErrorModalVisible, setErrorModalVisible] = useState(false);
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            getDataService().resetUserChanges();

            const localUser = getDataService().getUser();
            if (localUser) {
                setUser(localUser);
                setUsername(localUser.username);
                setEmail(localUser.email);
                setBioD(localUser.bio);
                setProfileImage(localUser.image);
            } else {
                fetchMyProfile().then(res => {
                    if (res?.username) {
                        setUser(res);
                        setUsername(res.username);
                        setEmail(res.email);
                        setBioD(res.bio);
                        setProfileImage(res.image);
                        getDataService().setUser(res);
                    }
                });
            }
        }, [])
    );

    useEffect(() => {
        const handler = (updatedUser) => {
            let followersCurrent = getDataService().getUser().followingNumber;
            followersCurrent += updatedUser.isFollowing ? 1 : -1;
            getDataService().getUser().followingNumber = followersCurrent >= 0 ? followersCurrent : 0;

            getDataService().commitUserChanges();
        };
        globalEventEmitter.on(followChangedEventName, handler);
        return () => {
            globalEventEmitter.off(followChangedEventName, handler);
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.subContainer}>
                <View style={styles.row}>
                    <Pressable
                        style={styles.sideButton}
                        onPress={() => navigation.navigate('Followers', { userId: user?.userId })}
                    >
                        <Text style={styles.followersCounterText}>
                            {user?.followersNumber ?? 0}
                        </Text>
                        <Text style={styles.followersText}>followers</Text>
                    </Pressable>

                    <View style={styles.flexibleImageContainer}>
                        <AwesomeProfilePhoto profileImage={profileImage} setProfileImage={setProfileImage} />
                    </View>

                    <Pressable
                        style={styles.sideButton}
                        onPress={() => navigation.navigate('Following', { userId: user?.userId })}
                    >
                        <Text style={styles.followersCounterText}>
                            {user?.followingNumber ?? 0}
                        </Text>
                        <Text style={styles.followersText}>following</Text>
                    </Pressable>
                </View>
                <Text style={[styles.sectionName, styles.marginTop15]}>Profile Info</Text>
                <View style={styles.margin15}>
                    <AwesomeButton
                        textElement={
                            <>
                                <Text style={{ fontFamily: Fonts.medium }}>Username: </Text>
                                <Text style={{ fontFamily: Fonts.regular }}>{username || '—'}</Text>
                            </>
                        }
                        color={Color.WHITE}
                        screenName="Edit username"
                        settingButton={true}
                    />
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton
                        textElement={
                            <>
                                <Text style={{ fontFamily: Fonts.medium }}>Bio: </Text>
                                <Text style={{ fontFamily: Fonts.regular }}>{bioD || '—'}</Text>
                            </>
                        }
                        color={Color.WHITE}
                        screenName="Edit bio"
                        settingButton={true}
                    />
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton
                        textElement={
                            <>
                                <Text style={{ fontFamily: Fonts.medium }}>Email: </Text>
                                <Text style={{ fontFamily: Fonts.regular }}>{email || '—'}</Text>
                            </>
                        }
                        color={Color.WHITE}
                        screenName="Change Email"
                        settingButton={true}
                        params={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_EMAIL }}
                    />
                </View>
                <Text style={[styles.sectionName, styles.marginTop15]}>Personal Details</Text>
                <View style={styles.margin15}>
                    <AwesomeButton text='Birth Date' color={Color.WHITE} settingButton={true} screenName='Edit Birth'/>
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Gender' color={Color.WHITE} settingButton={true} screenName='Edit Gender'/>
                </View>
                <Text style={[styles.sectionName, styles.marginTop15]}>Privacy & Security</Text>
                <View style={styles.margin15}>
                    <AwesomeButton text='Change password' color={Color.WHITE} settingButton={true} screenName='Edit password'/>
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Notifications settings' color={Color.WHITE} settingButton={true} screenName='Notification Settings'/>
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Terms of service' color={Color.WHITE} settingButton={true} screenName='Terms of service' />
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Privacy policy' color={Color.WHITE} settingButton={true} screenName='Policy' />
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Contact information' color={Color.WHITE} settingButton={true} screenName='Contact Info' />
                </View>
                <View style={styles.margin25}>
                    <AwesomeButton text='Report a bug' color={Color.WHITE} settingButton={true} screenName='Report a bug'/>
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Log out' color={Color.BLACK} additionalFunc={() => setLogoutModalVisible(true)} />
                </View>
                <View style={styles.margin15}>
                    <AwesomeButton text='Delete Profile' color={Color.WHITE} additionalFunc={()=>setDeleteModalVisible(true)}/>
                </View>
            </ScrollView>

            {/*<AwesomeButton
                text="Delete profile"
                color={Color.WHITE}
                screenName={null}
                additionalFunc={()=>setDeleteModalVisible(true)}
            />*/}

            <AwesomeModal
                visible={isDeleteModalVisible}
                text="DELETE PROFILE"
                subtext="Are you sure? This will permanently delete all your data"
                buttons={[
                    { label: "DELETE", onPress: async () => {
                            setDeleteModalVisible(false);
                            //set another modal visible and after password input, execute the logic below passing input password
                            const result = await deleteUserProfile('hardcoded_password');
                            if (result) {
                                await signOut();
                                return;
                            }

                            setErrorModalVisible(true);
                        }},
                    { label: "CANCEL", onPress: () => setDeleteModalVisible(false)},
                ]}
                onBackPress={() => setDeleteModalVisible(false)}
            />

            <AwesomeModal
                visible={isErrorModalVisible}
                text="PROFILE DELETION FAILED"
                subtext="There was an error while trying to delete your profile, try again later"
                buttons={[
                    { label: "OK", onPress: () => setErrorModalVisible(false) },
                ]}
                onBackPress={() => setErrorModalVisible(false)}
            />

            <AwesomeModal
                visible={isLogoutModalVisible}
                text="LOG OUT"
                subtext="Are you sure you want to log out?"
                buttons={[
                    { label: "OK", onPress: async () => {
                            setLogoutModalVisible(false);
                            await signOut();
                        }},
                    { label: "CANCEL", onPress: () => setLogoutModalVisible(false) },
                ]}
                onBackPress={() => setLogoutModalVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    subContainer: {
        padding: 15
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    margin15: {
        marginBottom: 12
    },
    sectionName: {
        fontSize: 16,
        marginBottom: 10,
        fontFamily: Fonts.medium
    },
    marginTop15: {
        marginTop: 15
    },
    margin25: {
        marginBottom: 25
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    followersCounterText: {
        fontSize: 40,
        fontFamily: Fonts.bold,
        textAlign: 'center',
        marginBottom: -10
    },
    followersText: {
        textAlign: 'center',
        fontSize: 14,
        color: Colors.black,
        fontFamily: Fonts.bold,
    },
    sideButton: {
        minWidth: 80,
        alignItems: 'center',
        marginBottom: -3,
        alignSelf: 'flex-end'
    },
    flexibleImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
});

export default ProfileEditView;