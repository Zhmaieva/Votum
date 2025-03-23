import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const BASE_URL = "http://192.168.1.224:3000";

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

// Function to retry login if auth fails
const retryLogin = async () => {
    const storedToken = await AsyncStorage.getItem('auth_token');
    if (storedToken && !tokenValue) {
        tokenValue = storedToken;
    } else {
        //await login(); // Trigger login if no token is stored
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
        console.log('My profile failed, retrying login...', err);
        await retryLogin();
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
        console.log('Fetch failed, retrying login...', err);
        await retryLogin();
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
        console.log('Like failed, retrying login...', err);
        await retryLogin();
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
        console.error(error);
    }
};