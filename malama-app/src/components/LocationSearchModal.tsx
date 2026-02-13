import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9lLzMusVT5Jzn6KV9hOMv0HFaCtE6nQs';

interface PlaceResult {
    name: string;
    latitude: number;
    longitude: number;
    address: string;
}

interface Prediction {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

interface LocationSearchModalProps {
    visible: boolean;
    onClose: () => void;
    onSelect: (place: PlaceResult) => void;
    /** Label shown in the header, e.g. "Pickup Location" */
    title?: string;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** Initial value to pre-fill the search input */
    initialValue?: string;
    /** Current location name to show as first suggestion */
    currentLocationName?: string;
    /** Current location coords for the "Use Current Location" option */
    currentLocationCoords?: { lat: number; lng: number } | null;
}

export function LocationSearchModal({
    visible,
    onClose,
    onSelect,
    title = 'Search Location',
    placeholder = 'Search for a location',
    initialValue = '',
    currentLocationName,
    currentLocationCoords,
}: LocationSearchModalProps) {
    const insets = useSafeAreaInsets();
    const inputRef = useRef<TextInput>(null);
    const [query, setQuery] = useState(initialValue);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (visible) {
            setQuery(initialValue);
            setPredictions([]);
            // Auto-focus with small delay for modal animation
            setTimeout(() => {
                inputRef.current?.focus();
            }, 300);
        }
    }, [visible, initialValue]);

    const fetchPredictions = useCallback(async (text: string) => {
        if (text.length < 2) {
            setPredictions([]);
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&components=country:in&types=geocode|establishment&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();
            if (data.predictions && data.predictions.length > 0) {
                setPredictions(data.predictions);
            } else {
                setPredictions([]);
            }
        } catch (error) {
            console.warn('Places autocomplete error:', error);
            setPredictions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleChangeText = useCallback((text: string) => {
        setQuery(text);
        // Debounce API calls
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
            fetchPredictions(text);
        }, 300);
    }, [fetchPredictions]);

    const handleSelectPrediction = useCallback(async (prediction: Prediction) => {
        Keyboard.dismiss();
        setIsLoading(true);
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();
            if (data.result?.geometry?.location) {
                onSelect({
                    name: prediction.structured_formatting.main_text,
                    latitude: data.result.geometry.location.lat,
                    longitude: data.result.geometry.location.lng,
                    address: prediction.description,
                });
            }
        } catch (error) {
            console.warn('Place details error:', error);
        } finally {
            setIsLoading(false);
        }
    }, [onSelect]);

    const handleSelectCurrentLocation = useCallback(() => {
        if (currentLocationName && currentLocationCoords) {
            Keyboard.dismiss();
            onSelect({
                name: currentLocationName,
                latitude: currentLocationCoords.lat,
                longitude: currentLocationCoords.lng,
                address: currentLocationName,
            });
        }
    }, [currentLocationName, currentLocationCoords, onSelect]);

    const handleClear = useCallback(() => {
        setQuery('');
        setPredictions([]);
        inputRef.current?.focus();
    }, []);

    const renderCurrentLocationRow = () => {
        if (!currentLocationName || !currentLocationCoords) return null;
        return (
            <TouchableOpacity
                style={styles.currentLocationRow}
                onPress={handleSelectCurrentLocation}
                activeOpacity={0.7}
            >
                <View style={styles.currentLocationIcon}>
                    <MaterialIcons name="my-location" size={20} color={Colors.primary} />
                </View>
                <View style={styles.currentLocationTexts}>
                    <Text style={styles.currentLocationTitle}>Use Current Location</Text>
                    <Text style={styles.currentLocationAddress} numberOfLines={1}>
                        {currentLocationName}
                    </Text>
                </View>
                <MaterialIcons name="north-east" size={18} color={Colors.textSubLight} />
            </TouchableOpacity>
        );
    };

    const renderPredictionItem = ({ item }: { item: Prediction }) => (
        <TouchableOpacity
            style={styles.resultRow}
            onPress={() => handleSelectPrediction(item)}
            activeOpacity={0.7}
        >
            <View style={styles.resultIcon}>
                <MaterialIcons name="place" size={20} color={Colors.textSubLight} />
            </View>
            <View style={styles.resultTexts}>
                <Text style={styles.resultMain} numberOfLines={1}>
                    {item.structured_formatting.main_text}
                </Text>
                <Text style={styles.resultSecondary} numberOfLines={1}>
                    {item.structured_formatting.secondary_text}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.modalContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={onClose}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={Colors.textMainLight} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <MaterialIcons name="search" size={22} color={Colors.textSubLight} />
                        <TextInput
                            ref={inputRef}
                            style={styles.searchInput}
                            placeholder={placeholder}
                            placeholderTextColor={Colors.textSubLight}
                            value={query}
                            onChangeText={handleChangeText}
                            autoCorrect={false}
                            returnKeyType="search"
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
                                <MaterialIcons name="close" size={20} color={Colors.textSubLight} />
                            </TouchableOpacity>
                        )}
                        {isLoading && (
                            <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 4 }} />
                        )}
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Results */}
                <FlatList
                    data={predictions}
                    keyExtractor={(item) => item.place_id}
                    keyboardShouldPersistTaps="handled"
                    ListHeaderComponent={renderCurrentLocationRow}
                    renderItem={renderPredictionItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={[styles.resultsList, { paddingBottom: insets.bottom + 20 }]}
                    ListEmptyComponent={
                        query.length >= 2 && !isLoading ? (
                            <View style={styles.emptyState}>
                                <MaterialIcons name="search-off" size={40} color="#D1D5DB" />
                                <Text style={styles.emptyText}>No results found</Text>
                            </View>
                        ) : query.length < 2 ? (
                            <View style={styles.emptyState}>
                                <MaterialIcons name="location-searching" size={40} color="#D1D5DB" />
                                <Text style={styles.emptyText}>Type to search for a location</Text>
                            </View>
                        ) : null
                    }
                />
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.base,
        paddingBottom: Spacing.sm,
        backgroundColor: Colors.white,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: FontSizes.lg,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textMainLight,
    },
    headerSpacer: {
        width: 40,
    },
    // Search
    searchContainer: {
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: BorderRadius.md,
        paddingHorizontal: 14,
        height: 50,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: FontSizes.base,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
        height: '100%',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    // Current location row
    currentLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: Spacing.base,
        gap: 14,
        backgroundColor: '#F0FFF4',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    currentLocationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentLocationTexts: {
        flex: 1,
    },
    currentLocationTitle: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.primary,
    },
    currentLocationAddress: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_400Regular',
        color: Colors.textSubLight,
        marginTop: 2,
    },
    // Result rows
    resultsList: {
        flexGrow: 1,
    },
    resultRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: Spacing.base,
        gap: 14,
    },
    resultIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultTexts: {
        flex: 1,
    },
    resultMain: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    resultSecondary: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_400Regular',
        color: Colors.textSubLight,
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 64,
    },
    // Empty state
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        gap: 12,
    },
    emptyText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_400Regular',
        color: Colors.textSubLight,
    },
});
