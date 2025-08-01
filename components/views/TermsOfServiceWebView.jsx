import React from 'react';
import { SafeAreaView } from 'react-native';
import { WebView } from 'react-native-webview';

const TermsOfServiceWebView = () => (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <WebView source={{ uri: 'https://votum.beampie.com/terms-of-service' }} />
    </SafeAreaView>
);

export default TermsOfServiceWebView;