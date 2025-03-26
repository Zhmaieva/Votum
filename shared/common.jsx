import {Alert, Share} from "react-native";
import mitt from 'mitt';

export const globalEventEmitter = new mitt();

export const onShare = async () => {
    try {
        const result = await Share.share({
            message:
                'here is a link',
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

// An object serving as a temporary local data storage to exchange between components
// Resets when app does so
class DataService {
    user = null;
    oldUser = null;

    error = {
        userNameTaken: false,
        userNameEmpty: false
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
        this.error.userNameTaken = true;
        globalEventEmitter.emit('errorChanged', { ...this.error }); // Ensure the object is passed
    }

    setUserNameEmptyError() {
        this.resetErrors();
        this.error.userNameEmpty = true;
        globalEventEmitter.emit('errorChanged', { ...this.error }); // Ensure the object is passed
    }

    resetErrors() {
        this.error = {
            userNameTaken: false,
            userNameEmpty: false
        };
    }

    resetUserChanges() {
        if (this.user && this.oldUser) {
            this.user = { ...this.oldUser };
        }
    }

    commitUserChanges() {
        this.oldUser = { ...this.user };
    }

    validateUsername() {
        if (!this.user?.userName?.trim()) {
            this.setUserNameEmptyError();
            return false;
        }
        return true;
    }
}
const service = new DataService()

export const getDataService = () => service;