import {View, StyleSheet, Animated, Dimensions, Image, Text, Platform} from 'react-native';
import AwesomePollPublishingLoader from './AwesomePollPublishingLoader';
import {Colors, Fonts} from "../../utils/colorUtils";

const PublishingScreen = ({ navigation }) => {
    const handleComplete = () => {
        navigation.replace('SuccessScreen');
    };

    return (
        <View>
            <Text style={styles.textStyle}>Publishing your poll</Text>
            <AwesomePollPublishingLoader onComplete={handleComplete} />
        </View>);
    };

const styles = StyleSheet.create({
    textStyle: Fonts.regular,
    fontSize: Platform.OS === 'ios' ? 20 : 16,
});