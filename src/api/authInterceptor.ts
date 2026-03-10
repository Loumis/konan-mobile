/**
 * FI9_NAYEK: Auth Interceptor for API calls
 * Handles 401 errors, token refresh, and automatic logout
 * React Native compatible - no window APIs
 */
import { getToken, clearToken } from '../utils/token';

let refreshTokenPromise: Promise<string | null> | null = null;

/**
 * Refresh token function (to be implemented based on your auth flow)
 */
async function refreshToken(): Promise<string | null> {
  // TODO: Implement token refresh logic
  // For now, return null to trigger logout
  console.log('[FI9] Auth Interceptor: Token refresh not implemented');
  return null;
}

/**
 * Handle 401 error on /api/auth/me
 * Note: Navigation should be handled by the component using this interceptor
 */
export async function handleAuthMe401(): Promise<void> {
  console.log('[FI9] Auth me: FAIL (401) - Attempting token refresh');
  
  // Prevent multiple simultaneous refresh attempts
  if (refreshTokenPromise) {
    await refreshTokenPromise;
    return;
  }
  
  refreshTokenPromise = refreshToken();
  const newToken = await refreshTokenPromise;
  refreshTokenPromise = null;
  
  if (!newToken) {
    console.log('[FI9] Auth me: FAIL - Token refresh failed, logging out');
    // Clear storage
    await clearToken();
    
    // Note: Navigation should be handled by the component
    // For web, components can use window.location.href if needed
    // For RN, components should use navigation.navigate('Login')
    throw new Error('Authentication failed - please login again');
  }
  
  console.log('[FI9] Auth me: Token refreshed successfully');
}

/**
 * Intercept fetch requests and handle auth errors
 * React Native compatible - no window APIs
 */
export async function fetchWithAuthInterceptor(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get token from storage
  const token = await getToken();
  
  // Add Authorization header if token exists
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Make request
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  // Handle 401 on /api/auth/me
  if (response.status === 401 && url.includes('/api/auth/me')) {
    try {
      await handleAuthMe401();
      // Retry request with new token
      const newToken = await getToken();
      if (newToken) {
        headers.set('Authorization', `Bearer ${newToken}`);
        return fetch(url, {
          ...options,
          headers,
        });
      }
    } catch (error) {
      console.error('[FI9] Auth Interceptor: Retry failed', error);
    }
  }
  
  // Log auth status
  if (url.includes('/api/auth/me')) {
    if (response.ok) {
      console.log('[FI9] Auth me: OK');
    } else {
      console.log(`[FI9] Auth me: FAIL (${response.status})`);
    }
  }
  
  return response;
}
