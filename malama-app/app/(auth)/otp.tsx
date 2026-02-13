import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TextInput as RNTextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/Theme';
import { Button } from '../../src/components/Button';

const CORRECT_OTP = '1234';
const OTP_LENGTH = 4;
const RESEND_COOLDOWN = 30;

export default function OtpScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ contact?: string }>();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
    const inputRefs = useRef<(RNTextInput | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (text: string, index: number) => {
        if (text.length > 1) {
            // Handle paste
            const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
            const newOtp = [...otp];
            digits.forEach((d, i) => {
                if (index + i < OTP_LENGTH) newOtp[index + i] = d;
            });
            setOtp(newOtp);
            setError('');
            const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
            inputRefs.current[nextIndex]?.focus();
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        setError('');

        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
        }
    };

    const handleVerify = () => {
        const code = otp.join('');
        if (code.length < OTP_LENGTH) {
            setError('Please enter the complete OTP');
            return;
        }
        if (code !== CORRECT_OTP) {
            setError('Invalid OTP. Please try again.');
            setOtp(Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
            return;
        }
        router.replace('/(tabs)');
    };

    const handleResend = () => {
        if (resendTimer > 0) return;
        setResendTimer(RESEND_COOLDOWN);
        setOtp(Array(OTP_LENGTH).fill(''));
        setError('');
        inputRefs.current[0]?.focus();
        Alert.alert('OTP Sent', 'A new OTP has been sent to your number.');
    };

    const otpFilled = otp.every((d) => d !== '');

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <MaterialIcons name="arrow-back" size={24} color={Colors.textMainLight} />
                </TouchableOpacity>

                <View style={styles.content}>
                    {/* Logo */}
                    <Image
                        source={require('../../assets/images/logo1024x1024.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    {/* Title */}
                    <Text style={styles.title}>Verify OTP</Text>
                    <Text style={styles.subtitle}>
                        Enter the 4-digit code sent to{'\n'}
                        <Text style={styles.contactText}>{params.contact || 'your number'}</Text>
                    </Text>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <RNTextInput
                                key={index}
                                ref={(ref) => { inputRefs.current[index] = ref; }}
                                style={[
                                    styles.otpInput,
                                    digit ? styles.otpInputFilled : null,
                                    error ? styles.otpInputError : null,
                                ]}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={index === 0 ? OTP_LENGTH : 1}
                                selectTextOnFocus
                                selectionColor={Colors.primary}
                            />
                        ))}
                    </View>

                    {/* Error */}
                    {error ? (
                        <View style={styles.errorRow}>
                            <MaterialIcons name="error-outline" size={16} color={Colors.danger} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {/* Verify Button */}
                    <View style={styles.buttonContainer}>
                        <Button
                            title="VERIFY & CONTINUE"
                            onPress={handleVerify}
                            disabled={!otpFilled}
                        />
                    </View>

                    {/* Resend */}
                    <TouchableOpacity
                        onPress={handleResend}
                        disabled={resendTimer > 0}
                        style={styles.resendRow}
                    >
                        <Text style={styles.resendLabel}>Didn't receive the code? </Text>
                        {resendTimer > 0 ? (
                            <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
                        ) : (
                            <Text style={styles.resendActive}>Resend OTP</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* Bottom Gradient Accent */}
            <LinearGradient
                colors={['transparent', Colors.primary, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bottomGradient}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    keyboardView: {
        flex: 1,
    },
    backButton: {
        padding: Spacing.base,
        alignSelf: 'flex-start',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        marginTop: -40,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSizes.xxl,
        fontFamily: 'Inter_800ExtraBold',
        color: Colors.textMainLight,
        marginBottom: Spacing.sm,
    },
    subtitle: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_400Regular',
        color: Colors.textSubLight,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.xxl,
    },
    contactText: {
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textMainLight,
    },
    // OTP
    otpContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Spacing.lg,
    },
    otpInput: {
        width: 56,
        height: 64,
        borderRadius: BorderRadius.md,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        fontSize: 28,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
        textAlign: 'center',
    },
    otpInputFilled: {
        borderColor: Colors.primary,
        backgroundColor: '#F0FDF4',
    },
    otpInputError: {
        borderColor: Colors.danger,
        backgroundColor: '#FEF2F2',
    },
    // Error
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: Spacing.lg,
    },
    errorText: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_500Medium',
        color: Colors.danger,
    },
    // Button
    buttonContainer: {
        width: '100%',
        marginBottom: Spacing.xl,
    },
    // Resend
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    resendLabel: {
        fontSize: FontSizes.md,
        color: Colors.textSubLight,
    },
    resendTimer: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textSubLight,
    },
    resendActive: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_700Bold',
        color: Colors.primary,
    },
    // Bottom gradient
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        opacity: 0.2,
    },
});
