import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { GoogleMap } from '../../src/components/GoogleMap';
import { Button } from '../../src/components/Button';
import { Stepper } from '../../src/components/Stepper';
import { TextInput } from '../../src/components/TextInput';

export default function BookingStep2() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        serviceType?: string;
        terminal?: string;
        pickupLocation?: string;
        dropLocation?: string;
        date?: string;
    }>();
    const serviceType = params.serviceType || 'drop';
    const [name, setName] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [email, setEmail] = useState('');

    return (
        <View style={styles.container}>
            {/* Background */}
            <View style={styles.background}>
                <GoogleMap
                    latitude={13.1986}
                    longitude={77.7066}
                    zoom={14}
                />

                {/* Airport Pin */}
                <View style={styles.pinContainer}>
                    <View style={styles.pinLabel}>
                        <Text style={styles.pinLabelText}>Kempegowda Airport</Text>
                    </View>
                    <MaterialIcons name="location-on" size={48} color={Colors.primary} />
                </View>
            </View>

            {/* Bottom Sheet */}
            <View style={styles.bottomSheet}>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.sheetContent}
                >
                    <Stepper currentStep={2} />

                    <View style={styles.titleSection}>
                        <Text style={styles.title}>Contact Details</Text>
                        <Text style={styles.subtitle}>We'll send booking updates here</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <TextInput
                            label="YOUR NAME"
                            placeholder="Enter your full name"
                            value={name}
                            onChangeText={setName}
                            leadingIcon={
                                <MaterialIcons name="person-outline" size={22} color={Colors.textSubLight} />
                            }
                        />

                        <TextInput
                            label="WHATSAPP NUMBER"
                            placeholder="9876543210"
                            value={whatsapp}
                            onChangeText={setWhatsapp}
                            keyboardType="phone-pad"
                            leadingIcon={
                                <MaterialIcons name="phone-iphone" size={22} color={Colors.textSubLight} />
                            }
                            helperText="Ride details will be sent to this number."
                            helperVariant="success"
                            helperIcon={
                                <MaterialIcons name="chat" size={14} color={Colors.primaryDark} />
                            }
                        />

                        <TextInput
                            label="EMAIL (OPTIONAL)"
                            placeholder="name@example.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leadingIcon={
                                <MaterialIcons name="mail-outline" size={22} color={Colors.textSubLight} />
                            }
                        />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <Button
                            title="Back"
                            onPress={() => router.back()}
                            variant="outline"
                            icon={<MaterialIcons name="arrow-back" size={18} color={Colors.textMainLight} />}
                            iconPosition="left"
                            fullWidth={false}
                            style={styles.backBtn}
                        />
                        <Button
                            title="Next Step"
                            onPress={() => {
                                const fwd = new URLSearchParams({
                                    serviceType,
                                    terminal: params.terminal || '',
                                    pickupLocation: params.pickupLocation || '',
                                    dropLocation: params.dropLocation || '',
                                    date: params.date || '',
                                    name,
                                    whatsapp,
                                    email,
                                });
                                router.push(`/booking/step3?${fwd.toString()}`);
                            }}
                            icon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
                            fullWidth={false}
                            style={styles.nextBtn}
                        />
                    </View>

                    {/* Footer Links */}
                    <View style={styles.footerLinks}>
                        <Text style={styles.footerLink}>Privacy</Text>
                        <Text style={styles.footerDot}>•</Text>
                        <Text style={styles.footerLink}>Terms</Text>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    // Background
    background: {
        flex: 0.35,
        position: 'relative',
    },


    pinContainer: {
        position: 'absolute',
        top: '40%',
        left: '50%',
        marginLeft: -60,
        alignItems: 'center',
    },
    pinLabel: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: BorderRadius.sm,
        marginBottom: 4,
    },
    pinLabelText: {
        color: Colors.white,
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_700Bold',
    },
    // Bottom Sheet
    bottomSheet: {
        flex: 0.65,
        backgroundColor: 'rgba(255,255,255,0.88)',
        borderTopLeftRadius: BorderRadius.xxl,
        borderTopRightRadius: BorderRadius.xxl,
        ...Shadows.bottomSheet,
        marginTop: -20,
    },

    sheetContent: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.xxl,
    },
    titleSection: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    title: {
        fontSize: FontSizes.lg,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    subtitle: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
        marginTop: 4,
    },
    form: {
        gap: Spacing.base,
        marginBottom: Spacing.xl,
    },
    // Buttons
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: Spacing.xl,
    },
    backBtn: {
        flex: 1,
    },
    nextBtn: {
        flex: 2,
    },
    // Footer
    footerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.base,
        paddingBottom: Spacing.lg,
    },
    footerLink: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
    },
    footerDot: {
        fontSize: FontSizes.sm,
        color: '#D1D5DB',
    },
});
