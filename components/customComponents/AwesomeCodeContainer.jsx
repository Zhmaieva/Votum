import { TextInput, View, StyleSheet } from 'react-native';

export default function AwesomeCodeContainer ({value, onTextInput, refOutlet}) {

    return (
        <View style={styles.codeInputContainer}>
            <TextInput
                editable
                value={value}
                ref = {refOutlet}
                numberOfLines={1}
                maxLength={1}
                style={styles.codeInputField}
                onChangeText={onTextInput}
                keyboardType='numeric'
            />
        </View>
    );
}

const styles = StyleSheet.create({
    codeInputContainer: {
        width: 52,
        height: 52,
        //backgroundColor: 'pink',
        borderRadius: 0,
        borderWidth: 1,
        borderColor: 'black',
    },
    codeInputField: {
        flex:1,
        alignItems:'center',
        paddingLeft: 20,
        fontSize: 18
    }
});