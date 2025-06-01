import { Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';

export default function AwesomeCategory ({ categoryName, size = 18, isSelected, onPress, noShadow = false }) {
    const containerStyle = [
        styles.tagBase,
        isSelected ? styles.tagSelected : styles.tagDefault,
        styles.row,
        !noShadow && styles.shadow,
    ];

    const textStyle = [
        isSelected ? styles.textSelected : styles.textDefault,
        { fontSize: size }, // <== dynamic font size
    ];

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
        paddingLeft: 2,
    },
    textDefault: {
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    textSelected: {
        color: Colors.white,
        fontFamily: Fonts.regular,
    },
    tagText: {
        marginLeft: 11,
        marginRight: 11,
        marginTop: 7,
        marginBottom: 7,
        fontFamily: Fonts.regular,
    },
    row: {
        flexDirection: 'row',
    },
});