/**
 * Malama EV Cabs — Design Tokens
 * Extracted from 6 HTML screen mockups (login, booking x3, rides, profile)
 */

export const Colors = {
  primary: '#2E7D32',
  primaryDark: '#1B5E20',
  primaryLight: '#4CAF50',
  accent: '#30e87a',

  backgroundLight: '#F6F8F7',
  backgroundDark: '#121212',

  surfaceLight: '#FFFFFF',
  surfaceDark: '#1E1E1E',

  cardLight: 'rgba(255, 255, 255, 0.85)',
  cardDark: 'rgba(30, 30, 30, 0.85)',

  textMainLight: '#1F2937',
  textMainDark: '#F3F4F6',

  textSubLight: '#6B7280',
  textSubDark: '#9CA3AF',

  borderLight: '#E5E7EB',
  borderDark: '#374151',

  inputBgLight: '#F3F4F6',
  inputBgDark: '#27272A',

  danger: '#EF4444',
  dangerLight: '#FEE2E2',

  white: '#FFFFFF',
  black: '#000000',

  overlay: 'rgba(0,0,0,0.4)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
} as const;

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 16,
  },
  button: {
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
} as const;
