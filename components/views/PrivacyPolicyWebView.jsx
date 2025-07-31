import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const PrivacyPolicyWebView = () => (
    <SafeAreaView style={{ flex: 1 }}>
        <WebView source={{ uri: 'https://votum.beampie.com/policy' }} />
    </SafeAreaView>
);

export default PrivacyPolicyWebView;