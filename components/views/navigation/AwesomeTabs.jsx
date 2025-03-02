import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';  // Icons
import VotingView from "../VotingView";
import {Colors} from "../../../utils/colorUtils.js";
import UserProfileView from "../UserProfileView";
import LikedView from '../LikedView'
import SearchView from '../SearchView'
import AddView from "../AddView"
import FeedView from "../FeedView";

const Tab = createBottomTabNavigator(); // Create the tab navigator

export default function AwesomeTabs() {
    return (
        <Tab.Navigator
            id="MainTabNavigator"
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Vote') {
                        iconName = focused ? 'home' : 'home-outline';
                    }
                    if (route.name === 'User') {
                        iconName = focused ? 'flame' : 'flame-outline';
                    }
                    if (route.name === 'Feed') {
                        iconName = focused ? 'leaf' : 'leaf-outline';
                    }
                    if (route.name === 'liked') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    }
                    if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    }
                    if (route.name === 'Add') {
                        iconName = focused ? 'flame' : 'flame-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Colors.green,
                tabBarInactiveTintColor: Colors.black,
            })}
        >
            <Tab.Screen name="User" component={UserProfileView} />
            <Tab.Screen name="Feed" component={FeedView} />
            <Tab.Screen name="liked" component={LikedView} />
            <Tab.Screen name="Add" component={AddView} />
            <Tab.Screen name="Search" component={SearchView} />
            <Tab.Screen name="Vote" component={VotingView} />
        </Tab.Navigator>
    );
}
