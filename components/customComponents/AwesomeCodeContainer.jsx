import { TextInput, View, StyleSheet } from 'react-native';
import { Fonts } from '../../utils/colorUtils';

export default function AwesomeCodeContainer({ value, onTextInput, refOutlet, onKeyPress, maxLength = 6 }) {
    return (
        <View style={styles.codeInputContainer}>
            <TextInput
                editable
                value={value}
                ref={refOutlet}
                numberOfLines={1}
                maxLength={maxLength}
                style={styles.codeInputField}
                onChangeText={onTextInput}
                onKeyPress={onKeyPress}
                keyboardType='number-pad'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    codeInputContainer: {
        width: 50,
        height: 50,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: 'black',
    },
    codeInputField: {
        flex:1,
        alignItems:'center',
        paddingLeft: 19,
        fontSize: 18,
        fontFamily: Fonts.regular
    }
});