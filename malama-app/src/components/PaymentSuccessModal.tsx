/**
 * PaymentSuccessModal — Animated success modal after Razorpay payment
 * Uses react-native-reanimated for smooth spring animations.
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    withSequence,
    withTiming,
    runOnJS,
    Easing,
    FadeIn,
    FadeInDown,
    ZoomIn,
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { Button } from './Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Confetti Particle ──────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#2E7D32', '#4CAF50', '#FFD700', '#FF6B6B', '#42A5F5', '#AB47BC'];

function ConfettiParticle({ index, total }: { index: number; total: number }) {
    const translateY = useSharedValue(-20);
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);
    const scale = useSharedValue(0);

    useEffect(() => {
        const delay = index * 40;
        const startX = (Math.random() - 0.5) * SCREEN_WIDTH * 0.8;
        const endY = 300 + Math.random() * 200;

        scale.value = withDelay(delay, withSpring(1, { damping: 8 }));
        translateX.value = withDelay(
            delay,
            withSpring(startX, { damping: 6, stiffness: 30 })
        );
        translateY.value = withDelay(
            delay,
            withTiming(endY, { duration: 2000 + Math.random() * 1000, easing: Easing.out(Easing.quad) })
        );
        rotate.value = withDelay(
            delay,
            withTiming(360 * (Math.random() > 0.5 ? 1 : -1), { duration: 2000 })
        );
        opacity.value = withDelay(delay + 1500, withTiming(0, { duration: 800 }));
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    const size = 6 + Math.random() * 6;
    const isCircle = index % 3 === 0;

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    width: size,
                    height: isCircle ? size : size * 2.5,
                    backgroundColor: color,
                    borderRadius: isCircle ? size / 2 : 2,
                },
                animStyle,
            ]}
        />
    );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────

interface PaymentSuccessModalProps {
    visible: boolean;
    paymentId?: string;
    amount: number;
    serviceType: string;
    isCash?: boolean;
    onDone: () => void;
}

export function PaymentSuccessModal({
    visible,
    paymentId,
    amount,
    serviceType,
    isCash,
    onDone,
}: PaymentSuccessModalProps) {
    const checkScale = useSharedValue(0);
    const ringScale = useSharedValue(0);
    const ringOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            // Ring pulse
            ringScale.value = withDelay(200, withSpring(1.3, { damping: 6 }));
            ringOpacity.value = withDelay(200,
                withSequence(
                    withTiming(0.4, { duration: 300 }),
                    withTiming(0, { duration: 600 })
                )
            );
            // Check pop
            checkScale.value = withDelay(100, withSpring(1, { damping: 8, stiffness: 150 }));
        } else {
            checkScale.value = 0;
            ringScale.value = 0;
            ringOpacity.value = 0;
        }
    }, [visible]);

    const checkStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkScale.value }],
    }));

    const ringStyle = useAnimatedStyle(() => ({
        transform: [{ scale: ringScale.value }],
        opacity: ringOpacity.value,
    }));

    if (!visible) return null;

    return (
        <Modal transparent animationType="fade" visible={visible}>
            <View style={styles.overlay}>
                {/* Confetti */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <ConfettiParticle key={i} index={i} total={30} />
                ))}

                <Animated.View
                    entering={FadeInDown.delay(50).springify().damping(15)}
                    style={styles.card}
                >
                    {/* Animated Ring */}
                    <Animated.View style={[styles.ring, ringStyle]} />

                    {/* Animated Checkmark */}
                    <Animated.View style={[styles.checkCircle, checkStyle]}>
                        <MaterialIcons name="check" size={48} color={Colors.white} />
                    </Animated.View>

                    <Animated.Text
                        entering={FadeInDown.delay(300).springify()}
                        style={styles.successTitle}
                    >
                        {isCash ? 'Booking Confirmed! 🎉' : 'Payment Successful! 🎉'}
                    </Animated.Text>

                    <Animated.Text
                        entering={FadeInDown.delay(400).springify()}
                        style={styles.successSubtitle}
                    >
                        Your booking has been confirmed
                    </Animated.Text>

                    {/* Payment Details */}
                    <Animated.View
                        entering={FadeInDown.delay(500).springify()}
                        style={styles.detailsCard}
                    >
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Amount {isCash ? 'Payable' : 'Paid'}</Text>
                            <Text style={styles.detailValue}>₹ {amount}</Text>
                        </View>
                        <View style={styles.detailDivider} />
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Service</Text>
                            <Text style={styles.detailValue}>
                                {serviceType === 'drop' ? 'City → Airport' : 'Airport → City'}
                            </Text>
                        </View>
                        {(!isCash && paymentId) && (
                            <>
                                <View style={styles.detailDivider} />
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Payment ID</Text>
                                    <Text style={[styles.detailValue, styles.paymentId]}>
                                        {paymentId}
                                    </Text>
                                </View>
                            </>
                        )}
                        {isCash && (
                            <>
                                <View style={styles.detailDivider} />
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Payment Method</Text>
                                    <Text style={styles.detailValue}>Cash to Driver</Text>
                                </View>
                            </>
                        )}
                    </Animated.View>

                    {/* WhatsApp notice */}
                    <Animated.View
                        entering={FadeInDown.delay(600).springify()}
                        style={styles.whatsappNotice}
                    >
                        <MaterialIcons name="chat" size={16} color={Colors.primaryDark} />
                        <Text style={styles.whatsappText}>
                            Booking details sent to your WhatsApp
                        </Text>
                    </Animated.View>

                    {/* CTA */}
                    <Animated.View
                        entering={FadeInDown.delay(700).springify()}
                        style={styles.ctaContainer}
                    >
                        <Button
                            title="View My Rides"
                            onPress={onDone}
                            icon={<MaterialIcons name="directions-car" size={18} color={Colors.white} />}
                        />
                    </Animated.View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    card: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xxl,
        padding: Spacing.xxl,
        paddingTop: 48,
        width: '100%',
        maxWidth: 380,
        alignItems: 'center',
        ...Shadows.bottomSheet,
        overflow: 'visible',
    },
    ring: {
        position: 'absolute',
        top: 20,
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.primary,
    },
    checkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        ...Shadows.button,
    },
    successTitle: {
        fontSize: FontSizes.xxl,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
        textAlign: 'center',
        marginBottom: 6,
    },
    successSubtitle: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_400Regular',
        color: Colors.textSubLight,
        textAlign: 'center',
        marginBottom: 24,
    },
    detailsCard: {
        backgroundColor: '#F6F8F7',
        borderRadius: BorderRadius.md,
        padding: Spacing.base,
        width: '100%',
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    detailLabel: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSubLight,
    },
    detailValue: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    detailDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    paymentId: {
        fontSize: FontSizes.xs,
        fontFamily: 'Inter_500Medium',
        color: Colors.primary,
    },
    whatsappNotice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: BorderRadius.sm,
        marginBottom: 24,
        width: '100%',
    },
    whatsappText: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_500Medium',
        color: Colors.primaryDark,
    },
    ctaContainer: {
        width: '100%',
    },
});
