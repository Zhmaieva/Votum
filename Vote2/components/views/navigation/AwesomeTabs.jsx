import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';  // Icons
import VotingView from "../VotingView";

const Tab = createBottomTabNavigator(); // Create the tab navigator

export default function AwesomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Vote') {
                        iconName = focused ? 'home' : 'home-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Vote" component={VotingView} />
        </Tab.Navigator>
    );
}
