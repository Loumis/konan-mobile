// FI9_NAYEK: DEPRECATED - Ce fichier est obsolète
// Utiliser src/context/AuthContext.js à la place
// Ce fichier est conservé pour compatibilité mais redirige vers le vrai AuthContext

import { AuthProvider as RealAuthProvider, useAuth as useRealAuth } from '../context/AuthContext';

export function AuthProvider({ children }) {
  console.warn("[FI9] auth/AuthContext.js est deprecated. Utiliser context/AuthContext.js");
  return <RealAuthProvider>{children}</RealAuthProvider>;
}

export const useAuth = () => {
  console.warn("[FI9] auth/AuthContext.js est deprecated. Utiliser context/AuthContext.js");
  return useRealAuth();
};
