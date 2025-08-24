import { Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Colors, Fonts } from '../../utils/colorUtils';
import { Shadow } from 'react-native-shadow-2';

export default function AwesomeCategory({
                                            categoryName,
                                            size = 18,
                                            isSelected,
                                            onPress,
                                            noShadow = false,
                                        }) {
    const containerStyle = [
        styles.tagBase,
        isSelected ? styles.tagSelected : styles.tagDefault,
        styles.row,
    ];

    const textStyle = [
        isSelected ? styles.textSelected : styles.textDefault,
        { fontSize: size },
    ];

    const content = (
        <Pressable onPress={onPress} style={containerStyle}>
            <Text style={[textStyle, styles.tagText]}>{categoryName}</Text>
        </Pressable>
    );

    if (noShadow) {
        return content;
    }

    return (
        <Shadow
            distance={0}
            offset={[3, 3]}
            startColor="rgba(147,165,72)"   // solid green
            finalColor="rgba(147,165,72)"   // fade out
            viewStyle={{ borderRadius: 0 }}
        >
            {content}
        </Shadow>
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
    textDefault: {
        color: Colors.black,
        fontFamily: Fonts.regular,
    },
    textSelected: {
        color: Colors.white,
        fontFamily: Fonts.medium,
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