import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Theme';

interface StepInfo {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
}

const STEPS: StepInfo[] = [
    { label: 'Trip', icon: 'flight' },
    { label: 'Details', icon: 'person' },
    { label: 'Confirm', icon: 'check-circle' },
];

interface StepperProps {
    currentStep: number;
    totalSteps?: number;
}

export function Stepper({ currentStep }: StepperProps) {
    return (
        <View style={styles.container}>
            {STEPS.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;

                return (
                    <React.Fragment key={stepNum}>
                        <View style={styles.stepItem}>
                            <View
                                style={[
                                    styles.iconCircle,
                                    isCompleted && styles.iconCircleCompleted,
                                    isActive && styles.iconCircleActive,
                                    !isCompleted && !isActive && styles.iconCircleInactive,
                                ]}
                            >
                                {isCompleted ? (
                                    <MaterialIcons name="check" size={16} color={Colors.white} />
                                ) : (
                                    <MaterialIcons
                                        name={step.icon}
                                        size={16}
                                        color={isActive ? Colors.white : '#9CA3AF'}
                                    />
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.label,
                                    isActive && styles.labelActive,
                                    isCompleted && styles.labelCompleted,
                                ]}
                            >
                                {step.label}
                            </Text>
                        </View>

                        {/* Connector Line */}
                        {index < STEPS.length - 1 && (
                            <View
                                style={[
                                    styles.connector,
                                    stepNum < currentStep && styles.connectorActive,
                                ]}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    stepItem: {
        alignItems: 'center',
        gap: 4,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconCircleCompleted: {
        backgroundColor: Colors.primary,
    },
    iconCircleActive: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    iconCircleInactive: {
        backgroundColor: '#E5E7EB',
    },
    label: {
        fontSize: 11,
        fontFamily: 'Inter_500Medium',
        color: '#9CA3AF',
    },
    labelActive: {
        color: Colors.primary,
        fontFamily: 'Inter_700Bold',
    },
    labelCompleted: {
        color: Colors.primary,
        fontFamily: 'Inter_600SemiBold',
    },
    connector: {
        flex: 1,
        height: 2,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 6,
        marginBottom: 16, // offset to align with circles, not labels
    },
    connectorActive: {
        backgroundColor: Colors.primary,
    },
});
