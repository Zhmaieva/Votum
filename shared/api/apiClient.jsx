import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDataService, globalEventEmitter} from "../common";
import {BASE_URL} from "./constants";
import {useNavigation} from "@react-navigation/native";

let tokenValue = null;
// const hardcodedCredentials = {
//     login: 'zhmaievayuliia@google.com',
//     password: 'securepassword',
// };

// for Artem
// const hardcodedCredentials = {
//     login: 'testuser',
//     password: 'securepassword123',
// };

const getToken = async function() {
    return tokenValue ?? await AsyncStorage.getItem('auth_token');
}

export const isTokenAvailable = async function() {
    if (tokenValue || await AsyncStorage.getItem('auth_token'))
        return true;
    return false;
}

const resetToken = async function() {
    tokenValue = null;
    await AsyncStorage.removeItem('auth_token');
}

export async function signOut() {
    await resetToken();
    globalEventEmitter.emit('signOut');
}

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    //timeout: 10000, // Set timeout (optional)
    headers: { "Content-Type": "application/json" },
});

// Global response interceptor for handling errors
apiClient.interceptors.response.use(
    (response) => response, // Return the response if successful
    async (error) => {
        console.error("API Error:", error);

        if (error.response) {
            // The request was made and the server responded with a status code outside 2xx
            console.error("Response Data:", error.response.data);
            console.error("Status Code:", error.response.status);

            if (error.response.status === 401) {
                await signOut();
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received from server:", error.request);
        } else {
            // Something else happened
            console.error("Error:", error.message);
        }

        return Promise.reject(error); // Always reject so the caller can handle it too
    }
);

export const signIn = async (userNameOrEmail, password) => {
    try {
        const response = await apiClient.post(`/users/sign-in`, {
            login: userNameOrEmail,
            password: password,
        });
        const { token } = response.data;
        await AsyncStorage.setItem('auth_token', token); // Save token in AsyncStorage
        tokenValue = token;
        console.log('login successful');

        return true;
    } catch (err) {
        console.log('Login failed', err);
        return false;
    }
};

export const fetchMyProfile = async () => {
    try {
        console.log('Fetching profile...');
        const response = await apiClient.get(`/profile`, {
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
        const response = await apiClient.get(`/polls`, {
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
        const response = await apiClient.post(`/polls/like`, {
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
        const response = await apiClient.post(`/profile/followers`, {
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
        const response = await apiClient.delete(`/profile/followers?userId=${id}`, {
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
        const response = await apiClient.get(`/profile/followers?userId=${userId}`, {
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
        const response = await apiClient.get(`/profile/follows?userId=${userId}`, {
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
        const response = await apiClient.get(`/users/${userId}`);
        return response?.data;
    } catch (err) {
        console.error("Failed to fetch user profile", err);
    }
};

export const updateUserProfile = async (updatedData) => {
    try {
        console.log(`updating profile data ${JSON.stringify(updatedData)}`);
        const response = await apiClient.put(`/profile`, updatedData, {
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