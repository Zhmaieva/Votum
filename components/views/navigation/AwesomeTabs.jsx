import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from "../../../utils/colorUtils.js";

import UserProfileView from "../UserProfileView";
import LikedView from '../LikedView';
import SearchView from '../SearchView';
import AddView from "../AddView";
import FeedView from "../FeedView";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 🔹 Stack Navigator for "User" tab
function UserStack() {
    return (
        <Stack.Navigator id="Test">
            <Stack.Screen name="UserProfile" component={UserProfileView} options={{ headerShown: true, gestureEnabled: true }} />
            <Stack.Screen name="LikedView" component={LikedView} options={{ headerShown: true, gestureEnabled: true }} />
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

// 🔹 Main Tab Navigator
export default function AwesomeTabs() {
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
