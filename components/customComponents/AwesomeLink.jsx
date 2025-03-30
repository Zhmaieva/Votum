import {Text, StyleSheet, Pressable} from 'react-native';
import { navigationRef } from './NavigationRefContainer.js';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/colorUtils';

export default function AwesomeLink({text, screenName}) {

    const navigation = useNavigation();

    function onPressHandler() {
        navigation.navigate(screenName)
    }

    return (
        <Pressable style={styles.linkContainer} onPress={onPressHandler} >
            <Text style={styles.linkMainText}>{text}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    linkContainer:{
        width: 'auto',
        paddingLeft: 5,
        paddingRight: 5,
    },
    linkMainText: {
        color: Colors.black,
        fontSize: 16,
        fontWeight: '500',
    },
});