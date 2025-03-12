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