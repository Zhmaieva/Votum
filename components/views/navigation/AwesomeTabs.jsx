import React, {useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors, Fonts } from "../../../utils/colorUtils.js";
import MyUserProfileView from "../MyUserProfileView";
import VotedView from '../VotedView';
import SearchView from '../SearchView';
import AddView from "../AddView";
import FeedView from "../FeedView";
import ProfileEditView from "../ProfileEditView";
import BioEditView from "../BioEditView";
import EmailEditView from "../EmailEditView";
import {isTokenAvailable} from "../../../shared/api/apiClient";
import {globalEventEmitter, Logger} from "../../../shared/common";
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
import PrivacyPolicyWebView from "../PrivacyPolicyWebView";
import TermsOfServiceWebView from "../TermsOfServiceWebView";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Dimensions } from 'react-native';
import SuccessPasswordView from "../SuccessPasswordView";
import NoInternetWrapper from '../NoInternetWrapper';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const { height, width } = Dimensions.get('window');

function AuthFlow() {
    return (
        <AuthStack.Navigator id='Auth'>
            <AuthStack.Screen name="Registration" component={RegistrationMethodView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Email Register" component={EmailRegisterView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Verification Code" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.REGISTRATION}} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Verification Code Forgot" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD}} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Username" component={UsernameView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Log in" component={LogInView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Forgot password" component={ForgotPasswordView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="New Password" component={NewPasswordView} options={{ headerShown: false, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}}/>
            <AuthStack.Screen name="Privacy Policy" component={PrivacyPolicyWebView} options={{ headerShown: true, gestureEnabled: true }} />
            <AuthStack.Screen name="Terms Of Service" component={TermsOfServiceWebView} options={{ headerShown: true, gestureEnabled: true }} />
            <AuthStack.Screen
                name="Success password"
                component={SuccessPasswordView}
                initialParams={{flowType: VERIFICATION_FLOW_TYPE.FORGOT_PASSWORD}}
                options={{ headerShown: false, gestureEnabled: true }}
            />
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
            <Stack.Screen name="Edit password" component={PasswordView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Verification Code" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_EMAIL}} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Verification Code Password" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Log in" component={LogInView} options={{ headerShown: false, gestureEnabled: true }}/>
            <Stack.Screen name="Forgot password" component={ForgotPasswordView} options={{ headerShown: false, gestureEnabled: true }}/>
            <Stack.Screen name="Email Register" component={EmailRegisterView} options={{ headerShown: false, gestureEnabled: true }}/>
            <Stack.Screen name="Report a bug" component={ReportBugView} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Contact Info" component={ContactInformationView} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Terms of service" component={TermsAndConditionsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Policy" component={PrivacyPolicyView} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Notifications" component={NotificationsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Notification Settings" component={NotificationSettingsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Edit Birth" component={EditBirthDateView} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Edit Gender" component={EditGenderView} options={{ headerShown: true, gestureEnabled: true }}/>
            <Stack.Screen name="Success email" component={SuccessView} options={{ headerShown: true, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_EMAIL}}/>
            <Stack.Screen name="New Password" component={NewPasswordView} options={{ headerShown: true, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}}/>
            <Stack.Screen
                name="Success password settings"
                component={SuccessPasswordView}
                initialParams={{flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}}
                options={{ headerShown: false }}
            />
            <Stack.Screen name="Privacy Policy" component={PrivacyPolicyWebView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Terms Of Service" component={TermsOfServiceWebView} options={{ headerShown: true, gestureEnabled: true }} />

        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Feed" tab
function FeedStack() {
    return (
        <Stack.Navigator id="Test2">
            <Stack.Screen name="Feed" component={FeedView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="User Profile" component={SomebodysProfileView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />

        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Liked" tab
function VotedStack() {
    const feedRef = useRef(null);
    const navigation = useNavigation();

    return (
        <Stack.Navigator id="Test3">
            <Stack.Screen
                name="VotedMain"
                component={VotedView}
                options={{ headerShown: false, gestureEnabled: true }}
            />
            <Stack.Screen name="User Profile" component={SomebodysProfileView} options={{ headerShown: false, gestureEnabled: true }} />
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
            <Stack.Screen name="Interm Page" component={IntermediatePage} options={{ headerShown: false, gestureEnabled: true, unmountOnBlur: true }} />
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />
        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Search" tab
function SearchStack() {
    return (
        <Stack.Navigator id="Test5">
            <Stack.Screen name="SearchMain" component={SearchView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="User Profile" component={SomebodysProfileView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />
        </Stack.Navigator>
    );
}

// Stack Navigator (Includes Auth and Tabs)
export function AuthNavigator() {
    const [authenticated, setAuthenticated] = useState(false)

    const checkAuthenticated = async () => {
        isTokenAvailable().then(result => {
            Logger.log('isTokenAvailable ' + result);
            setAuthenticated(result);
        })
    }

    const signUp = () => {
        Logger.log('signup event');
        setAuthenticated(true);
    }

    useEffect(() => {
        checkAuthenticated().then(result => {});

        globalEventEmitter.on('online', checkAuthenticated);
        globalEventEmitter.on('signup', signUp);

        return () => {
            globalEventEmitter.off('online', checkAuthenticated);
            globalEventEmitter.off('signup', signUp);
        }
    }, []);

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
    let tabBarHeight = 68;
    if (height < 670) {
        // iPhone SE (1st & 2nd gen), older Androids
        tabBarHeight = 58;
    } else if (height >= 670 && height < 740) {
        // iPhone 8, small Androids
        tabBarHeight = 63;
    } else if (height >= 740 && height < 800) {
        // iPhone 11 Pro, 12 Mini
        tabBarHeight = 68;
    } else if (height >= 800 && height < 850) {
        // iPhone 13, 14, Pixel 6a
        tabBarHeight = 73;
    } else if (height >= 850 && height < 900) {
        // iPhone 13 Pro Max, 14 Plus
        tabBarHeight = 78;
    } else if (height >= 900 && height < 1000) {
        // Large Androids, Pixel 7 Pro
        tabBarHeight = 83;
    } else {
        // Tablets or foldables
        tabBarHeight = 88;
    }

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
                    height: tabBarHeight,
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
            <Tab.Screen name="FEED" component={FeedStack} options={{ headerShown: false, gestureEnabled: true }}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            globalEventEmitter.emit('feedSwitch');
                        },
                    })}
            />
            <Tab.Screen name="SEARCH" component={SearchStack} options={{ headerShown: false, gestureEnabled: true }}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            globalEventEmitter.emit('feedSwitch');
                        },
                    })}
            />
            <Tab.Screen
                name="ADD POLL"
                component={AddStack}
                options={{ headerShown: false, gestureEnabled: true }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault(); // stop default tab behavior

                        // Reset AddStack to show AddMain (the form screen)
                        navigation.navigate('ADD POLL', {
                            screen: 'NoInternetWrapper',
                        });
                    },
                })}
            />
            <Tab.Screen
                name="VOTED"
                component={VotedStack}
                options={{ headerShown: false }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        globalEventEmitter.emit('feedSwitch');
                    },
                })}
            />
            <Tab.Screen name="MY PROFILE" component={UserStack} options={{ headerShown: false, gestureEnabled: true }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        globalEventEmitter.emit('feedSwitch');
                    },
                })}
            />
        </Tab.Navigator>
    );
}