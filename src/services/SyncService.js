// FI9_NAYEK: Utilisation du client API avec interceptor Bearer automatique
import { API } from '../api/client';
import {
  upsertConversation,
  upsertMessage,
  dirtyMessages,
  markMessageSynced,
} from '../store/dao';

// FI9_NAYEK: Fonctions safeJson et jsonOrThrow supprimées - API client gère automatiquement

function parseTs(value, fallback = Date.now()) {
  const n = typeof value === 'number' ? value : Date.parse(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Pull: récupère conversations du serveur et derniers messages
 * API attendue:
 *  - GET /api/conversations -> soit [{...}], soit {items:[...]}
 *  - GET /api/conversations/{id} -> {messages:[{...}]}
 */
export async function pullServer({ token, takeMessagesPerConv = 200 }) {
  // FI9_NAYEK: Le token est ajouté automatiquement par l'interceptor API
  // Note: token paramètre optionnel pour compatibilité, mais l'interceptor gère automatiquement
  
  try {
    const convResponse = await API.get('/api/conversations');
    const convPayload = convResponse.data;
    const convs = Array.isArray(convPayload)
      ? convPayload
      : Array.isArray(convPayload?.items)
        ? convPayload.items
        : [];

  for (const c of convs) {
    try {
      const localId = c.id;

      await upsertConversation({
        id: localId,
        server_id: c.id ?? null,
        title: c.title ?? null,
        plan_used: c.plan_used ?? null,
        created_at: parseTs(c.created_at),
        updated_at: parseTs(c.last_message_at ?? c.created_at),
        dirty: 0,
      });

      const detailResponse = await API.get(`/api/conversations/${c.id}`);
      const detail = detailResponse.data;
      const msgs = Array.isArray(detail?.messages) ? detail.messages : [];
      const tail = msgs.slice(-takeMessagesPerConv);

      for (const m of tail) {
        await upsertMessage({
          id: m.id,
          server_id: m.id ?? null,
          conv_local_id: localId,
          role: m.role,
          content_md: m.content ?? '',
          created_at: parseTs(m.created_at),
          updated_at: Date.now(),
          dirty: 0,
        });
      }
    } catch (e) {
      // On continue même si une conv échoue
      // Option: logger e.message si besoin
    }
  } catch (error) {
    // Erreur lors de la récupération des conversations
    console.error('[FI9] Erreur pullServer:', error);
    throw error;
  }
}

/**
 * Push: envoie les messages "dirty" (créés offline) vers le serveur.
 * API attendue:
 *  - POST /api/chat {conversation_id, message, stream:false} -> {id}
 */
export async function pushLocal({ token }) {
  // FI9_NAYEK: Le token est ajouté automatiquement par l'interceptor API
  // Note: token paramètre optionnel pour compatibilité, mais l'interceptor gère automatiquement
  const pendings = await dirtyMessages();

  for (const m of pendings) {
    try {
      // FI9_NAYEK: Le token est ajouté automatiquement par l'interceptor API
      const res = await API.post('/api/chat', {
        conversation_id: m.conv_local_id,
        message: m.content_md,
        stream: false,
      });
      const data = res.data;
      const serverId = data?.id ?? data?.session_id ?? null;
      if (serverId) {
        await markMessageSynced(m.id, serverId);
      }
    } catch (error) {
      // réseau ou autre: laisser dirty pour retry
      console.warn('[FI9] Erreur pushLocal pour message:', m.id, error);
    }
  }
}

/** Sync bidirectionnelle simple */
export async function syncAll({ token }) {
  await pullServer({ token });
  await pushLocal({ token });
}

export default { pullServer, pushLocal, syncAll };
