import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, FontSizes, Spacing, Shadows } from '../../constants/Theme';
import { Button } from '../../src/components/Button';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <MaterialIcons name="eco" size={24} color={Colors.primary} />
          <Text style={styles.headerTitle}>MALAMA CABS</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color={Colors.textMainLight} />
        </TouchableOpacity>
      </View>

      {/* Welcome Card */}
      <View style={styles.content}>
        <LinearGradient
          colors={['#F0FDF4', '#DCFCE7']}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeIcon}>
            <MaterialIcons name="electric-car" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.welcomeTitle}>Welcome to Malama</Text>
          <Text style={styles.welcomeSubtitle}>
            Your eco-friendly airport transfer service
          </Text>
          <View style={styles.welcomeStats}>
            <View style={styles.statItem}>
              <MaterialIcons name="eco" size={20} color={Colors.primary} />

              <Text style={styles.statValue}>12.6kg</Text>
              <Text style={styles.statLabel}>CO₂ Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialIcons name="electric-car" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>EV Rides</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialIcons name="star" size={20} color="#FACC15" />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/booking/step1')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
              <MaterialIcons name="flight" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionTitle}>Airport Drop</Text>
            <Text style={styles.actionSub}>Book a ride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/booking/step1')}
            activeOpacity={0.8}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
              <MaterialIcons name="flight-land" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionTitle}>Airport Pickup</Text>
            <Text style={styles.actionSub}>Schedule now</Text>
          </TouchableOpacity>
        </View>

        {/* Book CTA */}
        <View style={styles.ctaSection}>
          <Button
            title="Book Airport Transfer"
            onPress={() => router.push('/booking/step1')}
            icon={<MaterialIcons name="arrow-forward" size={18} color={Colors.white} />}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: FontSizes.base,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
    letterSpacing: 1,
  },
  menuButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  // Welcome Card
  welcomeCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  welcomeIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  welcomeTitle: {
    fontSize: FontSizes.xl,
    fontFamily: 'Inter_700Bold',
    color: Colors.textMainLight,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSubLight,
    marginBottom: Spacing.lg,
  },
  welcomeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.base,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontFamily: 'Inter_700Bold',
    color: Colors.textMainLight,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textSubLight,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#D1D5DB',
    opacity: 0.5,
  },
  // Quick Actions
  sectionTitle: {
    fontSize: FontSizes.base,
    fontFamily: 'Inter_700Bold',
    color: Colors.textMainLight,
    marginBottom: Spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.base,
    ...Shadows.card,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionTitle: {
    fontSize: FontSizes.md,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.textMainLight,
  },
  actionSub: {
    fontSize: FontSizes.sm,
    color: Colors.textSubLight,
    marginTop: 2,
  },
  ctaSection: {
    marginTop: 'auto',
    paddingBottom: Spacing.lg,
  },
});
