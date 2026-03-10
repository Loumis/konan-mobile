// FI9_NAYEK: Utilisation du client API avec interceptor Bearer automatique
import * as FileSystem from 'expo-file-system';
import { API } from '../api/client';
import { getAPIBaseURL } from '../utils/getAPIBaseURL';

const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo

export async function uploadFileWithProgress({ token, file, onProgress }) {
  // file = { uri, name, mime, size }
  const info = await FileSystem.getInfoAsync(file.uri);
  const size = info?.size ?? file.size ?? 0;
  if (!info.exists) throw new Error('Fichier introuvable');
  if (size > MAX_SIZE) throw new Error('Fichier trop volumineux (>10 Mo)');

  // Expo FileSystem.createUploadTask permet la progression
  // Note: FileSystem.createUploadTask nécessite l'URL complète et les headers manuellement
  // FI9_NAYEK: Récupérer le token depuis le storage unifié si non fourni
  const { getToken } = await import('../utils/token');
  const finalToken = token || await getToken();
  if (!finalToken) {
    throw new Error('Token manquant pour l\'upload');
  }
  
  // FI9_NAYEK: Trace FI9 manuel pour FileSystem.createUploadTask (ne passe pas par l'interceptor axios)
  // Cette exception est justifiée car Expo FileSystem nécessite l'URL complète et les headers manuellement
  const callerStack = new Error().stack?.split('\n').slice(2, 6).map(line => line.trim()).join(' → ') || 'Stack trace unavailable';
  console.log(`[FI9-TRACE] Request triggered from: ${callerStack}`);
  console.log(`[FI9-TRACE] Token at call time: ${finalToken ? `${finalToken.slice(0, 20)}...` : 'NULL'}`);
  console.log(`[FI9-TRACE] Authorization header: ${finalToken ? `Bearer ${finalToken.slice(0, 20)}...` : 'NULL'}`);
  console.log(`[FI9-TRACE] Request: POST /api/upload (FileSystem.createUploadTask)`);
  console.log(`[FI9] Upload file - Token utilisé: ${finalToken ? `${finalToken.slice(0, 20)}...` : 'NULL'}`);
  
  const url = `${getAPIBaseURL()}/api/upload`;
  const headers = { Authorization: `Bearer ${finalToken}` };
  const uploadTask = FileSystem.createUploadTask(url, file.uri, {
    fieldName: 'file',
    httpMethod: 'POST',
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    parameters: { name: file.name || 'document', mime: file.mime || 'application/octet-stream' },
    headers,
  }, (progress) => {
    // progress.totalBytesSent / progress.totalBytesExpectedToSend
    if (progress.totalBytesExpectedToSend > 0) {
      const pct = Math.min(
        100,
        Math.round((progress.totalBytesSent / progress.totalBytesExpectedToSend) * 100)
      );
      onProgress?.(pct);
    }
  });

  const result = await uploadTask.uploadAsync();
  if (result.status !== 200 && result.status !== 201) {
    throw new Error(`HTTP ${result.status} ${result.body}`);
  }
  const parsed = JSON.parse(result.body || '{}');
  return parsed; // { file_id, name, mime, size_bytes, sha256 }
}

export async function extractLawRefs({ token, file_id }) {
  // FI9_NAYEK: Le token est ajouté automatiquement par l'interceptor API
  // Note: token paramètre optionnel pour compatibilité, mais l'interceptor gère automatiquement
  try {
    const response = await API.post('/api/tools/extract_law_refs', { file_id });
    return response.data;
  } catch (error) {
    const detail = error?.response?.data?.detail || error?.message || `HTTP ${error?.response?.status || 'Unknown'}`;
    throw new Error(detail);
  }
}

export function filePublicUrl(file_id) {
  return `${getAPIBaseURL()}/api/files/${file_id}`;
}
