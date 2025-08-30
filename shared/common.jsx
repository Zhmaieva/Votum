import {Alert, Share} from "react-native";
import mitt from 'mitt';
import {fetchMyProfile, fetchPolls, fetchTrendingPolls, getPollShareLink, writeDebugLog} from "./api/apiClient";

export const MIN_LOADING_TIME = 1000;
export const MIN_EXTRA_LOADING_TIME = 800;

export const globalEventEmitter = new mitt();

export const Logger = {
    warn: (log) => {
        console.warn(log);
        if (getDataService().getUser()?.is_debug ?? false)
            writeDebugLog(log).then(_ => {});
    },
    error: (log, templateValue = '') => {
        if (templateValue)
            console.error(log, templateValue);
        else
            console.error(log);
        if (getDataService().getUser()?.is_debug ?? false)
            writeDebugLog(`${log} ${templateValue}`).then(_ => {});
    },
    log: (log, templateValue = '') => {
        if (templateValue)
            console.log(log, templateValue);
        else
            console.log(log);
        if (getDataService().getUser()?.is_debug ?? false)
            writeDebugLog(`${log} ${templateValue}`).then(_ => {});
    }
}

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

export class Loader {

    loaded = false;
    loading = false;

    constructor(onLoadingChange) {
        this.onLoadingChange = onLoadingChange;
    }

    __setLoading(value) {
        this.loading = value;
        this.onLoadingChange(value);
    }

    __handleLoading = async (startTime)=> {
        this.loaded = true;
        const elapsed = Date.now() - startTime;
        console.log('elapsed', elapsed);
        let delay = Math.max(0, elapsed - MIN_LOADING_TIME);
        if (delay > 0) {
            this.__setLoading(true);
            delay = MIN_EXTRA_LOADING_TIME;
            setTimeout(() => {
                this.__setLoading(false);
            }, delay);
        }
        this.__setLoading(false);
    }

    __scheduleLoading = async () => {
        this.loaded = false;
        setTimeout(() => {
            if (!this.loaded) {
                this.__setLoading(true);
            }
        }, MIN_LOADING_TIME);
    }

    async load(promises) {
        const startTime = Date.now();

        await this.__scheduleLoading();

        // Simulate loading globally
        //promises = promises.concat([new Promise(resolve => setTimeout(resolve, 1000))])

        Promise.all(promises).then(async _ => {
            await this.__handleLoading(startTime);
        })
    }
}

// An object serving as a temporary local data storage to exchange between components
// Resets when app does so
class DataService {
    user = null;
    oldUser = null;
    allowOfflineSwitch = true;
    emailToSet = '';

    error = {
        usernameTaken: false,
        usernameEmpty: false
    };

    getEmailToSet = () => this.emailToSet;
    setEmailToSet = (value) => {this.emailToSet = value};

    getAllowOfflineSwitch = () => this.allowOfflineSwitch;
    setAllowOfflineSwitch = (value) => {
        console.log('setAllowOfflineSwitch', value);
        this.allowOfflineSwitch = value;
    }

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

    isFetchingPolls = false;
    async getMorePolls() {
        let result = [];
        if (this.isFetchingPolls)
            return result;
        this.isFetchingPolls = true;
        try {
            result = await fetchPolls();
        } catch {} finally {
            setTimeout(() => { // let fetched polls be processed before fetching more
                this.isFetchingPolls = false;
            }, 200);

            return result;
        }
    }
}
const service = new DataService()

export const getDataService = () => service;