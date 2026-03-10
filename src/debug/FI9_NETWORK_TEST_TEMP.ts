/**
 * FI9_NAYEK: Test temporaire de connexion API
 * À SUPPRIMER après validation
 */
import { getAPIBaseURL } from './getAPIBaseURL';
import { API } from '../api/client';

export async function testAPIConnection(): Promise<{
  success: boolean;
  message: string;
  code?: number;
}> {
  const baseURL = getAPIBaseURL();
  console.log('[FI9_TEST] Base URL:', baseURL);

  // Test 1: GET /docs (endpoint public)
  try {
    console.log('[FI9_TEST] Test 1: GET /docs');
    const response1 = await fetch(`${baseURL}/docs`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (response1.ok) {
      console.log('[FI9_TEST] ✅ /docs → OK (200)');
      return { success: true, message: 'API CONNECTÉE - /docs accessible', code: 200 };
    } else {
      console.log(`[FI9_TEST] ❌ /docs → FAIL (${response1.status})`);
      return { success: false, message: `API erreur: ${response1.status}`, code: response1.status };
    }
  } catch (error: any) {
    console.error('[FI9_TEST] ❌ /docs → Network Error:', error.message);
    
    // Test 2: GET /api/health (si /docs échoue)
    try {
      console.log('[FI9_TEST] Test 2: GET /api/health');
      const response2 = await fetch(`${baseURL}/api/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response2.ok) {
        console.log('[FI9_TEST] ✅ /api/health → OK (200)');
        return { success: true, message: 'API CONNECTÉE - /api/health accessible', code: 200 };
      } else {
        console.log(`[FI9_TEST] ❌ /api/health → FAIL (${response2.status})`);
        return { success: false, message: `API erreur: ${response2.status}`, code: response2.status };
      }
    } catch (error2: any) {
      console.error('[FI9_TEST] ❌ /api/health → Network Error:', error2.message);
      return { success: false, message: `Network Error: ${error2.message || 'Impossible de contacter le serveur'}` };
    }
  }
}

export async function testLoginConnection(): Promise<{
  success: boolean;
  message: string;
  code?: number;
}> {
  const baseURL = getAPIBaseURL();
  console.log('[FI9_TEST] Test Login: Base URL:', baseURL);

  try {
    // Test avec credentials de test
    const testEmail = 'test@konan.ai';
    const testPassword = 'KING';
    
    console.log('[FI9_TEST] Test Login: POST /api/auth/login');
    const response = await API.post('/api/auth/login', {
      email: testEmail,
      password: testPassword,
    });

    if (response.status === 200 && response.data?.access_token) {
      console.log('[FI9_TEST] ✅ Login → OK (200) - Token reçu');
      return { success: true, message: 'Login OK - Token reçu', code: 200 };
    } else {
      console.log(`[FI9_TEST] ❌ Login → FAIL (${response.status})`);
      return { success: false, message: `Login erreur: ${response.status}`, code: response.status };
    }
  } catch (error: any) {
    const status = error?.response?.status;
    const message = error?.response?.data?.detail || error?.message || 'Erreur inconnue';
    
    if (status === 401) {
      console.log('[FI9_TEST] ❌ Login → FAIL (401) - Credentials invalides');
      return { success: false, message: 'Login erreur: Credentials invalides (401)', code: 401 };
    } else if (status) {
      console.log(`[FI9_TEST] ❌ Login → FAIL (${status})`);
      return { success: false, message: `Login erreur: ${status} - ${message}`, code: status };
    } else {
      console.error('[FI9_TEST] ❌ Login → Network Error:', message);
      return { success: false, message: `Network Error: ${message}` };
    }
  }
}

// Auto-test au chargement (uniquement en dev)
if (__DEV__) {
  console.log('[FI9_TEST] ⚠️ Test temporaire activé - À SUPPRIMER après validation');
  setTimeout(async () => {
    console.log('[FI9_TEST] ========================================');
    console.log('[FI9_TEST] DÉBUT TEST CONNEXION API');
    console.log('[FI9_TEST] ========================================');
    
    const apiTest = await testAPIConnection();
    console.log('[FI9_TEST] Résultat API:', apiTest);
    
    console.log('[FI9_TEST] ========================================');
    console.log('[FI9_TEST] DÉBUT TEST LOGIN');
    console.log('[FI9_TEST] ========================================');
    
    const loginTest = await testLoginConnection();
    console.log('[FI9_TEST] Résultat Login:', loginTest);
    
    console.log('[FI9_TEST] ========================================');
    console.log('[FI9_TEST] FIN DES TESTS');
    console.log('[FI9_TEST] ========================================');
  }, 2000);
}

