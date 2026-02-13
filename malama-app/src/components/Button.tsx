import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { Colors, BorderRadius, FontSizes, Shadows } from '../../constants/Theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    size?: 'sm' | 'md' | 'lg';
}

export function Button({
    title,
    onPress,
    variant = 'primary',
    icon,
    iconPosition = 'right',
    loading = false,
    disabled = false,
    fullWidth = true,
    style,
    textStyle,
    size = 'lg',
}: ButtonProps) {
    const buttonStyles = [
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
    ];

    const labelStyles = [
        styles.label,
        styles[`label_${variant}`],
        styles[`labelSize_${size}`],
        textStyle,
    ];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.85}
            style={buttonStyles}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? Colors.white : Colors.primary} />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={labelStyles}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: BorderRadius.md,
    },
    fullWidth: {
        width: '100%',
    },
    disabled: {
        opacity: 0.5,
    },
    // Variants
    primary: {
        backgroundColor: Colors.primary,
        ...Shadows.button,
    },
    secondary: {
        backgroundColor: Colors.inputBgLight,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: Colors.borderLight,
    },
    danger: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.dangerLight,
    },
    // Sizes
    size_sm: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    size_md: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    size_lg: {
        paddingVertical: 16,
        paddingHorizontal: 24,
    },
    // Label
    label: {
        fontFamily: 'Inter_700Bold',
        letterSpacing: 0.5,
    },
    label_primary: {
        color: Colors.white,
    },
    label_secondary: {
        color: Colors.textMainLight,
    },
    label_outline: {
        color: Colors.textMainLight,
    },
    label_danger: {
        color: Colors.danger,
    },
    labelSize_sm: {
        fontSize: FontSizes.sm,
    },
    labelSize_md: {
        fontSize: FontSizes.md,
    },
    labelSize_lg: {
        fontSize: FontSizes.base,
    },
});
