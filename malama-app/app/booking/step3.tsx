import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput as RNTextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
    FadeInDown,
    FadeInUp,
    SlideInRight,
    ZoomIn,
} from 'react-native-reanimated';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { GoogleMap } from '../../src/components/GoogleMap';
import { Button } from '../../src/components/Button';
import { Stepper } from '../../src/components/Stepper';
import { ToggleSwitch } from '../../src/components/ToggleSwitch';
import { faresByServiceType } from '../../src/data/constants';
import { openPayment } from '../../src/components/RazorpayCheckout';
import { PaymentSuccessModal } from '../../src/components/PaymentSuccessModal';

export default function BookingStep3() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        serviceType?: string;
        terminal?: string;
        pickupLocation?: string;
        dropLocation?: string;
        date?: string;
        name?: string;
        whatsapp?: string;
        email?: string;
    }>();
    const [returnTrip, setReturnTrip] = useState(false);
    const [specialReq, setSpecialReq] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [paymentId, setPaymentId] = useState<string | undefined>();
    const [tollOption, setTollOption] = useState<'without' | 'with'>('without');
    const [paymentMode, setPaymentMode] = useState<'online' | 'cash'>('online');

    // ── Get fares for current service type ──
    const currentType = (params.serviceType === 'pickup' ? 'pickup' : 'drop') as 'drop' | 'pickup';
    const fares = faresByServiceType[currentType];
    const serviceLabel = currentType === 'drop' ? 'City → Airport' : 'Airport → City';
    const selectedFare = fares.find(f =>
        tollOption === 'without' ? f.label === 'Without Toll' : f.label === 'With Toll'
    );
    const payAmount = selectedFare?.amount ?? fares[0].amount;
    const terminalLabel = params.terminal === 'terminal2' ? 'Terminal 2' : params.terminal === 'terminal1' ? 'Terminal 1' : '—';
    const bookingDate = params.date ? new Date(params.date) : null;

    const handlePayment = async () => {
        setPaymentLoading(true);

        if (paymentMode === 'cash') {
            // Simulate API call for cash booking
            setTimeout(() => {
                setPaymentLoading(false);
                setPaymentId('CASH'); // Marker for cash payment
                setShowSuccess(true);
            }, 1500);
            return;
        }

        try {
            const result = await openPayment({
                amount: payAmount,
                name: 'Malama Cabs',
                description: `${serviceLabel} — ${tollOption === 'with' ? 'With Toll' : 'Without Toll'}`,
                prefill: {
                    name: params.name || '',
                    contact: params.whatsapp || '',
                    email: params.email || '',
                },
            });

            if (result.success) {
                setPaymentId(result.paymentId);
                setShowSuccess(true);
            } else if (result.error !== 'Payment cancelled by user') {
                Alert.alert('Payment Failed', result.error || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            Alert.alert('Error', 'Could not process payment. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    const handlePaymentDone = () => {
        setShowSuccess(false);
        router.replace('/(tabs)/rides');
    };

    return (
        <View style={styles.container}>
            {/* Map Background */}
            <View style={styles.mapSection}>
                <GoogleMap
                    latitude={12.9716}
                    longitude={77.5946}
                    zoom={11}
                    directions={{
                        originLat: 12.9784,
                        originLng: 77.6408,
                        destLat: 13.1986,
                        destLng: 77.7066,
                    }}
                />

                {/* Back Button */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <MaterialIcons name="arrow-back" size={24} color={Colors.textMainLight} />
                </TouchableOpacity>

                {/* Route info pill */}
                <Animated.View
                    entering={SlideInRight.delay(200).springify()}
                    style={styles.routeInfoPill}
                >
                    <MaterialIcons name="directions-car" size={16} color={Colors.textMainLight} />
                    <Text style={styles.routeInfoText}>50 min • 35.5 km</Text>
                </Animated.View>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.sheetContent}
                >
                    <Stepper currentStep={3} />

                    {/* Service Type Badge */}
                    <Animated.View
                        entering={FadeInDown.delay(100).springify()}
                        style={styles.serviceBadge}
                    >
                        <MaterialIcons
                            name={currentType === 'drop' ? 'flight-land' : 'flight-takeoff'}
                            size={16}
                            color={Colors.primary}
                        />
                        <Text style={styles.serviceBadgeText}>{serviceLabel}</Text>
                    </Animated.View>

                    {/* Booking Summary */}
                    <Animated.View
                        entering={FadeInDown.delay(150).springify()}
                        style={styles.summaryHeader}
                    >
                        <MaterialIcons name="receipt-long" size={22} color={Colors.primary} />
                        <Text style={styles.summaryTitle}>Booking Summary</Text>
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(200).springify()}
                        style={styles.summaryCard}
                    >
                        {/* Passenger Info */}
                        <View style={styles.passengerRow}>
                            <View style={styles.passengerAvatar}>
                                <MaterialIcons name="person" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.passengerInfo}>
                                <Text style={styles.passengerName}>{params.name || '—'}</Text>
                                <Text style={styles.passengerPhone}>{params.whatsapp || '—'}</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>Pending</Text>
                            </View>
                        </View>

                        {/* Route Timeline */}
                        <View style={styles.routeTimeline}>
                            {/* Pickup */}
                            <View style={styles.timelineRow}>
                                <View style={styles.timelineDotGreen} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>PICKUP</Text>
                                    <Text style={styles.timelineValue}>
                                        {currentType === 'drop'
                                            ? (params.pickupLocation || '—')
                                            : `Kempegowda Airport — ${terminalLabel}`}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.timelineLine} />

                            {/* Dropoff */}
                            <View style={styles.timelineRow}>
                                <View style={styles.timelineDotRed} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>DROP-OFF</Text>
                                    <Text style={styles.timelineValue}>
                                        {currentType === 'drop'
                                            ? `Kempegowda Airport — ${terminalLabel}`
                                            : (params.dropLocation || '—')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Date & Time */}
                        <View style={styles.dateTimeRow}>
                            <MaterialIcons name="calendar-month" size={22} color={Colors.primary} />
                            <View>
                                <Text style={styles.dateTimeLabel}>Date & Time</Text>
                                <Text style={styles.dateTimeValue}>
                                    {bookingDate
                                        ? `${bookingDate.toLocaleDateString()} • ${bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                        : '—'}
                                </Text>
                            </View>
                        </View>

                        {/* ── Toll Selection ── */}
                        <Animated.View
                            entering={FadeInDown.delay(350).springify()}
                            style={styles.fareSection}
                        >
                            <View style={styles.fareHeader}>
                                <MaterialIcons name="payments" size={16} color={Colors.primary} />
                                <Text style={styles.fareTitle}>
                                    {serviceLabel} — SELECT FARE
                                </Text>
                            </View>

                            <View style={styles.tollToggleRow}>
                                <TouchableOpacity
                                    style={[
                                        styles.tollPill,
                                        tollOption === 'without' && styles.tollPillActive,
                                    ]}
                                    onPress={() => setTollOption('without')}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons
                                        name="check-circle-outline"
                                        size={18}
                                        color={tollOption === 'without' ? Colors.white : Colors.primaryLight}
                                    />
                                    <View style={styles.tollPillContent}>
                                        <Text style={[
                                            styles.tollPillLabel,
                                            tollOption === 'without' && styles.tollPillLabelActive,
                                        ]}>Without Toll</Text>
                                        <Text style={[
                                            styles.tollPillAmount,
                                            tollOption === 'without' && styles.tollPillAmountActive,
                                        ]}>₹ {fares.find(f => f.label === 'Without Toll')?.amount ?? '—'}</Text>
                                    </View>
                                    {tollOption === 'without' && (
                                        <MaterialIcons name="check" size={16} color={Colors.white} />
                                    )}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.tollPill,
                                        tollOption === 'with' && styles.tollPillActiveOrange,
                                    ]}
                                    onPress={() => setTollOption('with')}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons
                                        name="toll"
                                        size={18}
                                        color={tollOption === 'with' ? Colors.white : '#F59E0B'}
                                    />
                                    <View style={styles.tollPillContent}>
                                        <Text style={[
                                            styles.tollPillLabel,
                                            tollOption === 'with' && styles.tollPillLabelActive,
                                        ]}>With Toll</Text>
                                        <Text style={[
                                            styles.tollPillAmount,
                                            tollOption === 'with' && styles.tollPillAmountActive,
                                        ]}>₹ {fares.find(f => f.label === 'With Toll')?.amount ?? '—'}</Text>
                                    </View>
                                    {tollOption === 'with' && (
                                        <MaterialIcons name="check" size={16} color={Colors.white} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Total / Pay amount */}
                            <Animated.View
                                entering={ZoomIn.delay(650).springify()}
                                style={styles.totalRow}
                            >
                                <Text style={styles.totalLabel}>Estimated Fare</Text>
                                <Text style={styles.totalAmount}>₹ {payAmount}</Text>
                            </Animated.View>
                        </Animated.View>
                    </Animated.View>

                    {/* Return Trip Toggle */}
                    <Animated.View
                        entering={FadeInDown.delay(500).springify()}
                        style={styles.optionCard}
                    >
                        <View style={styles.optionLeft}>
                            <MaterialIcons name="published-with-changes" size={20} color={Colors.textSubLight} />
                            <Text style={styles.optionLabel}>Book return journey</Text>
                        </View>
                        <ToggleSwitch value={returnTrip} onValueChange={setReturnTrip} />
                    </Animated.View>

                    {/* Special Requirements */}
                    <Animated.View
                        entering={FadeInDown.delay(550).springify()}
                        style={styles.specialReqSection}
                    >
                        <View style={styles.specialReqHeader}>
                            <MaterialIcons name="edit-note" size={18} color={Colors.textSubLight} />
                            <Text style={styles.specialReqLabel}>Special Requirements</Text>
                        </View>
                        <RNTextInput
                            style={styles.specialReqInput}
                            placeholder="Notes for driver (optional)..."
                            placeholderTextColor={Colors.textSubLight}
                            value={specialReq}
                            onChangeText={setSpecialReq}
                            multiline
                            numberOfLines={2}
                            textAlignVertical="top"
                        />
                    </Animated.View>

                    {/* Footer links */}
                    <View style={styles.footerLinks}>
                        <Text style={styles.footerLink}>Privacy Policy</Text>
                        <Text style={styles.footerLink}>Terms of Service</Text>
                    </View>

                    {/* Spacer for confirm button */}
                    <View style={{ height: 90 }} />
                </ScrollView>

                {/* Sticky Pay Button */}
                <Animated.View
                    entering={FadeInUp.delay(700).springify()}
                    style={styles.confirmBar}
                >
                    <Button
                        title={paymentLoading ? 'Processing...' : (paymentMode === 'cash' ? 'Book Ride' : `Pay ₹${payAmount}`)}
                        onPress={handlePayment}
                        disabled={paymentLoading}
                        icon={
                            paymentLoading ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <MaterialIcons name="lock" size={16} color={Colors.white} />
                            )
                        }
                    />
                    <View style={styles.secureRow}>
                        <MaterialIcons name="verified-user" size={12} color={Colors.primaryLight} />
                        <Text style={styles.secureText}>Secured by Razorpay</Text>
                    </View>
                </Animated.View>
            </View>

            {/* Payment Success Modal */}
            <PaymentSuccessModal
                visible={showSuccess}
                paymentId={paymentId}
                amount={payAmount}
                serviceType={currentType}
                isCash={paymentMode === 'cash'}
                onDone={handlePaymentDone}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E5E7EB',
    },
    // Map
    mapSection: {
        height: '18%',
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadows.card,
        zIndex: 10,
    },
    routeInfoPill: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: BorderRadius.sm,
        paddingHorizontal: 10,
        paddingVertical: 6,
    },
    routeInfoText: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textMainLight,
    },
    // Service badge
    serviceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        gap: 6,
        backgroundColor: `${Colors.primary}14`,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: `${Colors.primary}30`,
    },
    serviceBadgeText: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_700Bold',
        color: Colors.primary,
    },
    // Bottom Sheet
    bottomSheet: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.88)',
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        ...Shadows.bottomSheet,
        marginTop: -12,
        position: 'relative',
    },
    sheetContent: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
    },
    // Summary
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
    },
    summaryTitle: {
        fontSize: FontSizes.lg,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    summaryCard: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        borderRadius: BorderRadius.md,
        padding: Spacing.base,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        marginBottom: Spacing.base,
    },
    // Passenger
    passengerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB50',
        marginBottom: 16,
    },
    passengerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    passengerInfo: {
        flex: 1,
    },
    passengerName: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    passengerPhone: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
    },
    statusBadge: {
        backgroundColor: `${Colors.primary}1A`,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.primary,
    },
    // Route Timeline
    routeTimeline: {
        paddingLeft: 8,
        marginBottom: 16,
        borderLeftWidth: 2,
        borderLeftColor: '#D1D5DB',
        borderStyle: 'dashed',
        marginLeft: 8,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 16,
    },
    timelineDotGreen: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#22C55E',
        marginTop: 2,
        marginLeft: -15,
    },
    timelineDotRed: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#EF4444',
        marginTop: 2,
        marginLeft: -15,
    },
    timelineContent: {
        flex: 1,
    },
    timelineLabel: {
        fontSize: FontSizes.xs,
        color: Colors.textSubLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    timelineValue: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    timelineLine: {
        height: 1,
        backgroundColor: 'transparent',
    },
    // Date & Time
    dateTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 12,
        borderRadius: BorderRadius.sm,
        marginBottom: 16,
    },
    dateTimeLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
    },
    dateTimeValue: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textMainLight,
    },
    // Fare
    fareSection: {
        backgroundColor: `${Colors.primary}08`,
        borderRadius: BorderRadius.md,
        padding: 14,
        borderWidth: 1,
        borderColor: `${Colors.primary}1A`,
    },
    fareHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    paymentMethodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 16,
        marginBottom: 10,
    },
    fareTitle: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_700Bold',
        color: Colors.primary,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    fareRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    fareRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: `${Colors.primary}15`,
        borderStyle: 'dashed',
    },
    fareLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    fareLabel: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSubLight,
    },
    fareAmount: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textMainLight,
    },
    // Toll Toggle
    tollToggleRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    tollPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: BorderRadius.md,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    tollPillActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        ...Shadows.card,
    },
    tollPillActiveOrange: {
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
        ...Shadows.card,
    },
    tollPillContent: {
        flex: 1,
    },
    tollPillLabel: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textMainLight,
    },
    tollPillLabelActive: {
        color: Colors.white,
    },
    tollPillSubtext: {
        fontSize: FontSizes.xs,
        color: Colors.textSubLight,
        marginTop: 2,
    },
    tollPillAmount: {
        fontSize: FontSizes.lg,
        fontFamily: 'Inter_700Bold',
        color: Colors.primary,
        marginTop: 2,
    },
    tollPillAmountActive: {
        color: Colors.white,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 12,
        borderTopWidth: 2,
        borderTopColor: Colors.primary,
    },
    totalLabel: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    totalAmount: {
        fontSize: FontSizes.xl,
        fontFamily: 'Inter_700Bold',
        color: Colors.primary,
    },
    // Options
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.6)',
        padding: 12,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        marginBottom: Spacing.base,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    optionLabel: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    // Special Requirements
    specialReqSection: {
        marginBottom: Spacing.base,
    },
    specialReqHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    specialReqLabel: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    specialReqInput: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: BorderRadius.sm,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        padding: 12,
        fontSize: FontSizes.md,
        fontFamily: 'Inter_400Regular',
        color: Colors.textMainLight,
        minHeight: 60,
    },
    // Footer
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        paddingVertical: Spacing.base,
    },
    footerLink: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
        textDecorationLine: 'underline',
    },
    // Confirm Bar
    confirmBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: Spacing.base,
        paddingBottom: Spacing.xxl,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        ...Shadows.bottomSheet,
        borderTopLeftRadius: BorderRadius.lg,
        borderTopRightRadius: BorderRadius.lg,
    },
    secureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        marginTop: 8,
    },
    secureText: {
        fontSize: FontSizes.xs,
        fontFamily: 'Inter_500Medium',
        color: Colors.primaryLight,
    },
});
