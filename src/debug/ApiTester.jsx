// FI9_NAYEK: LEGACY UI COMPONENT - not used in current mobile flow (DEBUG ONLY)
// FI9_NAYEK: Utilisation du client API FI9
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { API } from '../api/client';
import { getAPIBaseURL } from '../utils/getAPIBaseURL';
import { colors } from '../theme/colors';

export default function ApiTester() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'checking' | 'ok' | 'error'
  const [message, setMessage] = useState('');

  async function checkApi() {
    setStatus('checking');
    setMessage('');
    try {
      // FI9_NAYEK: Utilise le client API avec interceptor Bearer automatique
      const res = await API.get('/health');
      if (res.status === 200) {
        setStatus('ok');
        setMessage('Connexion API réussie ✅');
      } else {
        setStatus('error');
        setMessage(`Réponse inattendue : ${res.status}`);
      }
    } catch (err) {
      setStatus('error');
      const errorMessage = err?.response?.data?.detail || err?.message || 'Erreur de connexion';
      setMessage(errorMessage);
    }
  }

  useEffect(() => {
    // FI9_NAYEK: Attendre un court délai avant de vérifier l'API
    // Cela permet au token d'être chargé si disponible
    // Note: /health ne nécessite pas de token, mais on attend quand même pour éviter les appels trop précoces
    const delay = setTimeout(() => {
      checkApi();
    }, 500); // Délai de 500ms pour laisser le temps au token de se charger

    return () => clearTimeout(delay);
  }, []);

  return (
    <View
      style={{
        margin: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: colors.surface || '#1E293B',
        borderWidth: 1,
        borderColor: '#334155',
      }}
    >
      <Text style={{ color: '#93C5FD', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>
        Diagnostic connexion API
      </Text>

      {status === 'checking' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ActivityIndicator color="#3B82F6" />
          <Text style={{ color: '#CBD5E1' }}>Vérification en cours...</Text>
        </View>
      )}

      {status === 'ok' && (
        <Text style={{ color: '#22C55E', fontWeight: '600' }}>{message}</Text>
      )}

      {status === 'error' && (
        <Text style={{ color: '#EF4444', fontWeight: '600' }}>❌ {message}</Text>
      )}

      <TouchableOpacity
        onPress={checkApi}
        style={{
          marginTop: 16,
          paddingVertical: 10,
          borderRadius: 8,
          backgroundColor: '#3B82F6',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Re-tester</Text>
      </TouchableOpacity>

      <Text
        style={{
          marginTop: 12,
          color: '#94A3B8',
          fontSize: 13,
          textAlign: 'center',
        }}
      >
        API_BASE_URL : {getAPIBaseURL()}
      </Text>
    </View>
  );
}
