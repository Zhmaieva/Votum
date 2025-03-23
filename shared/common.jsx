import {Alert, Share} from "react-native";

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

    setUser(value) {
        this.user = value;
    }

    getUser() {
        return this.user;
    }
}
const service = new DataService()

export const getDataService = () => service;