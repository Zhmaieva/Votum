import { Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '../../utils/colorUtils';

export default function AwesomeCategory ({ categoryName, size = 18, iconName, isSelected, onPress }) {
    const containerStyle = [
        styles.tagBase,
        isSelected ? styles.tagSelected : styles.tagDefault,
        styles.row,
        styles.shadow,
    ];

    const textStyle = isSelected ? styles.textSelected : styles.textDefault;
    const iconColor = isSelected ? 'white' : 'black';

    return (
        <Pressable onPress={onPress} style={containerStyle}>
            <Text style={[textStyle, styles.tagText]}>{categoryName}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    tagBase: {
        borderColor: Colors.black,
        borderWidth: 1,
        borderRadius: 0,
        marginRight: 10,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tagDefault: {
        backgroundColor: Colors.white,
    },
    tagSelected: {
        backgroundColor: Colors.black,
    },
    shadow: {
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowColor: Colors.green,
        paddingLeft: 2
    },
    textDefault: {
        color: Colors.black,
    },
    textSelected: {
        color: Colors.white,
    },
    tagText: {
        fontSize: 14,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 5,
        marginBottom: 5
    },
    row: {
        flexDirection: 'row',
    },
});
