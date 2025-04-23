import {Alert, Share} from "react-native";
import mitt from 'mitt';
import {getPollShareLink} from "./api/apiClient";

export const globalEventEmitter = new mitt();

export const onShare = async (pollId) => {
    try {
        const link = await getPollShareLink(pollId);

        const result = await Share.share({
            message: link,
        });
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // shared with activity type of result.activityType
            } else {
                // shared
            }
        } else if (result.action === Share.dismissedAction) {
            // dismissed
        }
    } catch (error) {
        Alert.alert(error.message);
    }
};

export const calculateTimeDifference = (dateString) => {
    const now = new Date();
    const targetDate = new Date(dateString);
    return targetDate - now;
};

// An object serving as a temporary local data storage to exchange between components
// Resets when app does so
class DataService {
    user = null;
    oldUser = null;

    error = {
        usernameTaken: false,
        usernameEmpty: false
    };

    setUser(value) {
        this.user = value;
        this.oldUser = { ...value };
    }

    getUser() {
        return this.user;
    }

    setUserNameTakenError() {
        this.resetErrors();
        this.error.usernameTaken = true;
        globalEventEmitter.emit('errorChanged', { ...this.error }); // Ensure the object is passed
    }

    setUserNameEmptyError() {
        this.resetErrors();
        this.error.usernameEmpty = true;
        globalEventEmitter.emit('errorChanged', { ...this.error }); // Ensure the object is passed
    }

    resetErrors() {
        this.error = {
            usernameTaken: false,
            usernameEmpty: false
        };
    }

    resetUserChanges() {
        if (this.user && this.oldUser) {
            this.user = { ...this.oldUser };
            this.resetErrors();
        }
    }

    commitUserChanges() {
        this.oldUser = { ...this.user };
    }

    validateUsername() {
        if (!this.user?.username?.trim()) {
            this.setUserNameEmptyError();
            return false;
        }
        return true;
    }
}
const service = new DataService()

export const getDataService = () => service;