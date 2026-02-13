import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { Ride } from '../data/mockData';

interface RideCardProps {
    ride: Ride;
    onRebook?: () => void;
    onHelp?: () => void;
    onRate?: () => void;
}

export function RideCard({ ride, onRebook, onHelp, onRate }: RideCardProps) {
    const isCancelled = ride.status === 'cancelled';
    const isCompleted = ride.status === 'completed';

    return (
        <View style={[styles.card, isCancelled && styles.cardCancelled]}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.dateText}>{ride.date} • {ride.time}</Text>
                    {ride.co2Saved && (
                        <View style={styles.co2Badge}>
                            <MaterialIcons name="electric-car" size={14} color={Colors.primary} />
                            <Text style={styles.co2Text}>{ride.co2Saved} CO₂ saved</Text>
                        </View>
                    )}
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        isCompleted && styles.statusCompleted,
                        isCancelled && styles.statusCancelled,
                    ]}
                >
                    <Text
                        style={[
                            styles.statusText,
                            isCompleted && styles.statusTextCompleted,
                            isCancelled && styles.statusTextCancelled,
                        ]}
                    >
                        {ride.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* Route Timeline */}
            <View style={styles.routeContainer}>
                {/* Pickup */}
                <View style={styles.routeRow}>
                    <View style={[styles.dot, isCompleted ? styles.dotPickup : styles.dotGray]} />
                    <View style={styles.routeTextContainer}>
                        <Text style={styles.routeName}>{ride.route.pickupName}</Text>
                        <Text style={styles.routeAddress} numberOfLines={1}>{ride.route.pickupAddress}</Text>
                    </View>
                </View>

                {/* Dashed Line */}
                <View style={styles.dashedLineContainer}>
                    {[...Array(4)].map((_, i) => (
                        <View key={i} style={styles.dashSegment} />
                    ))}
                </View>

                {/* Dropoff */}
                <View style={styles.routeRow}>
                    <View style={[styles.dot, styles.dotDropoff]} />
                    <View style={styles.routeTextContainer}>
                        <Text style={styles.routeName}>{ride.route.dropoffName}</Text>
                        <Text style={styles.routeAddress} numberOfLines={1}>{ride.route.dropoffAddress}</Text>
                    </View>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Footer */}
            <View style={styles.footer}>
                <View>
                    <Text style={styles.fareLabel}>Total Fare</Text>
                    <Text style={[styles.fareAmount, isCancelled && styles.fareCancelled]}>
                        {ride.currency}{ride.fare.toFixed(2)}
                    </Text>
                </View>
                <View style={styles.actions}>
                    {isCompleted && ride.rating && (
                        <View style={styles.ratingBadge}>
                            <MaterialIcons name="star" size={14} color="#FACC15" />
                            <Text style={styles.ratingText}>{ride.rating.toFixed(1)}</Text>
                        </View>
                    )}
                    {isCompleted && !ride.rating && (
                        <TouchableOpacity style={styles.iconButton} onPress={onRate}>
                            <MaterialIcons name="star-outline" size={20} color={Colors.textSubLight} />
                        </TouchableOpacity>
                    )}
                    {isCompleted ? (
                        <TouchableOpacity style={styles.rebookButton} onPress={onRebook}>
                            <MaterialIcons name="refresh" size={16} color={Colors.textMainLight} />
                            <Text style={styles.rebookText}>Rebook</Text>
                        </TouchableOpacity>
                    ) : isCancelled ? (
                        <TouchableOpacity style={styles.helpButton} onPress={onHelp}>
                            <Text style={styles.helpText}>Help</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        ...Shadows.card,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: Spacing.base,
    },
    cardCancelled: {
        opacity: 0.75,
    },
    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    dateText: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textSubLight,
    },
    co2Badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 4,
    },
    co2Text: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_500Medium',
        color: '#15803D',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    statusCompleted: {
        backgroundColor: '#DCFCE7',
    },
    statusCancelled: {
        backgroundColor: '#F3F4F6',
    },
    statusText: {
        fontSize: 10,
        fontFamily: 'Inter_700Bold',
        letterSpacing: 0.5,
    },
    statusTextCompleted: {
        color: '#15803D',
    },
    statusTextCancelled: {
        color: Colors.textSubLight,
    },
    // Route
    routeContainer: {
        marginBottom: 16,
        paddingLeft: 4,
    },
    routeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    dot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginTop: 2,
    },
    dotPickup: {
        borderWidth: 4,
        borderColor: Colors.accent,
        backgroundColor: Colors.white,
    },
    dotGray: {
        borderWidth: 4,
        borderColor: Colors.textSubLight,
        backgroundColor: Colors.white,
    },
    dotDropoff: {
        backgroundColor: '#CBD5E1',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    routeTextContainer: {
        flex: 1,
    },
    routeName: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    routeAddress: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
        marginTop: 1,
    },
    // Dashed line
    dashedLineContainer: {
        marginLeft: 6,
        paddingVertical: 4,
        gap: 3,
    },
    dashSegment: {
        width: 2,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 1,
    },
    // Divider
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    // Footer
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    fareLabel: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
    },
    fareAmount: {
        fontSize: FontSizes.lg,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    fareCancelled: {
        textDecorationLine: 'line-through',
        color: Colors.textSubLight,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rebookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.accent,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
    },
    rebookText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    helpButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.backgroundLight,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    helpText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_700Bold',
        color: Colors.textSubLight,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
    },
    ratingText: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
});
