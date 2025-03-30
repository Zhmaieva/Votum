import { TextInput, View, StyleSheet, Text } from 'react-native';
import {useState, useRef, forwardRef} from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../utils/colorUtils';

const AwesomePasswordInput = forwardRef((props, inputRef) => {
    // State variable to hold the password
    const [password, setPassword] = useState('');

    // State variable to track password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Function to toggle the password visibility state
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const [validationErrorMessage, setValidationErrorMessage] = useState('');

    // const inputRef = useRef(null);

    const handleFocusInput = () => {
        if (inputRef.current && password.length<1) {
            inputRef.current.focus();
        }
    };

    const validation = function (text) {
        setPassword(text);
        if ( password?.length < 8 || password?.length > 21) {
            setValidationErrorMessage('Your password must be 8-20 characters');
            //props.onValidChange(false);
        }
        else {
            setValidationErrorMessage('');
            //props.onValidChange(true);
        }
    }

    return (
        <View>
            <View style={styles.passwordContainer}>
                <TextInput
                    // Set secureTextEntry prop to hide
                    //password when showPassword is false
                    ref={inputRef}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={(text)=>validation(text)}
                    style={styles.input}
                    placeholder='password'
                    placeholderTextColor="#aaa"

                />
                <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.grey}
                    style={styles.icon}
                    onPress={toggleShowPassword}
                />
            </View>
            <Text style={styles.redFont}>{validationErrorMessage}</Text>
        </View>
    );
});

export default AwesomePasswordInput;

const styles = StyleSheet.create({
    passwordContainer: {
        paddingLeft: 3,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.grey,
        height: 40,
        backgroundColor: Colors.white,
        paddingEnd: 4
    },
    input: {
        flex: 1,
        borderBottomColor: '#aaa',
        color: Colors.black,
        paddingVertical: 10,
        paddingRight: 10,
        paddingLeft: 8,
        fontSize: 14,
        width: '100%',
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginLeft: 10,
    },
    redFont: {
        marginTop: 2,
        marginLeft: 10,
        fontSize: 12,
        color: Colors.red,
    }
});