import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDataService, globalEventEmitter} from "../common";
import {BASE_URL} from "./api-constants";
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

            if (error.response.status >= 500) {
                //TODO: handle server errors globally in App.js
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received from server:", error.request);
            //TODO: handle server errors globally in App.js
        } else {
            // Something else happened
            console.error("Error:", error.message);
            //TODO: handle server errors globally in App.js
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

/**
 *
 * @param email
 * @returns {Promise<{success: boolean, code: number?}>}
 */
export const signUpStart = async (email) => {
    try {
        await apiClient.post(`/users/register`, {
            email: email
        });

        console.log('registration start successful');

        return { success: true, code: 200 };
    } catch (err) {
        if (err.response && err.response.status) {
            return { success: false, code: err.response.status };
        }
        return { success: false };
    }
};

/**
 *
 * @param {string} email
 * @param {string} code
 * @returns {Promise<{success: boolean, code: number?}>}
 */
export const signUpVerify = async (email, code) => {
    try {
        const response = await apiClient.post(`/user/register/verify`, {
            email: email,
            code: code
        });

        console.log('email verification successful');

        const { token } = response.data;
        await AsyncStorage.setItem('sign_in_auth_token', token); // Save temp token in AsyncStorage

        return { success: true, code: 200 };
    } catch (err) {
        if (err.response && err.response.status) {
            return { success: false, code: err.response.status };
        }
        return { success: false };
    }
};

/**
 * Check if there is a user with the username
 * @param {string} userNameOrEmail
 * @returns {Promise<boolean>}
 */
export const checkUsernameAvailability = async (userNameOrEmail) => {
    try {
        await apiClient.get(`/users?username=${userNameOrEmail}`, {
            headers: {
                Authorization: `Bearer ${await AsyncStorage.getItem('sign_in_auth_token')}`,
            },
        });

        return true;
    } catch (err) {
        if (err.response && err.response.status === 409) {
            return false;
        }
        return true;
    }
};


/**
 *
 * @param {string} email
 * @param {string} code
 * @returns {Promise<{success: boolean, code: number?}>}
 */
export const signUpFinish = async (username, password) => {
    try {
        const response = await apiClient.post(`/profile/register`, {
            username: username,
            password: password
        }, {
            headers: {
                Authorization: `Bearer ${await AsyncStorage.getItem('sign_in_auth_token')}`,
            },
        });

        console.log('registration complete');

        const { token } = response.data;
        await AsyncStorage.removeItem('sign_in_auth_token'); // Save token in AsyncStorage
        await AsyncStorage.setItem('auth_token', token); // Save token in AsyncStorage
        tokenValue = token;

        return { success: true, code: 200 };
    } catch (err) {
        console.log(err);
        if (err.response && err.response.status) {
            return { success: false, code: err.response.status };
        }
        return { success: false };
    }
};

export const uploadProfileImage = async (image) => {
    const formData = new FormData();
    formData.append('file', {
        uri: image.uri,
        name: 'profile.jpg',
        type: image.type || 'image/jpeg',
    });

    try {
        await apiClient.post(`/profile/image`, formData, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log('upload successful');
    } catch (err) {
        console.log(err);
    }
};

export const fetchMyProfile = async () => {
    try {
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