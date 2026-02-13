import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput as RNTextInput,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { Button } from '../../src/components/Button';
import { Stepper } from '../../src/components/Stepper';
import { ToggleSwitch } from '../../src/components/ToggleSwitch';
import { confirmationData, mockFares } from '../../src/data/mockData';

export default function BookingStep3() {
    const router = useRouter();
    const [returnTrip, setReturnTrip] = useState(false);
    const [specialReq, setSpecialReq] = useState('');

    const handleConfirm = () => {
        Alert.alert(
            'Booking Confirmed! 🎉',
            'Your ride has been booked successfully. You will receive a WhatsApp confirmation shortly.',
            [{ text: 'View My Rides', onPress: () => router.replace('/(tabs)/rides') }]
        );
    };

    return (
        <View style={styles.container}>
            {/* Map Background */}
            <View style={styles.mapSection}>
                <View style={styles.mapPlaceholder}>
                    {/* Route line simulation */}
                    <View style={styles.routeLine} />
                    <View style={styles.routeDotStart} />
                    <View style={styles.routeDotEnd} />

                    {/* Route info pill */}
                    <View style={styles.routeInfoPill}>
                        <MaterialIcons name="directions-car" size={16} color={Colors.textMainLight} />
                        <Text style={styles.routeInfoText}>50 min • 35.5 km</Text>
                    </View>
                </View>

                {/* Header */}
                <SafeAreaView style={styles.headerOverlay}>
                    <TouchableOpacity
                        style={styles.headerBtn}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={Colors.textMainLight} />
                    </TouchableOpacity>
                    <View style={styles.headerPill}>
                        <Text style={styles.headerPillText}>Booking Confirmation</Text>
                    </View>
                </SafeAreaView>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <View style={styles.dragHandle} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.sheetContent}
                >
                    <Stepper currentStep={3} />

                    {/* Booking Summary */}
                    <View style={styles.summaryHeader}>
                        <MaterialIcons name="receipt-long" size={22} color={Colors.primary} />
                        <Text style={styles.summaryTitle}>Booking Summary</Text>
                    </View>

                    <View style={styles.summaryCard}>
                        {/* Passenger Info */}
                        <View style={styles.passengerRow}>
                            <View style={styles.passengerAvatar}>
                                <MaterialIcons name="person" size={24} color={Colors.primary} />
                            </View>
                            <View style={styles.passengerInfo}>
                                <Text style={styles.passengerName}>{confirmationData.passenger.name}</Text>
                                <Text style={styles.passengerPhone}>{confirmationData.passenger.phone}</Text>
                            </View>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{confirmationData.status}</Text>
                            </View>
                        </View>

                        {/* Route Timeline */}
                        <View style={styles.routeTimeline}>
                            {/* Pickup */}
                            <View style={styles.timelineRow}>
                                <View style={styles.timelineDotGreen} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>PICKUP</Text>
                                    <Text style={styles.timelineValue}>{confirmationData.pickup}</Text>
                                </View>
                            </View>

                            <View style={styles.timelineLine} />

                            {/* Dropoff */}
                            <View style={styles.timelineRow}>
                                <View style={styles.timelineDotRed} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.timelineLabel}>DROP-OFF</Text>
                                    <Text style={styles.timelineValue}>{confirmationData.dropoff}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Date & Time */}
                        <View style={styles.dateTimeRow}>
                            <MaterialIcons name="calendar-month" size={22} color={Colors.primary} />
                            <View>
                                <Text style={styles.dateTimeLabel}>Date & Time</Text>
                                <Text style={styles.dateTimeValue}>{confirmationData.dateTime}</Text>
                            </View>
                        </View>

                        {/* Fare Details */}
                        <View style={styles.fareSection}>
                            <View style={styles.fareHeader}>
                                <MaterialIcons name="payments" size={16} color={Colors.primary} />
                                <Text style={styles.fareTitle}>FARE DETAILS</Text>
                            </View>
                            {mockFares.map((fare, index) => (
                                <View
                                    key={fare.label}
                                    style={[
                                        styles.fareRow,
                                        index < mockFares.length - 1 && styles.fareRowBorder,
                                    ]}
                                >
                                    <Text style={styles.fareLabel}>{fare.label}</Text>
                                    <Text style={styles.fareAmount}>₹ {fare.amount}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Return Trip Toggle */}
                    <View style={styles.optionCard}>
                        <View style={styles.optionLeft}>
                            <MaterialIcons name="published-with-changes" size={20} color={Colors.textSubLight} />
                            <Text style={styles.optionLabel}>Book return journey</Text>
                        </View>
                        <ToggleSwitch value={returnTrip} onValueChange={setReturnTrip} />
                    </View>

                    {/* Special Requirements */}
                    <View style={styles.specialReqSection}>
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
                    </View>

                    {/* Footer links */}
                    <View style={styles.footerLinks}>
                        <Text style={styles.footerLink}>Privacy Policy</Text>
                        <Text style={styles.footerLink}>Terms of Service</Text>
                    </View>

                    {/* Spacer for confirm button */}
                    <View style={{ height: 80 }} />
                </ScrollView>

                {/* Sticky Confirm Button */}
                <View style={styles.confirmBar}>
                    <Button
                        title="Confirm Booking"
                        onPress={handleConfirm}
                        icon={<MaterialIcons name="arrow-forward" size={16} color={Colors.white} />}
                    />
                </View>
            </View>
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
    mapPlaceholder: {
        flex: 1,
        backgroundColor: '#E8EDE9',
        position: 'relative',
        overflow: 'hidden',
    },
    routeLine: {
        position: 'absolute',
        top: '30%',
        left: '20%',
        right: '20%',
        height: 4,
        backgroundColor: '#6366F1',
        borderRadius: 2,
        transform: [{ rotate: '-15deg' }],
    },
    routeDotStart: {
        position: 'absolute',
        top: '25%',
        left: '15%',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },
    routeDotEnd: {
        position: 'absolute',
        top: '35%',
        right: '15%',
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#EF4444',
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
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: Spacing.base,
    },
    headerBtn: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: BorderRadius.full,
        padding: 8,
    },
    headerPill: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: BorderRadius.full,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerPillText: {
        fontFamily: 'Inter_700Bold',
        fontSize: FontSizes.md,
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
    dragHandle: {
        width: 48,
        height: 5,
        backgroundColor: '#D1D5DB',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 12,
        opacity: 0.5,
    },
    sheetContent: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
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
        borderRadius: BorderRadius.sm,
        padding: 12,
        borderWidth: 1,
        borderColor: `${Colors.primary}1A`,
    },
    fareHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
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
        paddingVertical: 6,
    },
    fareRowBorder: {
        borderBottomWidth: 1,
        borderBottomColor: `${Colors.primary}20`,
        borderStyle: 'dashed',
    },
    fareLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
    },
    fareAmount: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textMainLight,
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
});
