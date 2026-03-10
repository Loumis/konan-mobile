/**
 * FI9_NAYEK: Gradient utilities for React Native
 */
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { FI9Gradients } from './DesignSystem';

// Use expo-linear-gradient if available, otherwise fallback to View
let LinearGradient: any;
try {
  // Try expo-linear-gradient first (Expo)
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch {
  try {
    // Try react-native-linear-gradient (bare React Native)
    LinearGradient = require('react-native-linear-gradient').default;
  } catch {
    // Fallback: create a simple View wrapper with first color
    const { View } = require('react-native');
    LinearGradient = ({ children, style, colors, start, end }: any) => {
      const [firstColor] = colors || ['#3b82f6'];
      return React.createElement(View, { style: [{ backgroundColor: firstColor }, style] }, children);
    };
  }
}

export interface GradientProps {
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: React.ReactNode;
}

/**
 * Gradient wrapper component
 */
export const Gradient: React.FC<GradientProps> = ({
  colors = FI9Gradients.primary,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
  style,
  children,
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

/**
 * Primary gradient (blue → violet)
 */
export const PrimaryGradient: React.FC<Omit<GradientProps, 'colors'>> = (props) => (
  <Gradient colors={FI9Gradients.primary} {...props} />
);

/**
 * Vertical gradient (top to bottom)
 */
export const VerticalGradient: React.FC<Omit<GradientProps, 'colors' | 'start' | 'end'>> = ({
  colors = FI9Gradients.primaryVertical,
  ...props
}) => (
  <Gradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} {...props} />
);

/**
 * Horizontal gradient (left to right)
 */
export const HorizontalGradient: React.FC<Omit<GradientProps, 'colors' | 'start' | 'end'>> = ({
  colors = FI9Gradients.primaryHorizontal,
  ...props
}) => (
  <Gradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} {...props} />
);

