/**
 * FI9_NAYEK: Shadow utilities for React Native
 */
import { FI9Shadows } from './DesignSystem';

export const shadows = FI9Shadows;

/**
 * Get shadow style by name
 */
export const getShadow = (size: keyof typeof FI9Shadows = 'md') => {
  return FI9Shadows[size];
};

/**
 * Platform-specific shadow (iOS shadow + Android elevation)
 */
export const platformShadow = (size: keyof typeof FI9Shadows = 'md') => {
  return FI9Shadows[size];
};

