/**
 * RazorpayCheckout — Platform-aware Razorpay payment wrapper
 *
 * Web: Dynamically loads Razorpay checkout.js and opens the payment modal.
 * Native: Uses react-native-razorpay SDK (requires expo prebuild).
 */

import { Platform } from 'react-native';

// Razorpay test key — replace with your live key for production
const RAZORPAY_KEY = 'rzp_test_1DP5mmOlF5G5ag';

export interface PaymentOptions {
    amount: number; // in INR (will be converted to paise)
    name: string;
    description: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
}

export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    error?: string;
}

/**
 * Opens Razorpay checkout and returns a promise that resolves with payment result.
 */
export async function openPayment(options: PaymentOptions): Promise<PaymentResult> {
    if (Platform.OS === 'web') {
        return openWebPayment(options);
    }
    return openNativePayment(options);
}

// ─── Web Implementation ─────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).Razorpay) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
        document.head.appendChild(script);
    });
}

async function openWebPayment(options: PaymentOptions): Promise<PaymentResult> {
    try {
        await loadRazorpayScript();

        return new Promise((resolve) => {
            const rzpOptions = {
                key: RAZORPAY_KEY,
                amount: options.amount * 100, // Convert to paise
                currency: 'INR',
                name: options.name,
                description: options.description,
                prefill: options.prefill || {},
                theme: {
                    color: '#2E7D32',
                },
                handler: (response: any) => {
                    resolve({
                        success: true,
                        paymentId: response.razorpay_payment_id,
                    });
                },
                modal: {
                    ondismiss: () => {
                        resolve({
                            success: false,
                            error: 'Payment cancelled by user',
                        });
                    },
                },
            };

            const rzp = new (window as any).Razorpay(rzpOptions);
            rzp.open();
        });
    } catch (err: any) {
        return {
            success: false,
            error: err.message || 'Failed to initialize payment',
        };
    }
}

// ─── Native Implementation ──────────────────────────────────────────────────

async function openNativePayment(options: PaymentOptions): Promise<PaymentResult> {
    try {
        // Dynamic import to avoid crash on web
        const RazorpayCheckout = require('react-native-razorpay').default;

        const rzpOptions = {
            key: RAZORPAY_KEY,
            amount: (options.amount * 100).toString(),
            currency: 'INR',
            name: options.name,
            description: options.description,
            prefill: options.prefill || {},
            theme: {
                color: '#2E7D32',
            },
        };

        const data = await RazorpayCheckout.open(rzpOptions);
        return {
            success: true,
            paymentId: data.razorpay_payment_id,
        };
    } catch (err: any) {
        return {
            success: false,
            error: err?.description || err?.message || 'Payment failed',
        };
    }
}
