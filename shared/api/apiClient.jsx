import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDataService, globalEventEmitter} from "../common";
import {BASE_URL} from "./api-constants";

let tokenValue = null;

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
        console.log("API Error:", error);

        if (error.response) {
            // The request was made and the server responded with a status code outside 2xx
            console.log("Response Data:", error.response.data);
            console.log("Status Code:", error.response.status);

            if (error.response.status === 401) {
                await signOut();
            }

            if (error.response.status >= 500) {
                //TODO: handle server errors globally in App.js
            }
        } else if (error.request) {
            // The request was made but no response was received
            console.log("No response received from server:", error.request);
            //TODO: handle server errors globally in App.js
        } else {
            // Something else happened
            console.log("Error:", error.message);
            //TODO: handle server errors globally in App.js
        }

        return Promise.reject(error); // Always reject so the caller can handle it too
    }
);

export const signIn = async (usernameOrEmail, password) => {
    try {
        const response = await apiClient.post(`/users/sign-in`, {
            login: usernameOrEmail,
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
 * @param {string} usernameOrEmail
 * @returns {Promise<boolean>}
 */
export const checkUsernameAvailability = async (usernameOrEmail) => {
    try {
        await apiClient.get(`/users?username=${usernameOrEmail}`, {
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
 * Check if there is a user with the username (for registered users only)
 * @param {string} username
 * @returns {Promise<boolean>}
 */
export const checkRegisteredUsernameAvailability = async (username) => {
    try {
        await apiClient.get(`/users/registered?username=${username}`, {
            headers: {
                Authorization: `Bearer ${await AsyncStorage.getItem('auth_token')}`,
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
    } catch (err) {
        console.log(err);
    }
};

export const fetchMyProfile = async () => {
    try {
        console.log('fetching my profile');
        const response = await apiClient.get(`/profile`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        const userProfile = response?.data;

        if (!userProfile) {
            throw new Error("User profile not found");
        }

        // Ensure the bio field is present
        return {
            ...userProfile,
            bio: userProfile.bio || "bio here", // Fallback if bio is null or undefined
        };
    } catch (err) {
        console.log('My profile failed', err);
    }
};

export const searchPolls = async (query) => {
    try {
        console.log('searching polls...');
        const response = await apiClient.get(`/polls/search?query=${query ?? ''}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log('Fetch failed', err);
    }
};

export const fetchPolls = async (postId) => {
    try {
        console.log('fetching polls...');
        const response = await apiClient.get(`/polls?featuredId=${postId ?? ''}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log('Fetch failed', err);
    }
};

export const fetchLikedPolls = async () => {
    try {
        console.log('fetching liked polls...');
        const response = await apiClient.get(`/polls/liked`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log('Fetch failed', err);
    }
};

export const fetchTrendingPolls = async () => {
    try {
        console.log('fetching trending polls...');
        const response = await apiClient.get(`/polls/trending`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log('Fetch failed', err);
    }
};

export const fetchUserPolls = async (userId) => {
    try {
        console.log('fetching polls...');
        const response = await apiClient.get(`user/${userId}/polls`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log('Fetch failed', err);
    }
};

export const getPollShareLink = async (pollId) => {
    try {
        const response = await apiClient.get(`/polls/${pollId}/links`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        const { link } = response?.data || {};
        console.log('Poll share link:', link);
        return link;
    } catch (err) {
        console.log('Failed to fetch poll share link:', err.response?.data || err.message);
        return null;
    }
};

export const viewPollRequest = async (id) => {
    try {
        console.log(`viewing poll ${id}`);
        const response = await apiClient.post(`/polls/view`, {
            pollId: id
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log('Like failed', err);
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

export const unlikePoll = async (id) => {
    try {
        console.log(`liking poll ${id}`);
        const response = await apiClient.delete(`/polls/like?pollId=${id}`,{
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('unlike polls response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        console.log('Like failed', err);
    }
};

export const durationMap = {
    '1h': '1 hour',
    '1d': '1 day',
    '1w': '1 week',
    '1m': '1 month',
};

/**
 * Creates a new poll with 2 to 4 answer options.
 * @param {string} question - The poll question
 * @param {string[]} options - Array of 2 to 4 answer texts
 * @param {'1h' | '1d' | '1w' | '1m'} duration - Time until expiration
 * @returns {Promise<{ pollId: string }>}
 */
export const createPoll = async (question, options, duration) => {
    try {
        console.log(`creating poll`);
        const response = await apiClient.post(`/polls`,{
            question,
            options,
            duration
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('create poll response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        console.log('create failed', err);
    }
};

/**
 * Votes on a poll option.
 * @param {string} optionId - The ID of the selected poll answer option.
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export const voteOnPoll = async (optionId) => {
    try {
        const response = await apiClient.post(`/polls/options`, {
            optionId
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        console.log('vote on poll response:', response.data);
        return { success: true };
    } catch (err) {
        console.log('vote failed:', err.response?.data || err.message);
        return {
            success: false,
            error: err.response?.data?.error || err.message,
        };
    }
};

/**
 * Fetches poll options for a specific poll
 * @param {string} pollId - The ID of the poll
 * @returns {Promise<{ text: string, votesCount: number }[] | null>}
 */
export const getPollOptions = async (pollId) => {
    try {
        const response = await apiClient.get(`/polls/${pollId}/options`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data ?? null;
    } catch (err) {
        console.log('Failed to fetch poll options:', err);
        return null;
    }
};


export const deletePoll = async (id) => {
    try {
        console.log(`deleting poll ${id}`);
        const response = await apiClient.delete(`/polls?pollId=${id}`,{
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('delete poll response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        console.log('delete failed', err);
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
        console.log('unfollowing profile response: ' + JSON.stringify(response.data));
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
        const response = await apiClient.get(`/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        console.log("Failed to fetch user profile", err);
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
        console.log(error);
        throw error;
    }
};

export const deleteUserProfile = async (password) => {
    try {
        console.log(`deleting user`);
        const response = await apiClient.delete(`/user?password=${password}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.info('delete user response: ' + JSON.stringify(response.data));

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};