import {StyleSheet} from "react-native";

export function setColor(color) {
    let eventColors = [styles.green];

    if (color == 'green') {
        eventColors = [styles.green];
    }

    if (color == 'yellow') {
        eventColors = [styles.yellow];
    }

    if (color == 'pink') {
        eventColors = [styles.pink];
    }

    if (color == 'blue') {
        eventColors = [styles.blue];
    }

    return eventColors;
}

export const Colors = {
    green: '#93a548',
    red: '#AF2413',
    yellow: '#f6ba23',
    blue: '#42a6ca',
    black: '#000',
    white: '#fff',
    background: '#fef8ec',
    eventBackground: '#fef8ec',
    grey: '#555'
}

const styles = StyleSheet.create({
    green: {
        borderColor: Colors.green,
        backgroundColor: Colors.green
    },
    pink: {
        borderColor: Colors.red,
        backgroundColor: Colors.red
    },
    yellow: {
        borderColor: Colors.yellow,
        backgroundColor: Colors.yellow
    },
    blue: {
        borderColor: Colors.blue,
        backgroundColor: Colors.blue
    }
});