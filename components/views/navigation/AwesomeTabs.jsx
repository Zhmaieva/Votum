import React, {useEffect, useState} from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from "../../../utils/colorUtils.js";
import MyUserProfileView from "../MyUserProfileView";
import VotedView from '../VotedView';
import SearchView from '../SearchView';
import AddView from "../AddView";
import FeedView from "../FeedView";
import ProfileEditView from "../ProfileEditView";
import BioEditView from "../BioEditView";
import EmailEditView from "../EmailEditView";
import {isTokenAvailable, updateUserProfile} from "../../../shared/api/apiClient";
import {getDataService, globalEventEmitter} from "../../../shared/common";
import HeaderRightButton from "../../customComponents/HeaderRightButton";
import FollowingView from "../FollowingView";
import RegistrationMethodView from "../RegistrationMethodView";
import EmailRegisterView from "../EmailRegisterView";
import VerificationCodeView, {VERIFICATION_FLOW_TYPE} from "../VerificationCodeView";
import UsernameView from "../UsernameView";
import WelcomeView from "../WelcomeView";
import ProfilePhotoView from "../ProfilePhotoView";
import AgeView from "../AgeView";
import LogInView from "../LogInView"
import ForgotPasswordView from "../ForgotPassword";
import FollowersView from "../FollowersView";
import AwesomeUsernameInput from "../../customComponents/AwesomeUsernameInput";
import SomebodysProfileView from "../SomebodysProfileView"
import PreviewPollView from "../PreviewPollView";
import EditUsernameView from "../EditUsernameView";
import PasswordView from "../PasswordView"
import CategoriesView from '../CategoriesView'
import ReportBugView from "../ReportBugView"
import ContactInformationView from "../ContactInformationView"
import TermsAndConditionsView from "../TermsAndConditionsView";
import NotificationsView from "../NotificationsView";
import NotificationSettingsView from "../NotificationSettingsView";
import EditBirthDateView from "../EditBirthDateView";
import EditGenderView from "../EditGenderView";
import SuccessView from "../SuccessView";
import NewPasswordView from "../NewPasswordView";
import { Image } from 'react-native';
import myPollsGreen from '../../../assets/images/myPollsGreen.png';
import myPollsBlack from '../../../assets/images/myPollsBlack.png';
import feedGreen from '../../../assets/images/feedGreen.png';
import feedBlack from '../../../assets/images/feedBlack.png';
import userGreen from '../../../assets/images/userGreen.png';
import userBlack from '../../../assets/images/userBlack.png';
import searchGreen from '../../../assets/images/searchGreen.png';
import searchBlack from '../../../assets/images/searchBlack.png';
import addGreen from '../../../assets/images/addGreen.png';
import addBlack from '../../../assets/images/addBlack.png';
import IntermediatePage from '../IntermediatePage.jsx';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PrivacyPolicyView from "../PrivacyPolicyView";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function AuthFlow() {
    return (
        <AuthStack.Navigator id='Auth'>
            <AuthStack.Screen name="Registration" component={RegistrationMethodView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Email Register" component={EmailRegisterView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Verification Code" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.REGISTRATION}} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Verification Code Forgot" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD}} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Log in" component={LogInView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Username" component={UsernameView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Forgot password" component={ForgotPasswordView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="New Password" component={NewPasswordView} options={{ headerShown: true, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD}}/>
        </AuthStack.Navigator>
    );
}

function OnboardingFlow() {
    return (
        <AuthStack.Navigator id='Onboarding'>
            <AuthStack.Screen name="Welcome" component={WelcomeView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Profile photo" component={ProfilePhotoView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Age" component={AgeView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Categories" component={CategoriesView} options={{ headerShown: false, gestureEnabled: true }}/>
        </AuthStack.Navigator>
    );
}

// 🔹 Stack Navigator for "User" tab
function UserStack() {

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProfile = async (field, value, setIsLoading, navigation) => {
        setIsLoading(true);
        try {
            console.log('value', `-${value}-`);
            if (value === null) {
                getDataService().setUserNameTakenError();
                return;
            }

            if (!value?.trim()) {
                getDataService().setUserNameEmptyError();
                return;
            }

            const updatedData = { [field]: value };

            // Update the user's profile with the dynamic field and value
            await updateUserProfile(updatedData);
            console.log('saving to DS' + JSON.stringify(getDataService().getUser()));
            getDataService().commitUserChanges();
            getDataService().resetErrors();
            navigation.goBack();
        } catch (error) {}
        finally {
            setIsLoading(false);
        }
    };

    return (
        <Stack.Navigator id="Test">
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Edit profile" component={ProfileEditView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Following" component={FollowingView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Followers" component={FollowersView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Edit username"
                          component={EditUsernameView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                          })}
            />
            <Stack.Screen name="Edit bio"
                          component={BioEditView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                          })}
            />
            <Stack.Screen name="Edit email"
                          component={EmailEditView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                          })}
            />
            <Stack.Screen name="Change Email"
                          component={PasswordView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                          })}
            />
            <AuthStack.Screen name="Edit password" component={PasswordView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Verification Code" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_EMAIL}} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Verification Code Password" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Log in" component={LogInView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Forgot password" component={ForgotPasswordView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Email Register" component={EmailRegisterView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Report a bug" component={ReportBugView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Contact Info" component={ContactInformationView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Terms of service" component={TermsAndConditionsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Policy" component={PrivacyPolicyView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Notifications" component={NotificationsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Notification Settings" component={NotificationSettingsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Edit Birth" component={EditBirthDateView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Edit Gender" component={EditGenderView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Success email" component={SuccessView} options={{ headerShown: true, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_EMAIL}}/>
            <AuthStack.Screen name="Success password" component={SuccessView} options={{ headerShown: true, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}}/>
            <AuthStack.Screen name="New Password" component={NewPasswordView} options={{ headerShown: true, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}}/>
        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Feed" tab
function FeedStack() {
    return (
        <Stack.Navigator id="Test2">
            <Stack.Screen name="FeedMain" component={FeedView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Somebodys Profile" component={SomebodysProfileView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />

        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Liked" tab
function VotedStack() {
    return (
        <Stack.Navigator id="Test3">
            <Stack.Screen name="VotedMain" component={VotedView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Somebodys Profile" component={SomebodysProfileView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />
        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Add" tab
function AddStack() {
    return (
        <Stack.Navigator id="Test4">
            <Stack.Screen name="AddMain" component={AddView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Preview Poll" component={PreviewPollView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Interm Page" component={IntermediatePage} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />
        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Search" tab
function SearchStack() {
    return (
        <Stack.Navigator id="Test5">
            <Stack.Screen name="SearchMain" component={SearchView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Somebodys Profile" component={SomebodysProfileView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />
        </Stack.Navigator>
    );
}

// Stack Navigator (Includes Auth and Tabs)
export function AuthNavigator() {
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        isTokenAvailable().then(result => {
            setAuthenticated(result);
        })
    }, []);

    globalEventEmitter.on('signup', () => {
        setAuthenticated(true);
    });

    return authenticated ? (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Auth" component={OnboardingFlow} />
                <Stack.Screen name="MainTabs" component={AwesomeTabs} />
            </Stack.Navigator>
        )
        : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthFlow} />
            <Stack.Screen name="MainTabs" component={AwesomeTabs} />
        </Stack.Navigator>
    );
}

// 🔹 Main Tab Navigator
export function AwesomeTabs() {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            id="MainTabNavigator"
            screenOptions={({ route }) => ({
                tabBarLabelStyle: {
                    fontFamily: Fonts.bold,
                    fontSize: 10,
                },
                tabBarStyle: {
                    backgroundColor: Colors.white,
                    borderTopWidth: 1,
                    borderColor: Colors.lightGrey,
                    height: 56,
                    paddingBottom: insets.bottom,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -7 },
                    shadowOpacity: 0.15,
                    shadowRadius: 5,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'VOTED') {
                        return (
                            <Image
                                source={focused ? myPollsGreen : myPollsBlack}
                                style={{ width: size, height: size, resizeMode: 'contain' }}
                            />
                        );
                    }
                    if (route.name === 'MY PROFILE') {
                        return (
                            <Image
                                source={focused ? userGreen : userBlack}
                                style={{ width: size, height: size, resizeMode: 'contain' }}
                            />
                        );
                    }
                    if (route.name === 'FEED') {
                        return (
                            <Image
                                source={focused ? feedGreen : feedBlack}
                                style={{ width: size, height: size, resizeMode: 'contain' }}
                            />
                        );
                    }
                    if (route.name === 'SEARCH') {
                        return (
                            <Image
                                source={focused ? searchGreen : searchBlack}
                                style={{ width: size, height: size, resizeMode: 'contain' }}
                            />
                        );
                    }
                    if (route.name === 'ADD POLL') {
                        return (
                            <Image
                                source={focused ? addGreen : addBlack}
                                style={{ width: size, height: size, resizeMode: 'contain' }}
                            />
                        );
                    }
                },
                tabBarActiveTintColor: Colors.black,
                tabBarInactiveTintColor: Colors.black,
            })}
        >
            <Tab.Screen name="FEED" component={FeedStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="SEARCH" component={SearchStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="ADD POLL" component={AddStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="VOTED" component={VotedStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="MY PROFILE" component={UserStack} options={{ headerShown: false, gestureEnabled: true }} />
        </Tab.Navigator>
    );
}