import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    ViewStyle,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing } from '../../constants/Theme';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9lLzMusVT5Jzn6KV9hOMv0HFaCtE6nQs';

interface PlacesAutocompleteProps {
    /** Callback when a place is selected */
    onSelect: (place: {
        name: string;
        latitude: number;
        longitude: number;
        address: string;
    }) => void;
    /** Placeholder text */
    placeholder?: string;
    /** Label shown above the input */
    label?: string;
    /** Container style */
    style?: ViewStyle;
}

export function PlacesAutocomplete({
    onSelect,
    placeholder = 'Search for a location',
    label = 'PICKUP LOCATION',
    style,
}: PlacesAutocompleteProps) {
    const ref = useRef<any>(null);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <GooglePlacesAutocomplete
                ref={ref}
                placeholder={placeholder}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    if (details) {
                        onSelect({
                            name: data.structured_formatting?.main_text || data.description,
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            address: data.description,
                        });
                    }
                }}
                query={{
                    key: GOOGLE_MAPS_API_KEY,
                    language: 'en',
                    components: 'country:in',
                }}
                disableScroll={true}
                styles={{
                    container: {
                        flex: 0,
                        zIndex: 100,
                    },
                    textInputContainer: {
                        backgroundColor: 'transparent',
                    },
                    textInput: {
                        height: 48,
                        backgroundColor: Colors.white,
                        borderRadius: BorderRadius.md,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        paddingLeft: 40,
                        paddingRight: 12,
                        fontSize: FontSizes.md,
                        fontFamily: 'Inter_500Medium',
                        color: Colors.textMainLight,
                    },
                    listView: {
                        position: 'absolute',
                        top: 52,
                        left: 0,
                        right: 0,
                        backgroundColor: Colors.white,
                        borderRadius: BorderRadius.md,
                        borderWidth: 1,
                        borderColor: '#E5E7EB',
                        elevation: 10,
                        zIndex: 9999,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        maxHeight: 220,
                    },
                    row: {
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                    },
                    description: {
                        fontSize: FontSizes.sm,
                        fontFamily: 'Inter_400Regular',
                        color: Colors.textMainLight,
                    },
                    poweredContainer: {
                        display: 'none',
                    },
                    separator: {
                        height: 1,
                        backgroundColor: '#F3F4F6',
                    },
                }}
                textInputProps={{
                    placeholderTextColor: Colors.textSubLight,
                }}
                enablePoweredByContainer={false}
                nearbyPlacesAPI="GooglePlacesSearch"
                debounce={300}
                minLength={2}
                listViewDisplayed="auto"
                keepResultsAfterBlur={true}
                keyboardShouldPersistTaps="handled"
                isRowScrollable={false}
                onFail={(error) => console.warn('PlacesAutocomplete error:', error)}
                onNotFound={() => console.warn('PlacesAutocomplete: no results')}
            />
            {/* Leading icon overlay */}
            <View style={styles.iconOverlay}>
                <MaterialIcons name="location-on" size={22} color={Colors.primary} />
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
    iconOverlay: {
        position: 'absolute',
        left: 10,
        bottom: 13,
        zIndex: 11,
    },
});
