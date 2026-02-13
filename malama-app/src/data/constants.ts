/**
 * App Constants — Malama EV Cabs
 * Reference / configuration data used across the app.
 */

import { CountryCode, FareStructure } from './types';

// ─── Country Codes ──────────────────────────────────────────────────────────

export const countryCodes: CountryCode[] = [
    { label: 'India (+91)', value: '+91', flag: '🇮🇳' },
    { label: 'USA (+1)', value: '+1', flag: '🇺🇸' },
    { label: 'UK (+44)', value: '+44', flag: '🇬🇧' },
    { label: 'Australia (+61)', value: '+61', flag: '🇦🇺' },
    { label: 'Singapore (+65)', value: '+65', flag: '🇸🇬' },
];

// ─── Fare Structure ─────────────────────────────────────────────────────────

/** Fares separated by service type for filtered display */
export const faresByServiceType: Record<'drop' | 'pickup', FareStructure[]> = {
    drop: [
        { label: 'Without Toll', amount: 899 },
        { label: 'With Toll', amount: 999 },
    ],
    pickup: [
        { label: 'Without Toll', amount: 999 },
        { label: 'With Toll', amount: 1099 },
    ],
};

/** Legacy flat list for backwards compat */
export const fareStructure: FareStructure[] = [
    ...faresByServiceType.drop.map(f => ({ ...f, label: `City to Airport (${f.label})` })),
    ...faresByServiceType.pickup.map(f => ({ ...f, label: `Airport to City (${f.label})` })),
];
