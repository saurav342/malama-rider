import React from 'react';
import {
    View,
    Text,
    TextInput as RNTextInput,
    StyleSheet,
    TextInputProps as RNTextInputProps,
    ViewStyle,
} from 'react-native';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/Theme';

interface TextInputProps extends RNTextInputProps {
    label?: string;
    helperText?: string;
    helperIcon?: React.ReactNode;
    helperVariant?: 'default' | 'success' | 'error';
    leadingIcon?: React.ReactNode;
    trailingIcon?: React.ReactNode;
    containerStyle?: ViewStyle;
    focused?: boolean;
}

export function TextInput({
    label,
    helperText,
    helperIcon,
    helperVariant = 'default',
    leadingIcon,
    trailingIcon,
    containerStyle,
    style,
    ...rest
}: TextInputProps) {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
        <View style={containerStyle}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, isFocused && styles.inputFocused]}>
                {leadingIcon && <View style={styles.iconLeft}>{leadingIcon}</View>}
                <RNTextInput
                    style={[
                        styles.input,
                        leadingIcon ? { paddingLeft: 0 } : undefined,
                        trailingIcon ? { paddingRight: 0 } : undefined,
                        style,
                    ]}
                    placeholderTextColor={Colors.textSubLight}
                    onFocus={(e) => {
                        setIsFocused(true);
                        rest.onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        rest.onBlur?.(e);
                    }}
                    {...rest}
                />
                {trailingIcon && <View style={styles.iconRight}>{trailingIcon}</View>}
            </View>
            {helperText && (
                <View
                    style={[
                        styles.helperContainer,
                        helperVariant === 'success' && styles.helperSuccess,
                    ]}
                >
                    {helperIcon}
                    <Text
                        style={[
                            styles.helperText,
                            helperVariant === 'success' && styles.helperTextSuccess,
                            helperVariant === 'error' && styles.helperTextError,
                        ]}
                    >
                        {helperText}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    label: {
        fontSize: FontSizes.xs,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSubLight,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 4,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.inputBgLight,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    inputFocused: {
        borderColor: Colors.primary,
        borderWidth: 2,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: Spacing.base,
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    iconLeft: {
        paddingLeft: Spacing.md,
    },
    iconRight: {
        paddingRight: Spacing.md,
    },
    helperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },
    helperSuccess: {
        backgroundColor: '#F0FDF4',
    },
    helperText: {
        fontSize: 11,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSubLight,
    },
    helperTextSuccess: {
        color: Colors.primaryDark,
    },
    helperTextError: {
        color: Colors.danger,
    },
});
