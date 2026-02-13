import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { SettingsRow } from '../../src/components/SettingsRow';
import { ToggleSwitch } from '../../src/components/ToggleSwitch';

export default function ProfileScreen() {
    const router = useRouter();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', style: 'destructive', onPress: () => router.replace('/(auth)/login') },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.headerBtn} onPress={() => router.back()}>
                        <MaterialIcons name="arrow-back-ios" size={20} color={Colors.textSubLight} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings</Text>
                    <TouchableOpacity style={styles.saveBtn}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>

                {/* Profile */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarRing}>
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <MaterialIcons name="person" size={40} color={Colors.textSubLight} />
                            </View>
                        </View>
                        <View style={styles.editBadge}>
                            <MaterialIcons name="edit" size={12} color={Colors.white} />
                        </View>
                    </View>
                    <View style={styles.nameRow}>
                        <Text style={styles.profileName}>Arjun Mehta</Text>
                    </View>
                    <View style={styles.co2Badge}>
                        <MaterialIcons name="eco" size={14} color={Colors.accent} />
                        <Text style={styles.co2Text}>12.6kg CO2 Saved</Text>
                    </View>
                </View>
            </View>

            {/* Settings Content */}
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Personal Information */}
                <Text style={styles.sectionLabel}>PERSONAL INFORMATION</Text>
                <View style={styles.settingsCard}>
                    <SettingsRow
                        icon="person"
                        label="Full Name"
                        value="Arjun Mehta"
                        trailing="edit"
                        onPress={() => { }}
                    />
                    <SettingsRow
                        icon="email"
                        label="Email"
                        value="arjun.mehta@gmail.com"
                        trailing="lock"
                        iconBgColor="#F3F4F6"
                        iconColor={Colors.textSubLight}
                    />
                    <SettingsRow
                        icon="phone"
                        label="Phone"
                        value="+91 98451 23456"
                        trailing="edit"
                        onPress={() => { }}
                        style={{ borderBottomWidth: 0 }}
                    />
                </View>

                {/* Account Settings */}
                <Text style={styles.sectionLabel}>ACCOUNT SETTINGS</Text>
                <View style={styles.settingsCard}>
                    <SettingsRow
                        icon="lock-reset"
                        label="Change Password"
                        trailing="chevron"
                        onPress={() => { }}
                    />
                    <SettingsRow
                        icon="notifications"
                        label="Push Notifications"
                        trailing={
                            <ToggleSwitch
                                value={notifications}
                                onValueChange={setNotifications}
                            />
                        }
                        style={{ borderBottomWidth: 0 }}
                    />
                </View>

                {/* App Settings */}
                <Text style={styles.sectionLabel}>APP SETTINGS</Text>
                <View style={styles.settingsCard}>
                    <SettingsRow
                        icon="language"
                        label="Language"
                        trailing={
                            <View style={styles.languageTrail}>
                                <Text style={styles.languageValue}>English</Text>
                                <MaterialIcons name="chevron-right" size={20} color={Colors.textSubLight} />
                            </View>
                        }
                        onPress={() => { }}
                    />
                    <SettingsRow
                        icon="dark-mode"
                        label="Dark Mode"
                        trailing={
                            <ToggleSwitch
                                value={darkMode}
                                onValueChange={setDarkMode}
                            />
                        }
                        style={{ borderBottomWidth: 0 }}
                    />
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialIcons name="logout" size={20} color={Colors.danger} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Malama Cabs v1.0.2</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    // Header
    header: {
        backgroundColor: Colors.white,
        paddingBottom: Spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    headerBtn: {
        padding: 8,
        borderRadius: BorderRadius.full,
    },
    headerTitle: {
        fontSize: FontSizes.lg,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    saveBtn: {
        padding: 8,
    },
    saveText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.accent,
    },
    // Profile
    profileSection: {
        alignItems: 'center',
        paddingTop: Spacing.sm,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    avatarRing: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: `${Colors.accent}33`,
        padding: 4,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 44,
    },
    avatarPlaceholder: {
        backgroundColor: '#F3F4F6',
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
    },
    editBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: Colors.accent,
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.white,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    profileName: {
        fontSize: FontSizes.xl,
        fontFamily: 'Inter_700Bold',
        color: Colors.textMainLight,
    },
    co2Badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: `${Colors.accent}1A`,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
        marginTop: 8,
    },
    co2Text: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.accent,
    },
    // Content
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: 100,
    },
    sectionLabel: {
        fontSize: FontSizes.sm,
        fontFamily: 'Inter_700Bold',
        color: Colors.textSubLight,
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    settingsCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        ...Shadows.card,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        overflow: 'hidden',
        marginBottom: Spacing.xl,
    },
    languageTrail: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    languageValue: {
        fontSize: FontSizes.md,
        color: Colors.textSubLight,
    },
    // Logout
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.dangerLight,
        borderRadius: BorderRadius.md,
        paddingVertical: 14,
        marginTop: Spacing.lg,
    },
    logoutText: {
        fontSize: FontSizes.md,
        fontFamily: 'Inter_600SemiBold',
        color: Colors.danger,
    },
    versionText: {
        fontSize: FontSizes.sm,
        color: Colors.textSubLight,
        textAlign: 'center',
        marginTop: Spacing.base,
        marginBottom: Spacing.xxl,
    },
});
