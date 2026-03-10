// FI9_NAYEK: Utilise le client API FI9
import { API } from '../api/client';

export async function pingAPI() {
  try {
    // openapi.json ne nécessite pas Auth, mais l'interceptor ajoutera le token si disponible
    const r = await API.get('/openapi.json', { timeout: 8000 });
    return r.status === 200;
  } catch (error) {
    console.warn('[FI9] pingAPI failed:', error);
    return false;
  }
}
