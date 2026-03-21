import { AppEventsLogger, Settings } from 'react-native-fbsdk-next';
import { requestTrackingPermissionsAsync, getTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Platform } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getDataService} from "./common";

class AnalyticsService {
    _permissionChecked = false;
    _isAuthorized = false;
    _initPromise = null;

    init() {
        this._initPromise = new Promise((resolve) => {
            try {
                Settings.initializeSDK();
                console.log('Analytics.init success');
            } catch (e) {
                console.error('Analytics.init failed:', e);
            } finally {
                resolve();
            }
        });
    }

    async _ensurePermission() {
        if (this._initPromise) await this._initPromise;
        if (this._permissionChecked) return this._isAuthorized;

        try {
            if (Platform.OS === 'ios') {
                const { status } = await getTrackingPermissionsAsync();
                if (status === 'undetermined') {
                    const { status: requested } = await requestTrackingPermissionsAsync();
                    this._isAuthorized = requested === 'granted';
                } else {
                    this._isAuthorized = status === 'granted';
                }
            } else {
                this._isAuthorized = true;
            }

            Settings.setAdvertiserTrackingEnabled(this._isAuthorized);
            console.log('Analytics authorization status:', this._isAuthorized);
        } catch (e) {
            console.error('Analytics._ensurePermission failed:', e);
            this._isAuthorized = false;
        }

        this._permissionChecked = true;
        return this._isAuthorized;
    }

    async trackRegistration() {
        const isRegisteredUser = getDataService().getUser() && !getDataService().isAnonymous();
        if (!isRegisteredUser) return;

        await this.track(
            AppEventsLogger.AppEvents.CompletedRegistration,
            { [AppEventsLogger.AppEventParams.RegistrationMethod]: 'email' },
            'registration'
        );
    }

    async track(eventName, params = {}, onceKey = null) {
        try {
            if (onceKey) {
                const alreadyTracked = await AsyncStorage.getItem(`analytics_${onceKey}`) === 'true';
                if (alreadyTracked) return;
            }

            await this._ensurePermission();
            AppEventsLogger.logEvent(eventName, params);

            if (onceKey) {
                await AsyncStorage.setItem(`analytics_${onceKey}`, 'true');
            }

            console.log('Analytics tracked:', eventName);
        } catch (e) {
            console.error('Analytics.track failed:', e);
        }
    }
}

export const Analytics = new AnalyticsService();