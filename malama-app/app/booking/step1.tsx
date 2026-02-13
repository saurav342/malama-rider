import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { GoogleMap } from '../../src/components/GoogleMap';
import { LocationSearchModal } from '../../src/components/LocationSearchModal';
import { Button } from '../../src/components/Button';

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
    const [currentLocationCoords, setCurrentLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

    // ── Terminal state ──
    const [terminal, setTerminal] = useState<'terminal1' | 'terminal2' | null>(null);

    // ── Place state ──
    const [pickupPlace, setPickupPlace] = useState<string>('');
    const [dropPlace, setDropPlace] = useState<string>('');

    // ── Search modal state ──
    const [searchModalVisible, setSearchModalVisible] = useState(false);
    const [searchTarget, setSearchTarget] = useState<'pickup' | 'drop'>('pickup');

    // ── Date/Time state ──
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
                const coords = {
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude,
                };
                setMapCenter(coords);
                setCurrentLocationCoords(coords);

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
                        // Auto-fill the correct field based on initial service type
                        setPickupPlace(name); // default is 'drop', so pickup = current location
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

    // ── Auto-fill the correct field when service type changes ──
    useEffect(() => {
        setTerminal(null);
        if (currentLocationName && currentLocationName !== 'Current Location') {
            if (serviceType === 'drop') {
                // Airport Drop: going FROM current location TO airport
                // Pickup = current location (auto-fill), drop = airport (via terminal)
                setPickupPlace(currentLocationName);
                setDropPlace('');
            } else {
                // Airport Pickup: going FROM airport TO current location 
                // Pickup = airport (via terminal), drop = current location (auto-fill)
                setDropPlace(currentLocationName);
                setPickupPlace('');
            }
        }
    }, [serviceType]);

    // ── Search modal handlers ──
    const openSearch = (target: 'pickup' | 'drop') => {
        setSearchTarget(target);
        setSearchModalVisible(true);
    };

    const handleSearchSelect = (place: { name: string; latitude: number; longitude: number; address: string }) => {
        setMapCenter({ lat: place.latitude, lng: place.longitude });
        const displayName = place.address || place.name || '';
        if (searchTarget === 'pickup') {
            setPickupPlace(displayName);
        } else {
            setDropPlace(displayName);
        }
        setSearchModalVisible(false);
    };

    // ── Picker handlers ──
    const onDateChange = (_event: DateTimePickerEvent, date?: Date) => {
        setShowDatePicker(false);
        if (date) {
            const merged = new Date(selectedDate);
            merged.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
            const min = getMinimumDate(4);
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
            pickupLocation: pickupPlace || currentLocationName,
            dropLocation: dropPlace || '',
        });
        router.push(`/booking/step3?${params.toString()}`);
    };

    // ── Location display field ──  
    const renderLocationField = (
        label: string,
        value: string,
        target: 'pickup' | 'drop',
        isAutoFilled: boolean
    ) => (
        <View style={styles.locationFieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <TouchableOpacity
                style={[
                    styles.locationField,
                    isAutoFilled && styles.locationFieldAutoFilled,
                ]}
                onPress={() => openSearch(target)}
                activeOpacity={0.7}
            >
                <MaterialIcons
                    name={isAutoFilled ? 'my-location' : 'location-on'}
                    size={20}
                    color={isAutoFilled ? Colors.primary : Colors.textSubLight}
                />
                <Text
                    style={[
                        styles.locationFieldText,
                        !value && styles.locationFieldPlaceholder,
                    ]}
                    numberOfLines={1}
                >
                    {value || `Search for ${label.toLowerCase()}`}
                </Text>
                <MaterialIcons name="chevron-right" size={20} color={Colors.textSubLight} />
            </TouchableOpacity>
        </View>
    );

    // ── Terminal Selector ──
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
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
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
                        AIRPORT DROP:  Pickup Location (auto-filled) → Terminal
                        AIRPORT PICKUP: Terminal → Drop Location (auto-filled)
                    ═══════════════════════════════════════════════ */}

                    {serviceType === 'drop' ? (
                        <>
                            {/* Pickup = current location (auto-filled) for Airport Drop */}
                            {renderLocationField(
                                'PICKUP LOCATION',
                                pickupPlace,
                                'pickup',
                                pickupPlace === currentLocationName
                            )}
                            {renderTerminalSelector()}
                        </>
                    ) : (
                        <>
                            {renderTerminalSelector()}
                            {/* Drop = current location (auto-filled) for Airport Pickup */}
                            {renderLocationField(
                                'DROP LOCATION',
                                dropPlace,
                                'drop',
                                dropPlace === currentLocationName
                            )}
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
            </View>

            {/* Location Search Modal (Uber-like full screen) */}
            <LocationSearchModal
                visible={searchModalVisible}
                onClose={() => setSearchModalVisible(false)}
                onSelect={handleSearchSelect}
                title={searchTarget === 'pickup' ? 'Pickup Location' : 'Drop Location'}
                placeholder={searchTarget === 'pickup' ? 'Search pickup location' : 'Search drop location'}
                initialValue={searchTarget === 'pickup' ? pickupPlace : dropPlace}
                currentLocationName={currentLocationName}
                currentLocationCoords={currentLocationCoords}
            />

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
                    minuteInterval={15}
                    onChange={onTimeChange}
                />
            )}
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
    // Location field (tappable, opens modal)
    locationFieldContainer: {
        marginBottom: Spacing.base,
    },
    locationField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        paddingVertical: 14,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 10,
    },
    locationFieldAutoFilled: {
        borderColor: Colors.primaryLight,
        backgroundColor: '#F0FFF4',
    },
    locationFieldText: {
        flex: 1,
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    locationFieldPlaceholder: {
        color: Colors.textSubLight,
    },
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
