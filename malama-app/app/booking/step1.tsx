import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { Button } from '../../src/components/Button';
import { Stepper } from '../../src/components/Stepper';
import { TextInput } from '../../src/components/TextInput';

export default function BookingStep1() {
    const router = useRouter();
    const [serviceType, setServiceType] = useState<'drop' | 'pickup'>('drop');
    const [date, setDate] = useState('02/13/2026');
    const [time, setTime] = useState('03:00 AM');
    const [pickup, setPickup] = useState('Indiranagar, Bangalore');

    return (
        <View style={styles.container}>
            {/* Map Background Placeholder */}
            <View style={styles.mapContainer}>
                <View style={styles.mapPlaceholder}>
                    <View style={styles.mapGrid}>
                        {/* Simulated map grid lines */}
                        {[...Array(8)].map((_, i) => (
                            <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 12}%` }]} />
                        ))}
                        {[...Array(6)].map((_, i) => (
                            <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 16}%` }]} />
                        ))}
                    </View>
                    {/* Location Marker */}
                    <View style={styles.markerContainer}>
                        <MaterialIcons name="location-on" size={48} color={Colors.primary} />
                    </View>
                    {/* Map labels */}
                    <Text style={styles.mapLabel}>Bangalore</Text>
                </View>

                {/* Header Overlay */}
                <SafeAreaView style={styles.headerOverlay}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
                    </TouchableOpacity>
                    <View style={styles.headerBrand}>
                        <MaterialIcons name="eco" size={18} color={Colors.white} />
                        <Text style={styles.headerTitle}>MALAMA CABS</Text>
                    </View>
                    <TouchableOpacity style={styles.headerButton}>
                        <MaterialIcons name="menu" size={24} color={Colors.white} />
                    </TouchableOpacity>
                </SafeAreaView>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>
                <View style={styles.dragHandle} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Stepper currentStep={1} />

                    <Text style={styles.title}>Plan Your Trip</Text>

                    {/* Service Type Toggle */}
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleButton, serviceType === 'drop' && styles.toggleActive]}
                            onPress={() => setServiceType('drop')}
                        >
                            <MaterialIcons
                                name="flight-land"
                                size={18}
                                color={serviceType === 'drop' ? Colors.primary : Colors.textSubLight}
                            />
                            <Text
                                style={[
                                    styles.toggleText,
                                    serviceType === 'drop' && styles.toggleTextActive,
                                ]}
                            >
                                Airport Drop
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, serviceType === 'pickup' && styles.toggleActive]}
                            onPress={() => setServiceType('pickup')}
                        >
                            <MaterialIcons
                                name="flight-takeoff"
                                size={18}
                                color={serviceType === 'pickup' ? Colors.primary : Colors.textSubLight}
                            />
                            <Text
                                style={[
                                    styles.toggleText,
                                    serviceType === 'pickup' && styles.toggleTextActive,
                                ]}
                            >
                                Airport Pickup
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Date & Time */}
                    <View style={styles.dateTimeRow}>
                        <View style={styles.dateTimeCol}>
                            <Text style={styles.fieldLabel}>DATE</Text>
                            <TouchableOpacity style={styles.dateTimeInput}>
                                <Text style={styles.dateTimeValue}>{date}</Text>
                                <MaterialIcons name="calendar-today" size={16} color={Colors.textSubLight} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.dateTimeCol}>
                            <Text style={styles.fieldLabel}>TIME</Text>
                            <TouchableOpacity style={styles.dateTimeInput}>
                                <Text style={styles.dateTimeValue}>{time}</Text>
                                <MaterialIcons name="access-time" size={16} color={Colors.textSubLight} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Pickup Location */}
                    <TextInput
                        label="PICKUP LOCATION"
                        placeholder="Search for a location"
                        value={pickup}
                        onChangeText={setPickup}
                        leadingIcon={
                            <MaterialIcons name="location-on" size={22} color={Colors.primary} />
                        }
                        trailingIcon={
                            <TouchableOpacity style={styles.myLocationButton}>
                                <MaterialIcons name="my-location" size={18} color={Colors.textSubLight} />
                            </TouchableOpacity>
                        }
                    />

                    {/* Next Step */}
                    <View style={styles.nextButtonContainer}>
                        <Button
                            title="Next Step"
                            onPress={() => router.push('/booking/step2')}
                            icon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
                        />
                    </View>
                </ScrollView>
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
    mapContainer: {
        flex: 1,
        position: 'relative',
    },
    mapPlaceholder: {
        flex: 1,
        backgroundColor: '#E8EDE9',
        position: 'relative',
        overflow: 'hidden',
    },
    mapGrid: {
        ...StyleSheet.absoluteFillObject,
    },
    gridLineH: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#D1D5DB',
        opacity: 0.3,
    },
    gridLineV: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: '#D1D5DB',
        opacity: 0.3,
    },
    markerContainer: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        marginLeft: -24,
        marginTop: -48,
    },
    mapLabel: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -30,
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textSubLight,
        opacity: 0.5,
    },
    // Header overlay
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerButton: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: BorderRadius.full,
        padding: 8,
    },
    headerBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    headerTitle: {
        fontSize: FontSizes.base,
        fontFamily: 'Inter_700Bold',
        color: Colors.white,
        letterSpacing: 1,
    },
    // Bottom sheet
    bottomSheet: {
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        ...Shadows.bottomSheet,
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl,
        maxHeight: '60%',
    },
    dragHandle: {
        width: 48,
        height: 5,
        backgroundColor: '#D1D5DB',
        borderRadius: 3,
        alignSelf: 'center',
        marginVertical: Spacing.md,
        opacity: 0.5,
    },
    title: {
        fontSize: FontSizes.xl,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
        marginBottom: Spacing.base,
    },
    // Toggle
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: BorderRadius.md,
        padding: 6,
        marginBottom: Spacing.base,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        borderRadius: BorderRadius.sm,
    },
    toggleActive: {
        backgroundColor: Colors.white,
        ...Shadows.card,
    },
    toggleText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textSubLight,
    },
    toggleTextActive: {
        color: Colors.primary,
    },
    // Date/Time
    dateTimeRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Spacing.base,
    },
    dateTimeCol: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: FontSizes.xs,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textSubLight,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    dateTimeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    dateTimeValue: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    // My location
    myLocationButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: BorderRadius.sm,
        padding: 6,
    },
    // Next button
    nextButtonContainer: {
        marginTop: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
});
