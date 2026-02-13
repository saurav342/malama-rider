import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, FontSizes } from '../../constants/Theme';

interface SettingsRowProps {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    trailing?: 'chevron' | 'lock' | 'edit' | React.ReactNode;
    iconBgColor?: string;
    iconColor?: string;
    style?: ViewStyle;
}

export function SettingsRow({
    icon,
    label,
    value,
    onPress,
    trailing = 'chevron',
    iconBgColor = `${Colors.primary}1A`,
    iconColor = Colors.primary,
    style,
}: SettingsRowProps) {
    const content = (
        <View style={[styles.container, style]}>
            <View style={styles.leftSection}>
                <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
                    <MaterialIcons name={icon} size={20} color={iconColor} />
                </View>
                {value ? (
                    <View>
                        <Text style={styles.sublabel}>{label}</Text>
                        <Text style={styles.value}>{value}</Text>
                    </View>
                ) : (
                    <Text style={styles.label}>{label}</Text>
                )}
            </View>
            <View style={styles.trailingContainer}>
                {typeof trailing === 'string' ? (
                    trailing === 'chevron' ? (
                        <MaterialIcons name="chevron-right" size={20} color={Colors.textSubLight} />
                    ) : trailing === 'lock' ? (
                        <MaterialIcons name="lock" size={18} color="#D1D5DB" />
                    ) : trailing === 'edit' ? (
                        <MaterialIcons name="edit" size={18} color="#D1D5DB" />
                    ) : null
                ) : (
                    trailing
                )}
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {content}
            </TouchableOpacity>
        );
    }
    return content;
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    sublabel: {
        fontSize: FontSizes.xs,
        color: Colors.textSubLight,
    },
    value: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    trailingContainer: {
        marginLeft: Spacing.sm,
    },
});
