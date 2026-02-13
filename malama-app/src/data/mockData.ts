/**
 * Mock Data Layer — Phase 1
 * Will be replaced with backend API calls in Phase 2
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

// ─── User Profile ───────────────────────────────────────────────────────────

export const mockUser: UserProfile = {
    name: 'Alex Johnson',
    email: 'alex.j@example.com',
    phone: '+1 (555) 012-3456',
    avatarUrl: 'https://i.pravatar.cc/200?img=12',
    co2Saved: '45kg',
    verified: true,
};

// ─── Country Codes ──────────────────────────────────────────────────────────

export const countryCodes: CountryCode[] = [
    { label: 'India (+91)', value: '+91', flag: '🇮🇳' },
    { label: 'USA (+1)', value: '+1', flag: '🇺🇸' },
    { label: 'UK (+44)', value: '+44', flag: '🇬🇧' },
    { label: 'Australia (+61)', value: '+61', flag: '🇦🇺' },
    { label: 'Singapore (+65)', value: '+65', flag: '🇸🇬' },
];

// ─── Fare Structure ─────────────────────────────────────────────────────────

export const mockFares: FareStructure[] = [
    { label: 'City to Airport (No Toll)', amount: 899 },
    { label: 'City to Airport (With Toll)', amount: 999 },
    { label: 'Airport to City (No Toll)', amount: 999 },
    { label: 'Airport to City (With Toll)', amount: 1099 },
];

// ─── Ride History ───────────────────────────────────────────────────────────

export const mockRides: Ride[] = [
    {
        id: '1',
        date: 'Oct 24',
        time: '10:30 AM',
        status: 'completed',
        route: {
            pickupName: 'Home',
            pickupAddress: '123 Palm Ave, Palo Alto',
            dropoffName: 'SFO Airport',
            dropoffAddress: 'Terminal 2, Departures',
        },
        fare: 45.00,
        currency: '$',
        co2Saved: '0.8kg',
    },
    {
        id: '2',
        date: 'Oct 20',
        time: '08:15 PM',
        status: 'cancelled',
        route: {
            pickupName: 'Office',
            pickupAddress: '450 Market St, SF',
            dropoffName: 'Home',
            dropoffAddress: '123 Palm Ave, Palo Alto',
        },
        fare: 62.50,
        currency: '$',
    },
    {
        id: '3',
        date: 'Sep 28',
        time: '02:45 PM',
        status: 'completed',
        route: {
            pickupName: 'SFO Airport',
            pickupAddress: 'Terminal 3, Arrivals',
            dropoffName: 'Union Square',
            dropoffAddress: '335 Powell St, SF',
        },
        fare: 58.20,
        currency: '$',
        co2Saved: '1.2kg',
        rating: 5.0,
    },
];

// ─── Default Booking ────────────────────────────────────────────────────────

export const defaultBooking: BookingDetails = {
    type: 'airport_drop',
    date: new Date(2026, 1, 13, 3, 0), // Feb 13, 2026 3:00 AM
    pickupLocation: 'Indiranagar, Bangalore',
    passengerName: 'Kumara',
    whatsappNumber: '9090909090',
    email: '',
    specialRequirements: '',
    returnTrip: false,
};

export const confirmationData = {
    passenger: {
        name: 'Kumara',
        phone: '+91 9090909090',
    },
    pickup: 'Mahaveer Ranches, Sai Sree Layout, Parappana Agrahara, Bengaluru',
    dropoff: 'Kempegowda International Airport Terminal 1',
    dateTime: 'Feb 13, 2026 • 3:00 AM',
    status: 'Scheduled' as const,
};
