import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Modal, Platform } from 'react-native';

interface DropdownContextType {
    showDropdown: (content: ReactNode, layout: { x: number; y: number; width: number; height: number }, onClose: () => void) => void;
    hideDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

export const useDropdown = () => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error('useDropdown must be used within a DropdownProvider');
    }
    return context;
};

interface DropdownProviderProps {
    children: ReactNode;
}

export const DropdownProvider: React.FC<DropdownProviderProps> = ({ children }) => {
    const [dropdownContent, setDropdownContent] = useState<ReactNode | null>(null);
    const [layout, setLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
    const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(null);

    const showDropdown = useCallback((content: ReactNode, layout: { x: number; y: number; width: number; height: number }, onClose: () => void) => {
        setDropdownContent(content);
        setLayout(layout);
        setOnCloseCallback(() => onClose);
    }, []);

    const hideDropdown = useCallback(() => {
        setDropdownContent(null);
        setLayout(null);
        if (onCloseCallback) {
            onCloseCallback();
            setOnCloseCallback(null);
        }
    }, [onCloseCallback]);

    return (
        <DropdownContext.Provider value={{ showDropdown, hideDropdown }}>
            <View style={{ flex: 1 }}>
                {children}
                {dropdownContent && layout && (
                    <View style={StyleSheet.absoluteFill} pointerEvents="box-none" zIndex={9999}>
                        <TouchableWithoutFeedback onPress={hideDropdown}>
                            <View style={StyleSheet.absoluteFill} />
                        </TouchableWithoutFeedback>
                        <View
                            style={[
                                styles.dropdownContainer,
                                {
                                    top: layout.y + layout.height,
                                    left: layout.x,
                                    width: layout.width,
                                },
                            ]}
                        >
                            {dropdownContent}
                        </View>
                    </View>
                )}
            </View>
        </DropdownContext.Provider>
    );
};

const styles = StyleSheet.create({
    dropdownContainer: {
        position: 'absolute',
        // maxheight is handled by the content usually, but we can set a max here too if needed
    },
});
