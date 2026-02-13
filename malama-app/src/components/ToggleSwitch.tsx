import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Theme';

interface ToggleSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
    activeColor?: string;
}

export function ToggleSwitch({
    value,
    onValueChange,
    disabled = false,
    activeColor = Colors.accent,
}: ToggleSwitchProps) {
    const translateX = React.useRef(new Animated.Value(value ? 20 : 0)).current;

    React.useEffect(() => {
        Animated.spring(translateX, {
            toValue: value ? 20 : 0,
            useNativeDriver: true,
            friction: 8,
            tension: 120,
        }).start();
    }, [value]);

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => !disabled && onValueChange(!value)}
            style={[
                styles.track,
                value ? { backgroundColor: activeColor } : styles.trackInactive,
                disabled && styles.disabled,
            ]}
        >
            <Animated.View
                style={[
                    styles.thumb,
                    { transform: [{ translateX }] },
                ]}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    track: {
        width: 44,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    trackInactive: {
        backgroundColor: '#D1D5DB',
    },
    thumb: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 3,
    },
    disabled: {
        opacity: 0.5,
    },
});
