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
        userNameTaken: false
    };

    setUser(value) {
        this.user = value;
        this.oldUser = Object.assign({}, value);
    }

    getUser() {
        return this.user;
    }

    setUserNameTakenError() {
        this.error.userNameTaken = true;
        globalEventEmitter.emit('errorChanged', this.error);
    }

    resetErrors() {
        this.error.userNameTaken = false;
    }

    resetUserChanges() {
        if (this.user && this.oldUser)
            this.user = Object.assign({}, this.oldUser);
    }

    commitUserChanges() {
        this.oldUser = Object.assign({}, this.user);
    }
}
const service = new DataService()

export const getDataService = () => service;