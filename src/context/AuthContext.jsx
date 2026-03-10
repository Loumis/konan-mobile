// FI9_NAYEK: AuthContext complet avec gestion token unifiée (Web + Mobile)
// TODO: REMOVE BEFORE PROD - Runtime path verifier
console.log("[FI9_RUNTIME] Loaded:", "src/context/AuthContext.js");
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { login as loginRequest, register as registerRequest } from "../services/AuthService";
import { getToken, saveToken, clearToken, clearOldTokens } from "../utils/token";
import { API } from "../api/client";

if (typeof globalThis.Buffer === "undefined") {
  globalThis.Buffer = require("buffer").Buffer;
}

/**
 * FI9_NAYEK: Décode un token JWT et retourne le payload
 */
function decodeJwt(token) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1] || "";
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded =
      normalized.length % 4 === 0
        ? normalized
        : normalized.padEnd(normalized.length + (4 - (normalized.length % 4)), "=");
    const decoded =
      typeof globalThis.atob === "function"
        ? globalThis.atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    const payloadObj = JSON.parse(decoded);
    
    // FI9_NAYEK: Vérifier que 'sub' existe
    if (!payloadObj.sub) {
      console.warn("[FI9] Token JWT ne contient pas 'sub'");
      return null;
    }
    
    return payloadObj;
  } catch (error) {
    console.warn("[FI9] Impossible de décoder le token JWT", error);
    return null;
  }
}

/**
 * FI9_NAYEK: Applique un token au contexte (sauvegarde + décode + met à jour state)
 */
async function applyToken(accessToken, setters) {
  const { setToken, setUser, setStatus } = setters;
  
  // FI9_NAYEK: Validation du token avant stockage
  if (!accessToken || typeof accessToken !== 'string' || accessToken.trim().length === 0) {
    console.error("[FI9] ERREUR: Token invalide reçu:", accessToken);
    throw new Error("Token invalide");
  }
  
  // FI9_NAYEK: Vérifier que le token est un JWT valide (3 parties séparées par des points)
  const parts = accessToken.split('.');
  if (parts.length !== 3) {
    console.error("[FI9] ERREUR: Token JWT mal formé (pas 3 parties):", parts.length);
    throw new Error("Token JWT mal formé");
  }
  
  // FI9_NAYEK: Sauvegarder le token via l'utilitaire unifié
  await saveToken(accessToken);
  
  // FI9_NAYEK: Décode et valide le payload JWT
  const decoded = decodeJwt(accessToken);
  if (!decoded || !decoded.sub) {
    console.error("[FI9] ERREUR: Token JWT ne contient pas 'sub':", decoded);
    throw new Error("Token JWT invalide: sub manquant");
  }
  
  console.log("[FI9] Token appliqué avec succès - sub:", decoded.sub);
  
  setToken(accessToken);
  setUser(decoded);
  setStatus("authenticated");
}

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // TODO: REMOVE BEFORE PROD - Runtime path verifier
  console.log("[FI9_RUNTIME] Render:", "src/context/AuthContext.js");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const subscription = "free";

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // FI9_NAYEK: Nettoyer les anciens tokens au démarrage
        await clearOldTokens();
        console.log("[FI9] Token reset au démarrage - anciens tokens supprimés");
        
        // FI9_NAYEK: Récupérer le token via l'utilitaire unifié
        const stored = await getToken();
        console.log("[FI9] AuthContext init token:", stored ? `${stored.slice(0, 30)}...` : "NULL");
          
        if (mounted && stored) {
          // FI9_NAYEK: Valider le token avant de l'appliquer
          const decoded = decodeJwt(stored);
          if (!decoded || !decoded.sub) {
            console.warn("[FI9] Token stocké invalide, suppression...");
            await clearToken();
            if (mounted) setStatus("unauthenticated");
            return;
          }
          
          console.log("[FI9] Token chargé depuis storage - sub:", decoded.sub);
          
          // FI9_NAYEK: Mettre à jour le state immédiatement
          setToken(stored);
          setUser(decoded);
          setStatus("authenticated");
          
          // FI9_NAYEK: Valider le token en appelant /api/auth/me et mettre à jour user avec les données complètes
          try {
            console.log("[FI9] Calling /api/auth/me via API client - token injected");
            const validateResponse = await API.get('/api/auth/me');
            const meData = validateResponse.data;
            const sub = meData?.id || meData?.sub || "unknown";
            console.log(`[FI9] /api/auth/me → OK (sub: ${sub})`);
            
            // FI9_NAYEK v13: Mettre à jour user avec les données complètes de /api/auth/me
            // meData contient: id, email, full_name (optionnel), plan
            if (mounted && meData) {
              setUser({
                ...decoded,
                id: meData.id,
                email: meData.email,
                full_name: meData.full_name,
                name: meData.full_name || meData.name,
                username: meData.email?.split("@")[0],
                plan: meData.plan,
              });
            }
          } catch (validateError) {
            const status = validateError?.response?.status || validateError?.status || "unknown";
            console.warn(`[FI9] /api/auth/me → FAIL (${status}), token invalide`);
            await clearToken();
            if (mounted) {
              setToken(null);
              setUser(null);
              setStatus("unauthenticated");
            }
          }
          return;
        }

        if (!mounted) return;

        // FI9_NAYEK: Aucun token trouvé
        setStatus("unauthenticated");
      } catch (error) {
        console.warn("[FI9] Erreur chargement session:", error);
        if (mounted) setStatus("unauthenticated");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const performLogin = async (email, password) => {
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();
    if (!trimmedEmail || !trimmedPassword) {
      throw new Error("Identifiants requis");
    }
    
    // FI9_NAYEK: Nettoyer les anciens tokens avant le nouveau login
    await clearOldTokens();
    
    try {
      const response = await loginRequest(trimmedEmail, trimmedPassword);
      if (!response?.access_token) {
        throw new Error("Token manquant dans la réponse de l'API");
      }
      
      // FI9_NAYEK: Log strict du token reçu
      console.log("[FI9] Token reçu du login:");
      console.log("[FI9] Token reçu (preview):", response.access_token ? `${response.access_token.substring(0, 30)}...` : "NULL");
      console.log("[FI9] Response apply flag:", response.apply);
      
      // FI9_NAYEK: Appliquer le token SEULEMENT si response.apply === true
      // applyToken() sauvegarde le token, décode le payload, et met à jour le state (status = "authenticated")
      if (response.apply === true) {
        console.log("[FI9] apply flag is true - calling applyToken()");
        await applyToken(response.access_token, { setToken, setUser, setStatus });
        
        // FI9_NAYEK: Vérifier que le token est bien stocké et valide
        const stored = await getToken();
        if (stored !== response.access_token) {
          console.error("[FI9] ERREUR: Token stocké ne correspond pas au token reçu!");
          throw new Error("Erreur de synchronisation du token");
        }
        
        console.log("[FI9] Token sauvegardé et contexte mis à jour.");
        
        // FI9_NAYEK: Valider le token en appelant /api/auth/me APRÈS applyToken() est complété
        // Le token est maintenant stocké via saveToken() dans applyToken(), donc l'interceptor le récupérera
        // IMPORTANT: Ne pas appeler /api/auth/me AVANT applyToken() est complété
        try {
          console.log("[FI9] Calling /api/auth/me via API client - token injected (after applyToken)");
          const validateResponse = await API.get('/api/auth/me');
          const meData = validateResponse.data;
          const sub = meData?.id || meData?.sub || "unknown";
          console.log(`[FI9] /api/auth/me → OK (sub: ${sub})`);
          console.log(`[FI9] Auth me: OK - User: ${meData.email || meData.id || sub}`);
          
          // FI9_NAYEK v13: Mettre à jour user avec les données complètes de /api/auth/me
          // meData contient: id, email, full_name (optionnel), plan
          if (meData) {
            setUser({
              ...decodeJwt(response.access_token),
              id: meData.id,
              email: meData.email,
              full_name: meData.full_name,
              name: meData.full_name || meData.name,
              username: meData.email?.split("@")[0],
              plan: meData.plan,
            });
          }
        } catch (validateError) {
          const status = validateError?.response?.status || validateError?.status || "unknown";
          console.warn(`[FI9] /api/auth/me → FAIL (${status})`);
          console.warn("[FI9] Erreur lors de la validation du token:", validateError?.message || validateError);
          // On continue quand même, le token peut être valide mais l'endpoint peut être indisponible
        }
      } else {
        console.warn("[FI9] apply flag is false or missing - token not applied");
        throw new Error("Token non appliqué: flag apply manquant");
      }
      
      console.log("[FI9] Login terminé avec succès - Token stocké et validé");
      return response.access_token;
    } catch (error) {
      setStatus("unauthenticated");
      // FI9_NAYEK: Nettoyer en cas d'erreur
      await clearToken();
      throw error;
    }
  };

  const performRegister = async (email, password) => {
    const trimmedEmail = email?.trim();
    const trimmedPassword = password?.trim();

    if (!trimmedEmail || !trimmedPassword) {
      throw new Error("Email et mot de passe requis");
    }

    // FI9_NAYEK: on nettoie d'abord d'anciens tokens
    await clearOldTokens();

    try {
      // Appel au service AuthService.register (qui retourne { access_token, apply: true })
      const response = await registerRequest(trimmedEmail, trimmedPassword);

      if (response?.access_token) {
        console.log("[FI9] Register response apply flag:", response.apply);
        
        // FI9_NAYEK: Appliquer le token SEULEMENT si response.apply === true
        // applyToken() sauvegarde le token, décode le payload, et met à jour le state (status = "authenticated")
        if (response.apply === true) {
          console.log("[FI9] apply flag is true - calling applyToken()");
          await applyToken(response.access_token, { setToken, setUser, setStatus });

          // Vérification que le token stocké est bien celui reçu
          const stored = await getToken();
          if (stored !== response.access_token) {
            console.error(
              "[FI9] ERREUR: Token stocké ne correspond pas au token reçu après register !"
            );
            throw new Error("Erreur de synchronisation du token après register");
          }

          console.log(
            "[FI9] Token sauvegardé et contexte mis à jour après register."
          );

          // FI9_NAYEK: Validation du token via /api/auth/me APRÈS applyToken() est complété
          // Le token est maintenant stocké via saveToken() dans applyToken(), donc l'interceptor le récupérera
          // IMPORTANT: Ne pas appeler /api/auth/me AVANT applyToken() est complété
          try {
            console.log(
              "[FI9] Calling /api/auth/me via API client - token injected (register, after applyToken)"
            );
            const validateResponse = await API.get("/api/auth/me");
            const meData = validateResponse.data;
            const sub = meData?.id || meData?.sub || "unknown";

            console.log(`[FI9] /api/auth/me → OK après register (sub: ${sub})`);
            console.log(
              `[FI9] Auth me: OK après register - User: ${
                meData.email || meData.id || sub
              }`
            );
            
            // FI9_NAYEK v13: Mettre à jour user avec les données complètes de /api/auth/me
            if (meData) {
              setUser({
                ...decodeJwt(response.access_token),
                id: meData.id,
                email: meData.email,
                full_name: meData.full_name,
                name: meData.full_name || meData.name,
                username: meData.email?.split("@")[0],
                plan: meData.plan,
              });
            }
          } catch (validateError) {
            const status =
              validateError?.response?.status ||
              validateError?.status ||
              "unknown";
            console.warn(`[FI9] /api/auth/me → FAIL après register (${status})`);
            // On laisse quand même l'utilisateur connecté, le backend peut
            // être temporairement indisponible sur /me
          }

          console.log(
            "[FI9] Register terminé avec succès - Token stocké, contexte mis à jour."
          );
        } else {
          console.warn("[FI9] apply flag is false or missing - token not applied");
          throw new Error("Token non appliqué: flag apply manquant");
        }
      } else {
        console.warn(
          "[FI9] Register: aucune access_token dans la réponse, aucun token appliqué."
        );
      }

      return response;
    } catch (error) {
      console.warn("[FI9] performRegister → erreur, reset du contexte.");
      setStatus("unauthenticated");
      await clearToken();
      throw error;
    }
  };

  const performLogout = async () => {
    // FI9_NAYEK: Suppression du token via l'utilitaire unifié
    console.log("[FI9] Logout → token cleared + contexte reset");
    await clearToken();
    setToken(null);
    setUser(null);
    setStatus("unauthenticated");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      status,
      subscription,
      isAuthenticated: status === "authenticated",
      login: performLogin,
      register: performRegister,
      logout: performLogout,
      signIn: ({ email, password }) => performLogin(email, password),
      signUp: ({ email, password }) => performRegister(email, password),
      signOut: performLogout,
    }),
    [token, user, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
