import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/Theme';

interface StepperProps {
    currentStep: number;
    totalSteps?: number;
}

export function Stepper({ currentStep, totalSteps = 3 }: StepperProps) {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isCompleted = step < currentStep;
                const isActive = step === currentStep;

                return (
                    <React.Fragment key={step}>
                        {/* Step Circle */}
                        <View
                            style={[
                                styles.circle,
                                isCompleted && styles.circleCompleted,
                                isActive && styles.circleActive,
                                !isCompleted && !isActive && styles.circleInactive,
                            ]}
                        >
                            {isCompleted ? (
                                <MaterialIcons name="check" size={12} color={Colors.white} />
                            ) : (
                                <Text
                                    style={[
                                        styles.stepText,
                                        (isActive || isCompleted) && styles.stepTextActive,
                                    ]}
                                >
                                    {step}
                                </Text>
                            )}
                        </View>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <View
                                style={[
                                    styles.connector,
                                    step < currentStep && styles.connectorActive,
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
        marginBottom: 20,
    },
    circle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleCompleted: {
        backgroundColor: Colors.primary,
    },
    circleActive: {
        backgroundColor: Colors.primary,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    circleInactive: {
        backgroundColor: '#E5E7EB',
    },
    stepText: {
        fontSize: 12,
        fontFamily: 'Inter_700Bold',
        color: '#9CA3AF',
    },
    stepTextActive: {
        color: Colors.white,
    },
    connector: {
        width: 40,
        height: 2,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 4,
    },
    connectorActive: {
        backgroundColor: Colors.primary,
    },
});
