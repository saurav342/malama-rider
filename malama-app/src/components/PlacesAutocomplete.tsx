import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ViewStyle,
    ActivityIndicator,
    LayoutRectangle,
    findNodeHandle,
    NativeModules,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { useDropdown } from '../context/DropdownContext';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9lLzMusVT5Jzn6KV9hOMv0HFaCtE6nQs';

interface PlacesAutocompleteProps {
    onSelect: (place: {
        name: string;
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
    placeholder?: string;
    label?: string;
    style?: ViewStyle;
    value?: string;
}

interface Prediction {
    place_id: string;
    description: string;
    structured_formatting: {
        main_text: string;
        secondary_text: string;
    };
}

/**
 * Web-compatible Places Autocomplete using Google Places API via fetch.
 * Avoids react-native-google-places-autocomplete which has web-incompatible internals.
 */
export function PlacesAutocomplete({
    onSelect,
    placeholder = 'Search for a location',
    label = 'PICKUP LOCATION',
    style,
    value,
}: PlacesAutocompleteProps) {
    const [query, setQuery] = useState(value || '');
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<View>(null);
    const { showDropdown, hideDropdown } = useDropdown();

    // Update query when value prop changes (for autofill)
    useEffect(() => {
        if (value !== undefined) {
            setQuery(value);
        }
    }, [value]);

    const handleSelect = useCallback(async (prediction: Prediction) => {
        setQuery(prediction.structured_formatting.main_text);
        hideDropdown();

        // Fetch place details for lat/lng
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
        }
    }, [onSelect, hideDropdown]);

    const renderDropdownContent = useCallback((predictions: Prediction[]) => {
        return (
            <View style={styles.dropdown}>
                <FlatList
                    data={predictions}
                    keyExtractor={(item) => item.place_id}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.dropdownItem}
                            onPress={() => handleSelect(item)}
                        >
                            <MaterialIcons name="place" size={18} color={Colors.textSubLight} />
                            <View style={styles.dropdownTexts}>
                                <Text style={styles.dropdownMain} numberOfLines={1}>
                                    {item.structured_formatting.main_text}
                                </Text>
                                <Text style={styles.dropdownSecondary} numberOfLines={1}>
                                    {item.structured_formatting.secondary_text}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            </View>
        );
    }, [handleSelect]);


    const fetchPredictions = useCallback(async (text: string) => {
        if (text.length < 2) {
            hideDropdown();
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&components=country:in&types=geocode|establishment&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();
            if (data.predictions && data.predictions.length > 0) {
                if (inputRef.current) {
                    inputRef.current.measure((x, y, width, height, pageX, pageY) => {
                        showDropdown(
                            renderDropdownContent(data.predictions),
                            { x: pageX, y: pageY, width, height },
                            () => { }
                        );
                    });
                }
            } else {
                hideDropdown();
            }
        } catch (error) {
            console.warn('Places autocomplete error:', error);
            hideDropdown();
        } finally {
            setIsLoading(false);
        }
    }, [hideDropdown, showDropdown, renderDropdownContent]);

    const handleChangeText = useCallback((text: string) => {
        setQuery(text);
        fetchPredictions(text);
    }, [fetchPredictions]);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                ref={inputRef}
                style={styles.inputWrapper}
                onLayout={() => { }} // simple trigger for layout if needed
            >
                <View style={styles.iconLeft}>
                    <MaterialIcons name="location-on" size={22} color={Colors.primary} />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textSubLight}
                    value={query}
                    onChangeText={handleChangeText}
                    onFocus={() => {
                        // Check if we already have query and fetch again or show if we cached results? 
                        // For simplicity, re-fetch if length > 2
                        if (query.length > 1) {
                            fetchPredictions(query);
                        }
                    }}
                />
                {isLoading && (
                    <View style={styles.iconRight}>
                        <ActivityIndicator size="small" color={Colors.primary} />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        zIndex: 10,
    },
    label: {
        fontSize: FontSizes.xs,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textSubLight,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    iconLeft: {
        paddingLeft: 10,
    },
    iconRight: {
        paddingRight: 10,
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: 8,
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    dropdown: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop: 4,
        maxHeight: 220,
        ...Shadows.card, // Reuse shadow style
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 10,
    },
    dropdownTexts: {
        flex: 1,
    },
    dropdownMain: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    dropdownSecondary: {
        fontSize: FontSizes.xs,
        color: Colors.textSubLight,
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
});
