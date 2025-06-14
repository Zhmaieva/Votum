import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AwesomePollPublishingLoader from "../customComponents/AwesomePollPublishingLoader";
import { useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import {Colors} from "../../utils/colorUtils";

export default function IntermediatePage() {
    const route = useRoute();
    const navigation = useNavigation();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Profile', {
                userId: route.params?.userId, // passed from handlePublish
            });
        }, 3000); // adjust to your animation length

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/animations/loader.json')}
                autoPlay
                loop
                style={styles.lottie}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
    lottie: { width: 200, height: 200 }, // adjust size as needed
});
