/**
 * Data Types — Malama EV Cabs
 * Shared TypeScript interfaces for the app.
 */

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    avatarUrl: string;
    co2Saved: string;
    verified: boolean;
}

export interface RideRoute {
    pickupName: string;
    pickupAddress: string;
    dropoffName: string;
    dropoffAddress: string;
}

export interface Ride {
    id: string;
    date: string;
    time: string;
    status: 'completed' | 'cancelled' | 'upcoming';
    route: RideRoute;
    fare: number;
    currency: string;
    co2Saved?: string;
    rating?: number;
}

export interface FareStructure {
    label: string;
    amount: number;
}

export interface CountryCode {
    label: string;
    value: string;
    flag: string;
}

export interface BookingDetails {
    type: 'airport_drop' | 'airport_pickup';
    date: Date;
    pickupLocation: string;
    passengerName: string;
    whatsappNumber: string;
    email?: string;
    specialRequirements?: string;
    returnTrip: boolean;
}
