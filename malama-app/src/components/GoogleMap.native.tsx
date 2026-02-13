import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

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

/**
 * Convert web-style zoom level to react-native-maps latitudeDelta.
 */
function zoomToLatDelta(zoom: number): number {
    return 360 / Math.pow(2, zoom);
}

export function GoogleMap({
    latitude,
    longitude,
    zoom = 14,
    style,
    directions,
    showMarker = true,
    markerTitle,
}: GoogleMapProps) {
    const latDelta = zoomToLatDelta(zoom);
    const lngDelta = latDelta * 1.5;

    if (directions) {
        const midLat = (directions.originLat + directions.destLat) / 2;
        const midLng = (directions.originLng + directions.destLng) / 2;
        const dLat = Math.abs(directions.originLat - directions.destLat) * 1.5;
        const dLng = Math.abs(directions.originLng - directions.destLng) * 1.5;

        return (
            <View style={[styles.container, style]}>
                <MapView
                    style={StyleSheet.absoluteFillObject}
                    provider="google"
                    initialRegion={{
                        latitude: midLat,
                        longitude: midLng,
                        latitudeDelta: Math.max(dLat, 0.02),
                        longitudeDelta: Math.max(dLng, 0.02),
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                >
                    <Marker
                        coordinate={{
                            latitude: directions.originLat,
                            longitude: directions.originLng,
                        }}
                        title="Pickup"
                        pinColor="#2E7D32"
                    />
                    <Marker
                        coordinate={{
                            latitude: directions.destLat,
                            longitude: directions.destLng,
                        }}
                        title="Drop-off"
                        pinColor="#EF4444"
                    />
                </MapView>
            </View>
        );
    }

    return (
        <View style={[styles.container, style]}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                provider="google"
                initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: latDelta,
                    longitudeDelta: lngDelta,
                }}
                region={{
                    latitude,
                    longitude,
                    latitudeDelta: latDelta,
                    longitudeDelta: lngDelta,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
                rotateEnabled={false}
            >
                {showMarker && (
                    <Marker
                        coordinate={{ latitude, longitude }}
                        title={markerTitle || 'Location'}
                        pinColor="#2E7D32"
                    />
                )}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
});
