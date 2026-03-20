import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getDataService, globalEventEmitter, Logger} from "../common";
import {BASE_URL} from "./api-constants";

let tokenValue = null;

const getToken = async function() {
    // await AsyncStorage.clear();
    // return;

    const token = tokenValue ?? await AsyncStorage.getItem('auth_token');
    const newUser = await AsyncStorage.getItem('existing_user');

    if (!token && !newUser) {
        const result = await signUpInstant();
        await AsyncStorage.setItem('existing_user', 'true');
        return result;
    }

    if (!newUser && token) {
        await AsyncStorage.setItem('existing_user', 'true');
    }

    return token;
}

export const isTokenAvailable = async function() {
    const token = await getToken();
    return !!token;
}

export const resetToken = async function() {
    tokenValue = null;
    await AsyncStorage.removeItem('auth_token');
}

export async function signOut(force = false) {
    globalEventEmitter.emit('signOut', {force});
}

// Create an Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // Set timeout (optional)
    headers: { "Content-Type": "application/json" },
});

// Global response interceptor for handling errors
apiClient.interceptors.response.use(
    (response) => response, // Return the response if successful
    async (error) => {
        console.log("API Error:", error);

        if (error.message === 'Network Error' || error.code === 'ENETUNREACH' || error.code === 'ERR_NETWORK') {
            globalEventEmitter.emit('requestTimeout');
            return Promise.reject(error);
        }

        if (error.code === 'ECONNABORTED') {
            const paramsStr = error.config?.params ? `?${qs.stringify(error.config.params)}` : '';
            const fullUrl = `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}${paramsStr}`;
            console.log("Request timed out:", fullUrl);

            globalEventEmitter.emit('requestTimeout');
            return Promise.reject(error);
        }

        if (error.response) {
            // The request was made and the server responded with a status code outside 2xx
            console.log("Response Data:", error.response.data);
            console.log("Status Code:", error.response.status);

            if (error.response.status === 401) {
                await signOut(true);
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

const signUpInstant = async () => {
    try {
        const response = await apiClient.post(`/profile/register-instant`);
        const { token } = response.data;
        await AsyncStorage.setItem('auth_token', token); // Save token in AsyncStorage
        tokenValue = token;

        console.log('Instant registration successful');

        return tokenValue;
    } catch (err) {
        console.log('Instant registration failed', err);
        return null;
    }
};

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

export const securityCheck = async (password) => {
    try {
        const response = await apiClient.post(`/users/security/verify`, {
            password: password,
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response.data.isSuccess;
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
 * @param email
 * @returns {Promise<{success: boolean, code: number?}>}
 */
export const forgotPassword = async (email) => {
    try {
        await apiClient.post(`/users/passwords/forgot`, {
            email: email
        });

        console.log('forgot password requested');

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
 * @param email
 * @returns {Promise<{success: boolean, code: number?}>}
 */
export const emailVerifyStart = async (email) => {
    try {
        await apiClient.post(`/users/email/verify`, {
            email: email
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        console.log('email verification requested');

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
export const emailVerifyCheck = async (email, code) => {
    try {
        const response = await apiClient.put(`/users/email/change/`, {
            email: email,
            code: code
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        if (response?.data?.success)
            return { success: true, code: 200 };

        return { success: false };
    } catch (err) {
        if (err.response && err.response.status) {
            return { success: false, code: err.response.status };
        }
        return { success: false };
    }
};

/**
 *
 * @returns {Promise<{success: boolean, code: number?}>}
 */
export const resetPassword = async (password) => {
    try {
        const response = await apiClient.post(`/users/passwords`, {
            password
        }, {
            headers: {
                Authorization: `Bearer ${await AsyncStorage.getItem('sign_in_auth_token')}`,
            },
        });

        console.log('password reset complete');

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

/**
 *
 * @returns {Promise<{success: boolean, code: number?}>}
 */
export const updatePassword = async (password) => {
    try {
        const response = await apiClient.put(`/users/passwords`, {
            password
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        console.log('password reset complete');

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
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

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
        return !(err.response && err.response.status === 409);
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
        return !(err.response && err.response.status === 409);
    }
};


/**
 *
 * @param {string} username
 * @param {string} password
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
    Logger.log('Uploading image...');

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
        Logger.log('fetching my profile');

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
        Logger.log('My profile failed', err);
    }
};

export const searchPolls = async (query, searchFlags) => {
    try {
        Logger.log('searching polls...');
        const response = await apiClient.get(`/polls/search?query=${query ?? ''}&searchFlags=${searchFlags}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log('Fetch failed', err);
    }
};

export const fetchPolls = async (pollId) => {
    try {
        Logger.log('fetching polls...', pollId);
        const response = await apiClient.get(`/polls?featuredId=${pollId ?? ''}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log('Fetch failed', err);
    }
};

export const fetchVotedPolls = async () => {
    try {
        Logger.log('fetching voted polls...');
        const response = await apiClient.get(`/polls/voted`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log('Fetch failed', err);
    }
};

export const pingServer = async () => {
    try {
        Logger.log('pinging server...');
        const res = await apiClient.get(`/ping`);
        return  res.status >= 200 && res.status < 300;
    } catch (err) {
        Logger.log('Fetch failed', err);
        return false;
    }
};

export const fetchTrendingPolls = async () => {
    try {
        Logger.log('fetching trending polls...');
        const response = await apiClient.get(`/polls/trending`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log('Fetch failed', err);
    }
};

export const fetchUserPolls = async (userId) => {
    try {
        Logger.log('fetching user polls...');
        const response = await apiClient.get(`user/${userId}/polls`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log('Fetch user failed', err);
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
        Logger.log('Poll share link:', link);
        return link;
    } catch (err) {
        Logger.log('Failed to fetch poll share link:', err.response?.data || err.message);
        return null;
    }
};

export const viewPoll = async (id) => {
    try {
        Logger.log(`viewing poll ${id}`);
        const response = await apiClient.post(`/polls/view`, {
            pollId: id
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log('View poll failed', err);
    }
};

export const likePoll = async (id) => {
    try {
        Logger.log(`liking poll ${id}`);
        const response = await apiClient.post(`/polls/like`, {
            pollId: id
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('like polls response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        Logger.log('Like failed', err);
    }
};

export const unlikePoll = async (id) => {
    try {
        Logger.log(`unliking poll ${id}`);
        const response = await apiClient.delete(`/polls/like?pollId=${id}`,{
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('unlike polls response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        Logger.log('unlike failed', err);
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
        Logger.log(`creating poll`);
        const response = await apiClient.post(`/polls`,{
            question,
            options,
            duration
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('create poll response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        Logger.log('create failed', err);
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

        Logger.log('vote on poll response:', response.data);
        return { success: true };
    } catch (err) {
        Logger.log('vote failed:', err.response?.data || err.message);
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
        if (!await getToken())
            return null;

        const response = await apiClient.get(`/polls/${pollId}/options`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data ?? null;
    } catch (err) {
        Logger.log('Failed to fetch poll options:', err);
        throw err;
    }
};


export const deletePoll = async (id) => {
    try {
        Logger.log(`deleting poll ${id}`);
        const response = await apiClient.delete(`/polls?pollId=${id}`,{
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('delete poll response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        Logger.log('delete failed', err);
    }
};

export const setUserCategories = async (categoryIds) => {
    try {
        Logger.log(`Setting categories: ${categoryIds.join(', ')}`);
        const response = await apiClient.post(`/profile/categories`, {
            categories: categoryIds,
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('Set categories response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        Logger.log('Setting categories failed', err);
    }
};

export const followProfile = async (id, navigation) => {
    try {
        if (navigation && getDataService().isAnonymous()) {
            navigation.navigate('Auth'); // push auth stack
            return false;
        }

        Logger.log(`following profile ${id}`);
        const response = await apiClient.post(`/profile/followers`, {
            userId: id
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('following profile response: ' + JSON.stringify(response.data));
        return response?.data || {};
    } catch (err) {
        Logger.log('follow failed', err);
    }
};

export const unfollowProfile = async (id) => {
    try {
        Logger.log(`unfollowing profile ${id}`);
        const response = await apiClient.delete(`/profile/followers?userId=${id}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('unfollowing profile response: ' + JSON.stringify(response.data));
        return response?.data || {};
    } catch (err) {
        Logger.log('unfollow failed', err);
    }
};

export const fetchFollowers = async (userId) => {
    try {
        Logger.log('fetching followers...');
        const response = await apiClient.get(`/profile/followers?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log('Fetch followers failed', err);
    }
};

export const fetchFollows = async (userId) => {
    try {
        Logger.log('fetching follows...');
        const response = await apiClient.get(`/profile/follows?userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log('Fetch follows failed', err);
    }
};

export const fetchUserProfile = async (userId) => {
    try {
        Logger.log(`Fetching profile for user ${userId}...`);
        const response = await apiClient.get(`/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log("Failed to fetch user profile", err);
    }
};

export const REPORT_TYPE = {
    BUG: 0,
    POLL: 1
}

/**
 * Report an activity
 * @param description
 * @param relatedEntityId
 * @param reportType REPORT_TYPE
 * @returns {Promise<void>}
 */
export const reportActivity = async (description, relatedEntityId, reportType) => {
    try {
        if (!(await isTokenAvailable())) {
            return;
        }

        Logger.log(`reportActivity: ${description}`);

        await apiClient.post(`/activity-reports`, {
            description: description,
            reportType: reportType,
            relatedEntityId: relatedEntityId
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
    } catch (err) {
        Logger.log(`Failed to report activity ${JSON.stringify({description, relatedEntityId, reportType})}`, err);
    }
}

export const writeDebugLog = async (log) => {
    try {
        if (!(await isTokenAvailable())) {
            return;
        }

        const response = await apiClient.post(`/debug/log`, {
            log: log,
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
    } catch (err) {
        console.log("Failed to write debug log", err);
    }
}

export const updateNotificationPreferences = async () => {
    try {
        Logger.log('update notification preferences');

        const response = await apiClient.put(`/user/notifications`, {
            is_new_followers_notification_enabled: getDataService()?.getUser()?.is_new_followers_notification_enabled ?? false
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log("Failed to update notification settings", err);
    }
};

export const updateBirthdate = async () => {
    try {
        Logger.log('update birthdate');

        const response = await apiClient.put(`/profile/birthdate`, {
            birthdate: getDataService()?.getUser()?.birthdate
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return !!response?.data;
    } catch (err) {
        Logger.log("Failed to update birthdate", err);
        return false;
    }
};

export const updateGender = async () => {
    try {
        Logger.log('update gender');

        const response = await apiClient.put(`/profile/gender`, {
            gender: getDataService()?.getUser()?.gender ?? 0
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data;
    } catch (err) {
        Logger.log("Failed to update gender", err);
    }
};

export const updatePushToken = async (token) => {
    try {
        Logger.log('update push token', token);

        if (!(await isTokenAvailable())) {
            Logger.log('token is not available', token);
            return;
        }

        const offsetInHours = -new Date().getTimezoneOffset() / 60;
        const response = await apiClient.put(`/user/token`, {
            token: token,
            timezoneOffset: offsetInHours,
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return !!response?.data;
    } catch (err) {
        Logger.log("Failed to update push token", err);
        return false;
    }
};

/**
 * Fetches notifications for the current user.
 * @returns {Promise<Array>} Array of notifications
 */
export const fetchUserNotifications = async () => {
    try {
        Logger.log('fetching user notifications');
        const response = await apiClient.get(`/profile/notifications`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        return response?.data?.notifications || [];
    } catch (err) {
        Logger.log("Failed to fetch user notifications", err);
        return [];
    }
};

/**
 * Marks the given notifications as read.
 * @param {Array<string>} notificationIds
 * @returns {Promise<void>}
 */
export const markNotificationsAsRead = async (notificationIds) => {
    try {
        Logger.log('Marking notifications read...');
        await apiClient.put(`/profile/notifications`, {
            notificationIds,
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
    } catch (err) {
        Logger.log("Failed to mark notifications as read", err);
    }
};

/**
 * Deletes all notifications for the current user.
 * @returns {Promise<void>}
 */
export const deleteAllUserNotifications = async () => {
    try {
        Logger.log('deleting all notifications...');

        await apiClient.delete(`/profile/notifications`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
    } catch (err) {
        Logger.log("Failed to delete notifications", err);
    }
};

export const updateUserProfile = async (updatedData) => {
    try {
        Logger.log(`updating profile data ${JSON.stringify(updatedData)}`);
        const response = await apiClient.put(`/profile`, updatedData, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('update profile response: ' + JSON.stringify(response.data));
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
        Logger.log(error);
        throw error;
    }
};

export const deleteUserProfile = async (password) => {
    try {
        Logger.log(`deleting user`);
        const response = await apiClient.delete(`/users?password=${password}`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        Logger.log('delete user response: ' + JSON.stringify(response.data));

        return true;
    } catch (error) {
        Logger.log(error);
        return false;
    }
};

export const addComment = async (pollId, text) => {
    try {
        Logger.log(`adding poll comment...`);
        const response = await apiClient.post(`/polls/${pollId}/comments`, {
            comment: text
        }, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        return response?.data;
    } catch (error) {
        Logger.log(error);
        return false;
    }
}

export const getComments = async (pollId) => {
    try {
        Logger.log(`getting poll comments...`);
        const response = await apiClient.get(`/polls/${pollId}/comments`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });

        return response?.data ?? [];
    } catch (error) {
        Logger.log(error);
        return [];
    }
}

export const checkIfPollExists = async (pollId) => {
    try {
        const res = await apiClient.get(`/polls/${pollId}`); // or whatever your route is
        return !!res?.data;
    } catch (e) {
        return false;
    }
};
