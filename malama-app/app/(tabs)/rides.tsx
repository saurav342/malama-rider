import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/Theme';
import { RideCard } from '../../src/components/RideCard';
import { Ride } from '../../src/data/types';

export default function RidesScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'history' | 'upcoming'>('history');

    // TODO: Replace with API data
    const rides: Ride[] = [
        {
            id: '1',
            date: 'This Month — 12 Feb',
            time: '06:30 AM',
            status: 'completed',
            route: {
                pickupName: 'Whitefield',
                pickupAddress: 'ITPL Main Rd, Whitefield, Bengaluru 560066',
                dropoffName: 'Kempegowda Airport',
                dropoffAddress: 'KIAL Rd, Devanahalli, Bengaluru 560300',
            },
            fare: 1250,
            currency: '₹',
            co2Saved: '2.4kg',
            rating: 4.8,
        },
        {
            id: '2',
            date: 'This Month — 8 Feb',
            time: '11:15 PM',
            status: 'completed',
            route: {
                pickupName: 'Kempegowda Airport',
                pickupAddress: 'Terminal 1, KIAL Rd, Devanahalli, Bengaluru 560300',
                dropoffName: 'Mahavir Ranches',
                dropoffAddress: 'Jigani – Bommasandra Link Rd, Anekal, Bengaluru 562106',
            },
            fare: 1450,
            currency: '₹',
            co2Saved: '3.1kg',
        },
        {
            id: '3',
            date: 'Last Month — 25 Jan',
            time: '04:45 AM',
            status: 'cancelled',
            route: {
                pickupName: 'Marathahalli',
                pickupAddress: 'Marathahalli Bridge, Bengaluru 560037',
                dropoffName: 'Kempegowda Airport',
                dropoffAddress: 'KIAL Rd, Devanahalli, Bengaluru 560300',
            },
            fare: 1100,
            currency: '₹',
        },
        {
            id: '4',
            date: 'Last Month — 18 Jan',
            time: '09:00 PM',
            status: 'completed',
            route: {
                pickupName: 'Kempegowda Airport',
                pickupAddress: 'Terminal 2, KIAL Rd, Devanahalli, Bengaluru 560300',
                dropoffName: 'Bellandur',
                dropoffAddress: 'Outer Ring Rd, Bellandur, Bengaluru 560103',
            },
            fare: 1350,
            currency: '₹',
            co2Saved: '2.8kg',
            rating: 4.5,
        },
    ];
    const thisMonthRides = rides.filter((r) => r.date.includes('This'));
    const lastMonthRides = rides.filter((r) => r.date.includes('Last'));

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color={Colors.textMainLight} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Rides</Text>
                <TouchableOpacity style={styles.headerBtn}>
                    <MaterialIcons name="filter-list" size={24} color={Colors.textSubLight} />
                </TouchableOpacity>
            </View>

            {/* Segmented Control */}
            <View style={styles.segmentContainer}>
                <View style={styles.segmentTrack}>
                    <TouchableOpacity
                        style={[styles.segmentButton, activeTab === 'history' && styles.segmentActive]}
                        onPress={() => setActiveTab('history')}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                activeTab === 'history' && styles.segmentTextActive,
                            ]}
                        >
                            History
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.segmentButton, activeTab === 'upcoming' && styles.segmentActive]}
                        onPress={() => setActiveTab('upcoming')}
                    >
                        <Text
                            style={[
                                styles.segmentText,
                                activeTab === 'upcoming' && styles.segmentTextActive,
                            ]}
                        >
                            Upcoming
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {activeTab === 'history' ? (
                    <>
                        {/* This Month */}
                        <Text style={styles.sectionLabel}>THIS MONTH</Text>
                        {thisMonthRides.map((ride) => (
                            <RideCard
                                key={ride.id}
                                ride={ride}
                                onRebook={() => router.push('/booking/step1')}
                                onHelp={() => { }}
                            />
                        ))}

                        {/* Last Month */}
                        {lastMonthRides.length > 0 && (
                            <>
                                <Text style={[styles.sectionLabel, { marginTop: 8 }]}>LAST MONTH</Text>
                                {lastMonthRides.map((ride) => (
                                    <RideCard
                                        key={ride.id}
                                        ride={ride}
                                        onRebook={() => router.push('/booking/step1')}
                                    />
                                ))}
                            </>
                        )}
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <MaterialIcons name="event-available" size={48} color={Colors.textSubLight} />
                        <Text style={styles.emptyTitle}>No upcoming rides</Text>
                        <Text style={styles.emptySubtitle}>
                            Book an airport transfer to see it here
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/booking/step1')}
                activeOpacity={0.85}
            >
                <MaterialIcons name="add" size={28} color={Colors.white} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.base,
    },
    headerBtn: {
        padding: 8,
        borderRadius: BorderRadius.full,
    },
    headerTitle: {
        fontSize: FontSizes.lg,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    // Segment
    segmentContainer: {
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    segmentTrack: {
        flexDirection: 'row',
        backgroundColor: '#E2E8F0',
        borderRadius: BorderRadius.md,
        padding: 4,
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: BorderRadius.sm,
    },
    segmentActive: {
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
        elevation: 2,
    },
    segmentText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSubLight,
    },
    segmentTextActive: {
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    // Content
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 100,
    },
    sectionLabel: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_700Bold',
        color: Colors.textSubLight,
        letterSpacing: 1,
        marginBottom: Spacing.md,
        marginTop: Spacing.sm,
    },
    // Empty state
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        gap: 8,
    },
    emptyTitle: {
        fontSize: FontSizes.lg,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textMainLight,
    },
    emptySubtitle: {
        fontSize: FontSizes.md,
        color: Colors.textSubLight,
        textAlign: 'center',
    },
    // FAB
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.textMainLight,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
});
