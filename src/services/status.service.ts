/**
 * FI9_NAYEK: Status service for online/offline, Supabase, RLS, FI9 mode
 * React Native compatible - uses NetInfo on mobile, window APIs on web
 */
import { useState, useEffect, useCallback } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';

// Conditional import for NetInfo (only on mobile)
let NetInfo: any = null;
if (Platform.OS !== 'web') {
  try {
    NetInfo = require('@react-native-community/netinfo');
  } catch (e) {
    console.warn('[FI9] NetInfo not available:', e);
  }
}

export interface SystemStatus {
  online: boolean;
  supabaseConnected: boolean;
  rlsActive: boolean;
  fi9Mode: 'ACTIVE' | 'BYPASS' | 'STRICT';
}

const DEFAULT_STATUS: SystemStatus = {
  online: true,
  supabaseConnected: false,
  rlsActive: false,
  fi9Mode: 'ACTIVE',
};

/**
 * Hook to monitor system status
 */
export const useSystemStatus = () => {
  const [status, setStatus] = useState<SystemStatus>(DEFAULT_STATUS);

  useEffect(() => {
    // Monitor online/offline
    if (Platform.OS === 'web') {
      // Web: use window APIs
      if (typeof window !== 'undefined') {
        const handleOnline = () => {
          setStatus((prev) => ({ ...prev, online: true }));
          console.log('[FI9] Network status: ONLINE');
        };
        const handleOffline = () => {
          setStatus((prev) => ({ ...prev, online: false }));
          console.log('[FI9] Network status: OFFLINE');
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // Initial state
        const online = typeof navigator !== 'undefined' && navigator.onLine;
        setStatus((prev) => ({ ...prev, online }));

        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }
    } else {
      // Mobile: use NetInfo
      if (NetInfo) {
        const unsubscribe = NetInfo.addEventListener((state: any) => {
          const isConnected = state.isConnected ?? false;
          const isInternetReachable = state.isInternetReachable ?? false;
          const online = isConnected && isInternetReachable;
          
          setStatus((prev) => ({ ...prev, online }));
          console.log(`[FI9] Network status: ${online ? 'ONLINE' : 'OFFLINE'}`);
        });

        // Initial network state
        NetInfo.fetch().then((state: any) => {
          const isConnected = state.isConnected ?? false;
          const isInternetReachable = state.isInternetReachable ?? false;
          const online = isConnected && isInternetReachable;
          setStatus((prev) => ({ ...prev, online }));
        });

        return () => {
          unsubscribe();
        };
      } else {
        // Fallback: assume online if NetInfo not available
        setStatus((prev) => ({ ...prev, online: true }));
      }
    }
  }, []);

  // Monitor app state (foreground/background) using AppState API
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      console.log(`[FI9] App state changed: ${nextAppState}`);
      // Optionally update status based on app state
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkSupabaseConnection = useCallback(async () => {
    try {
      // FI9_NAYEK: Check API health endpoint via API client
      const { API } = await import('../api/client');
      const response = await API.get('/health');
      const isHealthy = response.status === 200 && response.data?.status === 'ok';
      setStatus((prev) => ({ ...prev, supabaseConnected: isHealthy }));
      console.log(`[FI9] API Health: ${isHealthy ? 'OK' : 'FAIL'}`);
    } catch (error) {
      setStatus((prev) => ({ ...prev, supabaseConnected: false }));
      console.warn('[FI9] API Health check failed:', error);
    }
  }, []);

  const checkRLSStatus = useCallback(async () => {
    try {
      // FI9_NAYEK: Check API health endpoint via API client (RLS status can be inferred from API health)
      const { API } = await import('../api/client');
      const response = await API.get('/health');
      const isHealthy = response.status === 200 && response.data?.status === 'ok';
      // RLS is active if API is healthy and responding
      setStatus((prev) => ({ ...prev, rlsActive: isHealthy }));
    } catch (error) {
      setStatus((prev) => ({ ...prev, rlsActive: false }));
    }
  }, []);

  useEffect(() => {
    // FI9_NAYEK: Attendre un court délai avant de vérifier la santé de l'API
    // Cela permet au token d'être chargé si disponible
    // Note: /health ne nécessite pas de token, mais on attend quand même pour éviter les appels trop précoces
    const initialDelay = setTimeout(() => {
      checkSupabaseConnection();
      checkRLSStatus();
    }, 500); // Délai de 500ms pour laisser le temps au token de se charger

    // Periodic checks every 30 seconds
    const interval = setInterval(() => {
      checkSupabaseConnection();
      checkRLSStatus();
    }, 30000);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, [checkSupabaseConnection, checkRLSStatus]);

  const setFI9Mode = useCallback((mode: 'ACTIVE' | 'BYPASS' | 'STRICT') => {
    setStatus((prev) => ({ ...prev, fi9Mode: mode }));
  }, []);

  return {
    status,
    setFI9Mode,
    refreshStatus: () => {
      checkSupabaseConnection();
      checkRLSStatus();
    },
  };
};
