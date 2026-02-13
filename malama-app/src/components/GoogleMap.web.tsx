import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9lLzMusVT5Jzn6KV9hOMv0HFaCtE6nQs';

interface GoogleMapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    style?: ViewStyle;
    directions?: {
        originLat: number;
        originLng: number;
        destLat: number;
        destLng: number;
    };
    showMarker?: boolean;
    markerTitle?: string;
}

export function GoogleMap({
    latitude,
    longitude,
    zoom = 14,
    style,
    directions,
}: GoogleMapProps) {
    let src: string;

    if (directions) {
        src = `https://www.google.com/maps/embed/v1/directions?key=${GOOGLE_MAPS_API_KEY}&origin=${directions.originLat},${directions.originLng}&destination=${directions.destLat},${directions.destLng}&mode=driving`;
    } else {
        src = `https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_API_KEY}&center=${latitude},${longitude}&zoom=${zoom}&maptype=roadmap`;
    }

    return (
        <View style={[styles.container, style]}>
            <iframe
                src={src}
                style={{
                    border: 0,
                    width: '100%',
                    height: '100%',
                }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
});
