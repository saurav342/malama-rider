import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { Button } from '../../src/components/Button';
import { Stepper } from '../../src/components/Stepper';
import { TextInput } from '../../src/components/TextInput';
import { defaultBooking } from '../../src/data/mockData';

export default function BookingStep2() {
    const router = useRouter();
    const [name, setName] = useState(defaultBooking.passengerName);
    const [whatsapp, setWhatsapp] = useState(defaultBooking.whatsappNumber);
    const [email, setEmail] = useState('');

    return (
        <View style={styles.container}>
            {/* Background */}
            <View style={styles.background}>
                {/* Gradient placeholder for background image */}
                <View style={styles.bgGradient} />
                {/* Map pin overlay */}
                <SafeAreaView style={styles.headerOverlay}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color={Colors.textMainLight} />
                    </TouchableOpacity>
                    <View style={styles.brandPill}>
                        <View style={styles.brandLogoSmall}>
                            <MaterialIcons name="eco" size={18} color={Colors.white} />
                        </View>
                        <Text style={styles.brandText}>MALAMA</Text>
                    </View>
                </SafeAreaView>
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
                <View style={styles.dragHandle} />
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
                            fullWidth={false}
                            style={styles.backBtn}
                        />
                        <Button
                            title="Next Step"
                            onPress={() => router.push('/booking/step3')}
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
    bgGradient: {
        flex: 1,
        backgroundColor: '#F4DEB3',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.sm,
    },
    backButton: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: BorderRadius.full,
        padding: 8,
    },
    brandPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.base,
        paddingVertical: 8,
    },
    brandLogoSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandText: {
        fontFamily: 'Inter_700Bold',
        fontSize: FontSizes.md,
        color: Colors.primary,
        letterSpacing: 0.5,
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
    dragHandle: {
        width: 48,
        height: 5,
        backgroundColor: '#D1D5DB',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: Spacing.md,
        opacity: 0.5,
    },
    sheetContent: {
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.md,
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
