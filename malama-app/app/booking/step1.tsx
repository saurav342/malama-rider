import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
    KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { GoogleMap } from '../../src/components/GoogleMap';
import { PlacesAutocomplete } from '../../src/components/PlacesAutocomplete';
import { Button } from '../../src/components/Button';
import { Stepper } from '../../src/components/Stepper';
import { DropdownProvider } from '../../src/context/DropdownContext';

/**
 * Rounds a Date object up to the next 15-minute interval.
 */
function roundToNext15Minutes(date: Date): Date {
    const d = new Date(date);
    const minutes = d.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
        d.setMinutes(minutes + (15 - remainder));
    }
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
}

/**
 * Returns a Date object that is at least `minHoursAhead` hours from now,
 * rounded up to the next 15-minute slot.
 */
function getMinimumDate(minHoursAhead = 4): Date {
    const d = new Date();
    d.setHours(d.getHours() + minHoursAhead);
    return roundToNext15Minutes(d);
}

function formatDate(d: Date): string {
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
}

function formatTime(d: Date): string {
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

export default function BookingStep1() {
    const router = useRouter();
    const [serviceType, setServiceType] = useState<'drop' | 'pickup'>('drop');

    // ── Location state ──
    const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });
    const [locationLoading, setLocationLoading] = useState(true);
    const [currentLocationName, setCurrentLocationName] = useState('Current Location');

    // ── Terminal state ──
    const [terminal, setTerminal] = useState<'terminal1' | 'terminal2' | null>(null);

    // ── Place state ──
    const [pickupPlace, setPickupPlace] = useState<string>('');
    const [dropPlace, setDropPlace] = useState<string>('');

    // ── Date/Time state ──
    // We get the rounded minimum date
    const minDate = getMinimumDate(4);
    const [selectedDate, setSelectedDate] = useState<Date>(minDate);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // ── Fetch current location on mount ──
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.warn('Location permission not granted');
                    setLocationLoading(false);
                    return;
                }
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                setMapCenter({
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude,
                });

                // Reverse geocode to get human-readable name
                try {
                    const [geo] = await Location.reverseGeocodeAsync({
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    });
                    if (geo) {
                        const parts = [geo.name, geo.street, geo.city].filter(Boolean);
                        const name = parts.join(', ') || 'Current Location';
                        setCurrentLocationName(name);
                        setPickupPlace(name);
                    }
                } catch {
                    setPickupPlace('Current Location');
                }
            } catch (err) {
                console.warn('Failed to get location:', err);
            } finally {
                setLocationLoading(false);
            }
        })();
    }, []);

    // Reset terminal when switching tabs
    useEffect(() => {
        setTerminal(null);
    }, [serviceType]);

    // ── Picker handlers ──
    const onDateChange = (_event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            const merged = new Date(selectedDate);
            merged.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            // Re-check minimum constraint
            const min = getMinimumDate(4);
            // If the merged date is before minimum, snap to minimum
            // otherwise keep the merged date (which preserves time)
            if (merged < min) {
                setSelectedDate(min);
            } else {
                setSelectedDate(merged);
            }
        }
    };

    const onTimeChange = (_event: DateTimePickerEvent, date?: Date) => {
        setShowTimePicker(false);
        if (date) {
            const merged = new Date(selectedDate);
            merged.setHours(date.getHours(), date.getMinutes(), 0, 0);

            // Round to 15 mins if the native picker allows un-rounded input
            // (iOS spinner with minuteInterval enforces it, but Android might not)
            const rounded = roundToNext15Minutes(merged);

            const min = getMinimumDate(4);
            if (rounded < min) {
                setSelectedDate(min);
            } else {
                setSelectedDate(rounded);
            }
        }
    };

    const handleNext = () => {
        const params = new URLSearchParams({
            serviceType,
            terminal: terminal || '',
            date: selectedDate.toISOString(),
        });
        if (serviceType === 'drop') {
            params.set('pickupLocation', pickupPlace || currentLocationName);
        } else {
            params.set('dropLocation', dropPlace);
        }
        router.push(`/booking/step2?${params.toString()}`);
    };

    // ── Terminal Selector Component ──
    const renderTerminalSelector = () => (
        <View style={styles.terminalSection}>
            <Text style={styles.fieldLabel}>SELECT TERMINAL</Text>
            <View style={styles.terminalRow}>
                <TouchableOpacity
                    style={[
                        styles.terminalPill,
                        terminal === 'terminal1' && styles.terminalPillActive,
                    ]}
                    onPress={() => setTerminal('terminal1')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="flight"
                        size={18}
                        color={terminal === 'terminal1' ? Colors.white : Colors.textSubLight}
                    />
                    <Text
                        style={[
                            styles.terminalPillText,
                            terminal === 'terminal1' && styles.terminalPillTextActive,
                        ]}
                    >
                        Terminal 1
                    </Text>
                    {terminal === 'terminal1' && (
                        <MaterialIcons name="check-circle" size={16} color={Colors.white} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.terminalPill,
                        terminal === 'terminal2' && styles.terminalPillActive,
                    ]}
                    onPress={() => setTerminal('terminal2')}
                    activeOpacity={0.7}
                >
                    <MaterialIcons
                        name="flight"
                        size={18}
                        color={terminal === 'terminal2' ? Colors.white : Colors.textSubLight}
                    />
                    <Text
                        style={[
                            styles.terminalPillText,
                            terminal === 'terminal2' && styles.terminalPillTextActive,
                        ]}
                    >
                        Terminal 2
                    </Text>
                    {terminal === 'terminal2' && (
                        <MaterialIcons name="check-circle" size={16} color={Colors.white} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <DropdownProvider>
            <View style={styles.container}>
                {/* Map Background */}
                <View style={styles.mapContainer}>
                    {locationLoading ? (
                        <View style={styles.mapLoading}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                            <Text style={styles.mapLoadingText}>Getting your location…</Text>
                        </View>
                    ) : (
                        <GoogleMap
                            latitude={mapCenter.lat}
                            longitude={mapCenter.lng}
                            zoom={13}
                            showMarker={true}
                            markerTitle="Pickup Location"
                        />
                    )}

                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.8}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={Colors.textMainLight} />
                    </TouchableOpacity>

                </View>

                {/* Bottom Sheet */}
                <View style={styles.bottomSheet}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
                        style={{ width: '100%' }}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
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
                                    <TouchableOpacity
                                        style={styles.dateTimeInput}
                                        onPress={() => setShowDatePicker(true)}
                                    >
                                        <Text style={styles.dateTimeValue}>{formatDate(selectedDate)}</Text>
                                        <MaterialIcons name="calendar-today" size={16} color={Colors.textSubLight} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dateTimeCol}>
                                    <Text style={styles.fieldLabel}>TIME</Text>
                                    <TouchableOpacity
                                        style={styles.dateTimeInput}
                                        onPress={() => setShowTimePicker(true)}
                                    >
                                        <Text style={styles.dateTimeValue}>{formatTime(selectedDate)}</Text>
                                        <MaterialIcons name="access-time" size={16} color={Colors.textSubLight} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Minimum notice hint */}
                            <View style={styles.hintRow}>
                                <MaterialIcons name="info-outline" size={14} color={Colors.primary} />
                                <Text style={styles.hintText}>
                                    Bookings must be at least 4 hours in advance
                                </Text>
                            </View>

                            {/* ═══════════════════════════════════════════════
                            AIRPORT DROP:  Pickup Location → Terminal
                            AIRPORT PICKUP: Terminal → Drop Location
                        ═══════════════════════════════════════════════ */}

                            {serviceType === 'drop' ? (
                                <>
                                    {/* Pickup Location (Google autocomplete) */}
                                    <View style={{ zIndex: 100 }}>
                                        <PlacesAutocomplete
                                            label="PICKUP LOCATION"
                                            placeholder="Search for pickup location"
                                            value={pickupPlace}
                                            onSelect={(place) => {
                                                setMapCenter({ lat: place.latitude, lng: place.longitude });
                                                setPickupPlace(place.address || place.name || '');
                                            }}
                                        />
                                    </View>



                                    {/* Terminal Selector */}
                                    {renderTerminalSelector()}
                                </>
                            ) : (
                                <>
                                    {/* Terminal Selector */}
                                    {renderTerminalSelector()}

                                    {/* Drop Location (Google autocomplete) */}
                                    <View style={{ zIndex: 100 }}>
                                        <PlacesAutocomplete
                                            label="DROP LOCATION"
                                            placeholder="Search for drop location"
                                            value={dropPlace}
                                            onSelect={(place) => {
                                                setMapCenter({ lat: place.latitude, lng: place.longitude });
                                                setDropPlace(place.address || place.name || '');
                                            }}
                                        />
                                    </View>
                                </>
                            )}

                            {/* Next Step */}
                            <View style={[styles.nextButtonContainer, { zIndex: 1 }]}>
                                <Button
                                    title="Next Step"
                                    onPress={handleNext}
                                    icon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
                                />
                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>

                {/* Native Date Picker */}
                {showDatePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        minimumDate={getMinimumDate(4)}
                        onChange={onDateChange}
                    />
                )}

                {/* Native Time Picker */}
                {showTimePicker && (
                    <DateTimePicker
                        value={selectedDate}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        // Enforce 15-min intervals on iOS
                        minuteInterval={15}
                        onChange={onTimeChange}
                    />
                )}
            </View>
        </DropdownProvider>
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
        zIndex: 100,
        elevation: 10,
    },
    mapLoading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E7EB',
        gap: 12,
    },
    mapLoadingText: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_500Medium',
        color: Colors.textSubLight,
    },


    // Bottom sheet
    bottomSheet: {
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        ...Shadows.bottomSheet,
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.xl,
        paddingTop: Spacing.xl,
        maxHeight: '65%',
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
        marginBottom: 8,
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
    // Hint
    hintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: Spacing.base,
        paddingHorizontal: 2,
    },
    hintText: {
        fontSize: FontSizes.xs,
        fontFamily: 'Inter_400Regular',
        color: Colors.primary,
    },
    // Current location chip

    // Terminal selector
    terminalSection: {
        marginBottom: Spacing.base,
    },
    terminalRow: {
        flexDirection: 'row',
        gap: 12,
    },
    terminalPill: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: BorderRadius.md,
        backgroundColor: '#F3F4F6',
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
    },
    terminalPillActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        ...Shadows.card,
    },
    terminalPillText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textSubLight,
    },
    terminalPillTextActive: {
        color: Colors.white,
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
