import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDataService} from "../common";

let tokenValue = null;

export const getToken = async function() {
    console.log(`token: ${tokenValue}`);
    console.log(`stored token: ${await AsyncStorage.getItem('auth_token')}`);
    return tokenValue ?? await AsyncStorage.getItem('auth_token');
}

export const isLoggedIn = async function() {
    return await AsyncStorage.getItem('auth_token');
}

const hardcodedCredentials = {
    login: 'zhmaievayuliia@google.com',
    password: 'securepassword',
};

// for Artem
// const hardcodedCredentials = {
//     login: 'testuser',
//     password: 'securepassword123',
// };

//const BASE_URL = "http://192.168.1.224:3000";//Yuliia's mac
const BASE_URL = "http://192.168.1.102:3000";//Artem's mac

export const login = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, hardcodedCredentials);
        const { token } = response.data;
        await AsyncStorage.setItem('auth_token', token); // Save token in AsyncStorage
        tokenValue = token;
        console.log('login successful');
    } catch (err) {
        console.log('Login failed', err);
    }
};

export const fetchMyProfile = async () => {
    try {
        console.log('Fetching profile...');
        const response = await axios.get(`${BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        const userProfile = response?.data;

        if (!userProfile) {
            throw new Error("User profile not found");
        }

        console.log('Fetched user profile:', JSON.stringify(userProfile));

        // Ensure the bio field is present
        return {
            ...userProfile,
            bio: userProfile.bio || "bio here", // Fallback if bio is null or undefined
        };
    } catch (err) {
        console.log('My profile failed', err);
    }
};

export const fetchPolls = async () => {
    try {
        console.log('fetching polls...');
        const response = await axios.get(`${BASE_URL}/polls`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('fetch polls response, total: ' + response.data.length);
        console.log('response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        console.log('Fetch failed', err);
    }
};

export const likePoll = async (id) => {
    try {
        console.log(`liking poll ${id}`);
        const response = await axios.post(`${BASE_URL}/polls/like`, {
            pollId: id
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('like polls response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        console.log('Like failed', err);
    }
};

export const followProfile = async (id) => {
    try {
        console.log(`following profile ${id}`);
        const response = await axios.post(`${BASE_URL}/profile/followers`, {
            userId: id
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('following profile response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        console.log('follow failed', err);
    }
};

export const unfollowProfile = async (id) => {
    try {
        console.log(`following profile ${id}`);
        const response = await axios.delete(`${BASE_URL}/profile/followers?userId=${id}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('following profile response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        console.log('follow failed', err);
    }
};

export const fetchFollowers = async (userId) => {
    try {
        console.log('fetching followers...');
        const response = await axios.get(`${BASE_URL}/profile/followers?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log('Fetch followers failed', err);
    }
};

export const fetchFollows = async (userId) => {
    try {
        console.log('fetching follows...');
        const response = await axios.get(`${BASE_URL}/profile/follows?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log('Fetch follows failed', err);
    }
};

export const fetchUserProfile = async (userId) => {
    try {
        console.log(`Fetching profile for user ${userId}...`);
        const response = await axios.get(`${BASE_URL}/users/${userId}`);
        return response?.data;
    } catch (err) {
        console.error("Failed to fetch user profile", err);
    }
};

export const updateUserProfile = async (updatedData) => {
    try {
        console.log(`updating profile data ${JSON.stringify(updatedData)}`);
        const response = await axios.put(`${BASE_URL}/profile`, updatedData, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('update profile response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (error) {
        switch (error.response.status) {
            default: {
                break;
            }
            case 400:{
                getDataService().setUserNameTakenError();
                break;
            }
        }
        console.error(error);
        throw error;
    }
};