import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "../../../utils/colorUtils.js";
import MyUserProfileView from "../MyUserProfileView";
import LikedView from '../LikedView';
import SearchView from '../SearchView';
import AddView from "../AddView";
import FeedView from "../FeedView";
import ProfileEditView from "../ProfileEditView";
import BioEditView from "../BioEditView";
import EmailEditView from "../EmailEditView";
import {updateUserProfile} from "../../../shared/api/apiClient";
import {getDataService, globalEventEmitter} from "../../../shared/common";
import HeaderRightButton from "../../customComponents/HeaderRightButton";
import FollowingView from "../FollowingView";
import RegistrationMethodView from "../RegistrationMethodView";
import EmailRegisterView from "../EmailRegisterView";
import VerificationCodeView, {VERIFICATION_FLOW_TYPE} from "../VerificationCodeView";
import UsernameView from "../UsernameView";
import WellcomeView from "../WellcomeView";
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
            <AuthStack.Screen name="Wellcome" component={WellcomeView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Profile photo" component={ProfilePhotoView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Age" component={AgeView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Categories" component={CategoriesView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Forgot password" component={ForgotPasswordView} options={{ headerShown: false, gestureEnabled: true }}/>
        </AuthStack.Navigator>
    );
}

// 🔹 Stack Navigator for "User" tab
function UserStack() {

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProfile = async (field, value, setIsLoading, navigation) => {
        setIsLoading(true);
        try {
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
            <Stack.Screen name="Profile" component={MyUserProfileView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="Edit profile" component={ProfileEditView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Following" component={FollowingView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Followers" component={FollowersView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="Edit username"
                          component={EditUsernameView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                              headerRight: () => (
                                  <HeaderRightButton
                                      onPress={() => handleUpdateProfile('username', getDataService().getUser()?.username, setIsLoading, navigation)}
                                      isLoading={isLoading}
                                  />
                              ),
                          })}
            />
            <Stack.Screen name="Edit bio"
                          component={BioEditView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                              headerRight: () => (
                                  <HeaderRightButton
                                      onPress={() => handleUpdateProfile('bio', getDataService().getUser()?.bio, setIsLoading, navigation)}
                                      isLoading={isLoading}
                                  />
                              ),
                          })}
            />
            <Stack.Screen name="Edit email"
                          component={EmailEditView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                              headerRight: () => (
                                  <HeaderRightButton
                                      onPress={() => handleUpdateProfile('email', getDataService().getUser()?.email, setIsLoading, navigation)}
                                      isLoading={isLoading}
                                  />
                              ),
                          })}
            />
            <Stack.Screen name="Change Email"
                          component={PasswordView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                              headerRight: () => (
                                  <HeaderRightButton
                                      onPress={() => handleUpdateProfile('email', getDataService().getUser()?.email, setIsLoading, navigation)}
                                      isLoading={isLoading}
                                  />
                              ),
                          })}
            />
            <AuthStack.Screen name="Current Password" component={PasswordView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Verification Code" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_EMAIL}} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Verification Code Password" component={VerificationCodeView} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Log in" component={LogInView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Forgot password" component={ForgotPasswordView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Email Register" component={EmailRegisterView} options={{ headerShown: false, gestureEnabled: true }}/>
            <AuthStack.Screen name="Report bug" component={ReportBugView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Contact Info" component={ContactInformationView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Terms Conditions" component={TermsAndConditionsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Notifications" component={NotificationsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Notification Settings" component={NotificationSettingsView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Edit Birth" component={EditBirthDateView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Edit Gender" component={EditGenderView} options={{ headerShown: true, gestureEnabled: true }}/>
            <AuthStack.Screen name="Success email" component={SuccessView} options={{ headerShown: true, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_EMAIL}}/>
            <AuthStack.Screen name="Success password" component={SuccessView} options={{ headerShown: true, gestureEnabled: true }} initialParams={{ flowType: VERIFICATION_FLOW_TYPE.CHANGE_PASSWORD}}/>
            <AuthStack.Screen name="New Password" component={NewPasswordView} options={{ headerShown: true, gestureEnabled: true }}/>
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
            <Stack.Screen name="VotedMain" component={LikedView} options={{ headerShown: false, gestureEnabled: true }} />
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
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Auth" component={AuthFlow} />
            <Stack.Screen name="MainTabs" component={AwesomeTabs} />
        </Stack.Navigator>
    );
}

// 🔹 Main Tab Navigator
export function AwesomeTabs() {
    return (
        <Tab.Navigator
            id="MainTabNavigator"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'My profile') iconName = focused ? 'flame' : 'flame-outline';
                    if (route.name === 'Feed') iconName = focused ? 'leaf' : 'leaf-outline';
                    if (route.name === 'Liked') iconName = focused ? 'heart' : 'heart-outline';
                    if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
                    if (route.name === 'Add Poll') iconName = focused ? 'add-circle' : 'add-circle-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Colors.green,
                tabBarInactiveTintColor: Colors.black,
            })}
        >
            <Tab.Screen name="Feed" component={FeedStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="Search" component={SearchStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="Add Poll" component={AddStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="Liked" component={VotedStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="My profile" component={UserStack} options={{ headerShown: false, gestureEnabled: true }} />
        </Tab.Navigator>
    );
}