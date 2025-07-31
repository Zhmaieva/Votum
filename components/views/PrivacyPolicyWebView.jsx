import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const PrivacyPolicyWebView = () => (
    <SafeAreaView style={{ flex: 1 }}>
        <WebView source={{ uri: 'https://yourdomain.com/privacy-policy' }} />
    </SafeAreaView>
);

export default PrivacyPolicyWebView;