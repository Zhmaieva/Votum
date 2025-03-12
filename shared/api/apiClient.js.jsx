import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let tokenValue = null;

export const getToken = async function() {
    return tokenValue ?? await AsyncStorage.getItem('auth_token');
}

export const isLoggedIn = async function() {
    return await AsyncStorage.getItem('auth_token');
}

setTimeout(async () => {
    await AsyncStorage.clear();
}, 5000)

const hardcodedCredentials = {
    login: 'test@example.com',
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
        await login(); // Trigger login if no token is stored
    }
};

export const fetchProfile = async () => {
    try {
        console.log('fetching profile...');
        const response = await axios.get(`${BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${await getToken()}`,
            },
        });
        console.log('fetch user response: ' + JSON.stringify(response.data));
        return response?.data;
    } catch (err) {
        console.log('Auth failed, retrying login...', err);
        await retryLogin();
    }
};