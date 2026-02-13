import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { Button } from '../../src/components/Button';
import { TextInput } from '../../src/components/TextInput';
import { countryCodes } from '../../src/data/constants';

export default function LoginScreen() {
    const router = useRouter();
    const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
    const [contact, setContact] = useState('');
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const handleSignIn = () => {
        if (!contact.trim()) return;
        router.push({ pathname: '/(auth)/otp', params: { contact: `${selectedCountry.value} ${contact}` } });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <Image
                            source={require('../../assets/images/logo1024x1024.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                        <Text style={styles.logoTitle}>MALAMA</Text>
                        <Text style={styles.logoSubtitle}>EV CABS</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Country Selector */}
                        <TouchableOpacity
                            style={styles.countrySelector}
                            onPress={() => setShowCountryPicker(!showCountryPicker)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.countrySelectorLeft}>
                                <MaterialIcons name="flag" size={18} color={Colors.textSubLight} />
                                <Text style={styles.countryText}>{selectedCountry.label}</Text>
                            </View>
                            <MaterialIcons name="expand-more" size={24} color={Colors.textSubLight} />
                        </TouchableOpacity>

                        {/* Country Picker Dropdown */}
                        {showCountryPicker && (
                            <View style={styles.dropdown}>
                                {countryCodes.map((cc) => (
                                    <TouchableOpacity
                                        key={cc.value}
                                        style={[
                                            styles.dropdownItem,
                                            cc.value === selectedCountry.value && styles.dropdownItemActive,
                                        ]}
                                        onPress={() => {
                                            setSelectedCountry(cc);
                                            setShowCountryPicker(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownFlag}>{cc.flag}</Text>
                                        <Text style={styles.dropdownText}>{cc.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        {/* Contact Input */}
                        <TextInput
                            placeholder="Mobile Number Or Email"
                            value={contact}
                            onChangeText={setContact}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Sign In Button */}
                        <View style={{ marginTop: Spacing.xl }}>
                            <Button
                                title="SIGN IN WITH OTP"
                                onPress={handleSignIn}
                            />
                        </View>
                    </View>

                    {/* Bottom Links */}
                    <View style={styles.linksRow}>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Register User?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.linkText}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Gradient Accent */}
            <LinearGradient
                colors={['transparent', Colors.primary, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.bottomGradient}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
    },
    // Logo
    logoSection: {
        alignItems: 'center',
        marginBottom: Spacing.xxxl,
    },
    logoImage: {
        width: 120,
        height: 120,
        marginBottom: Spacing.sm,
    },
    logoTitle: {
        fontSize: FontSizes.display,
        fontFamily: 'Inter_800ExtraBold',
        color: Colors.primary,
        letterSpacing: 2,
    },
    logoSubtitle: {
        fontSize: FontSizes.xxl,
        fontFamily: 'Inter_700Bold',
        color: Colors.primary,
        letterSpacing: 3,
    },
    // Form
    form: {
        gap: Spacing.base,
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.inputBgLight,
        borderRadius: BorderRadius.sm,
        paddingVertical: 14,
        paddingHorizontal: Spacing.base,
    },
    countrySelectorLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    countryText: {
        fontSize: FontSizes.base,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    dropdown: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.sm,
        ...Shadows.card,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        overflow: 'hidden',
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: Spacing.base,
    },
    dropdownItemActive: {
        backgroundColor: '#F0FDF4',
    },
    dropdownFlag: {
        fontSize: 18,
    },
    dropdownText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_500Medium',
        color: Colors.textMainLight,
    },
    // Links
    linksRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.xxl,
        paddingHorizontal: Spacing.sm,
    },
    linkText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.textSubLight,
    },
    // Bottom gradient
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        opacity: 0.2,
    },
});
