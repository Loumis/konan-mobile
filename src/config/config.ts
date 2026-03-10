// FI9_NAYEK: Configuration API unifiée pour Expo (mobile + web)
import Constants from 'expo-constants';
import { getHostname } from '../utils/host';

type Extra = { API_URL?: string; API_BASE_URL?: string };
const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function resolveFromExpo(): string | undefined {
  // Priorité: API_URL > API_BASE_URL (pour compatibilité)
  const value = (extra.API_URL || extra.API_BASE_URL)?.trim();
  return value ? value.replace(/\/+$/, '') : undefined;
}

function resolveFromRuntime(): string | undefined {
  // FI9_NAYEK: Priorité EXPO_PUBLIC_API_URL > VITE_API_BASE_URL > API_BASE_URL
  const raw =
    process.env?.EXPO_PUBLIC_API_URL ||
    process.env?.VITE_API_BASE_URL ||
    process.env?.API_BASE_URL;

  return raw && raw.trim().length > 0 ? raw.trim().replace(/\/+$/, '') : undefined;
}

function resolveFromLan(): string | undefined {
  const host = getHostname();
  return host ? `http://${host}:8000` : undefined;
}

export function resolveApiBaseUrl(): string {
  const fallback =
    typeof __DEV__ !== 'undefined' && __DEV__
      ? 'http://192.168.0.184:8000'
      : 'https://api.konan.tld';

  return (
    resolveFromExpo() ??
    resolveFromRuntime() ??
    resolveFromLan() ??
    fallback
  );
}

export const API_BASE_URL = resolveApiBaseUrl();

export const apiConfig = {
  baseUrl: API_BASE_URL,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
} as const;

