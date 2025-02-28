import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';  // Icons
import VotingView from "../VotingView";
import {Colors} from "../../../utils/colorUtils.js";
import TestView from "../TestView";
import UserProfileView from "../UserProfileView";

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
                    if (route.name === 'Test') {
                        iconName = focused ? 'leaf' : 'leaf-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Colors.green,
                tabBarInactiveTintColor: Colors.black,
            })}
        >
            <Tab.Screen name="Vote" component={VotingView} />
            <Tab.Screen name="User" component={UserProfileView} />
            <Tab.Screen name="Test" component={TestView} />
        </Tab.Navigator>
    );
}
