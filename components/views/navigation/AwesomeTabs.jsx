import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
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
import UserNameEditView from "../UserNameEditView";
import BioEditView from "../BioEditView";
import EmailEditView from "../EmailEditView";
import {updateUserProfile} from "../../../shared/api/apiClient";
import {getDataService, globalEventEmitter} from "../../../shared/common";
import HeaderRightButton from "../../customComponents/HeaderRightButton";
import FollowingView from "../FollowingView";
import RegistrationMethodView from "../RegistrationMethodView";
import EmailRegisterView from "../EmailRegisterView";
import VerificationCodeView from "../VerificationCodeView";
import UsernameView from "../UsernameView";
import WellcomeView from "../WellcomeView";
import ProfilePhotoView from "../ProfilePhotoView";
import AgeView from "../AgeView";
import LogInView from "../LogInView"
import ForgotPasswordView from "../ForgotPassword";
import FollowersView from "../FollowersView";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

function AuthFlow() {
    return (
        <AuthStack.Navigator id='Auth'>
            <AuthStack.Screen name="Registration" component={RegistrationMethodView} />
            <AuthStack.Screen name="Email Register" component={EmailRegisterView} />
            <AuthStack.Screen name="Verification Code" component={VerificationCodeView} />
            <AuthStack.Screen name="Log in" component={LogInView} />
            <AuthStack.Screen name="Username" component={UsernameView} />
            <AuthStack.Screen name="Wellcome" component={WellcomeView} />
            <AuthStack.Screen name="Profile photo" component={ProfilePhotoView} />
            <AuthStack.Screen name="Age" component={AgeView} />
            <AuthStack.Screen name="Forgot password" component={ForgotPasswordView} />
        </AuthStack.Navigator>
    );
}

// 🔹 Stack Navigator for "User" tab
function UserStack() {

    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateProfile = async (field, value, setIsLoading, navigation) => {
        setIsLoading(true);
        try {
            if (!value?.trim()) {
                getDataService().setUserNameEmptyError();
                return;
            }

            const updatedData = { [field]: value };

            // Update the user's profile with the dynamic field and value
            await updateUserProfile(updatedData);
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
                          component={UserNameEditView}
                          options={({ navigation }) => ({
                              headerShown: true,
                              gestureEnabled: true,
                              headerRight: () => (
                                  <HeaderRightButton
                                      onPress={() => handleUpdateProfile('username', getDataService().getUser()?.userName, setIsLoading, navigation)}
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
        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Feed" tab
function FeedStack() {
    return (
        <Stack.Navigator id="Test2">
            <Stack.Screen name="FeedMain" component={FeedView} options={{ headerShown: false, gestureEnabled: true }} />
            <Stack.Screen name="SearchView" component={SearchView} options={{ headerShown: false, gestureEnabled: true }} />
        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Voted" tab
function VotedStack() {
    return (
        <Stack.Navigator id="Test3">
            <Stack.Screen name="VotedMain" component={LikedView} options={{ headerShown: false, gestureEnabled: true }} />
        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Add" tab
function AddStack() {
    return (
        <Stack.Navigator id="Test4">
            <Stack.Screen name="AddMain" component={AddView} options={{ headerShown: false, gestureEnabled: true }} />
        </Stack.Navigator>
    );
}

// 🔹 Stack Navigator for "Search" tab
function SearchStack() {
    return (
        <Stack.Navigator id="Test5">
            <Stack.Screen name="SearchMain" component={SearchView} options={{ headerShown: false, gestureEnabled: true }} />
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
                    if (route.name === 'User') iconName = focused ? 'flame' : 'flame-outline';
                    if (route.name === 'Feed') iconName = focused ? 'leaf' : 'leaf-outline';
                    if (route.name === 'Voted') iconName = focused ? 'heart' : 'heart-outline';
                    if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
                    if (route.name === 'Add') iconName = focused ? 'add-circle' : 'add-circle-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Colors.green,
                tabBarInactiveTintColor: Colors.black,
            })}
        >
            <Tab.Screen name="User" component={UserStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="Feed" component={FeedStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="Voted" component={VotedStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="Add" component={AddStack} options={{ headerShown: false, gestureEnabled: true }} />
            <Tab.Screen name="Search" component={SearchStack} options={{ headerShown: false, gestureEnabled: true }} />
        </Tab.Navigator>
    );
}
