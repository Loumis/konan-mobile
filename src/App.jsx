// FI9_NAYEK: Utilisation de la configuration API unifiée avec AuthContext
// FI9_PATCH: Imports pour web_ui (version web)
// PHASE A.1: Thème global Jour/Nuit
import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "./web_ui/components/Sidebar";
import ChatArea from "./web_ui/components/ChatArea";
import { useAuth } from "./hooks/useAuth";
import { sendMessage } from "./services/ChatService";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { token, status } = useAuth();
  const { theme, isDark } = useTheme();

  // FI9_NAYEK: Protection - rediriger vers login si pas de token (Web uniquement)
  useEffect(() => {
    if (status === "unauthenticated" || !token) {
      // Pour Expo Web, redirection vers login (Web uniquement)
      if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [token, status]);

  // FI9_NAYEK: Attendre que le token soit chargé avant de rendre le contenu
  // Status "loading" signifie que AuthContext est en train de charger le token depuis le storage
  if (status === "loading") {
    return (
      <div 
        className="min-h-screen w-full text-slate-200 flex items-center justify-center theme-transition"
        style={{ 
          backgroundColor: theme.background,
          color: theme.text,
          transition: 'background-color 80ms ease, color 80ms ease'
        }}
      >
        <div className="text-center">
          <p className="text-lg mb-4">Chargement de la session...</p>
        </div>
      </div>
    );
  }

  // FI9_NAYEK: Bloquer l'accès si pas de token ou non authentifié
  if (!token || status !== "authenticated") {
    return (
      <div 
        className="min-h-screen w-full text-slate-200 flex items-center justify-center theme-transition"
        style={{ 
          backgroundColor: theme.background,
          color: theme.text,
          transition: 'background-color 80ms ease, color 80ms ease'
        }}
      >
        <div className="text-center">
          <p className="text-lg mb-4">Veuillez vous connecter pour accéder au chat</p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
                window.location.href = '/login';
              }
            }}
            className="px-4 py-2 rounded hover:opacity-80 theme-transition"
            style={{
              backgroundColor: theme.primary,
              color: theme.textInverse,
              transition: 'background-color 80ms ease, opacity 80ms ease'
            }}
          >
            Aller à la page de connexion
          </button>
        </div>
      </div>
    );
  }
  const initialChat = useMemo(
    () => ({
      id: crypto.randomUUID(),
      title: "Nouvelle discussion",
      messages: [
        { id: crypto.randomUUID(), role: "assistant", content: "Bienvenue sur KONAN. Comment puis-je aider ?" },
        { id: crypto.randomUUID(), role: "user", content: "Explique la procédure d'appel." },
      ],
    }),
    []
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chats, setChats] = useState([initialChat]);
  const [activeChatId, setActiveChatId] = useState(initialChat.id);

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleNewChat = () => {
    const nc = {
      id: crypto.randomUUID(),
      title: "Nouvelle discussion",
      messages: [
        { id: crypto.randomUUID(), role: "assistant", content: "Nouveau chat démarré. Posez votre question juridique." },
      ],
    };
    setChats((prev) => [nc, ...prev]);
    setActiveChatId(nc.id);
  };

  const handleRenameChat = (title) => {
    setChats((prev) => prev.map((c) => (c.id === activeChatId ? { ...c, title } : c)));
  };

  const handleSelectChat = (id) => setActiveChatId(id);

  const handleSend = async (text) => {
    if (!text?.trim() || !token) {
      console.warn("[FI9] handleSend: token manquant ou texte vide", { token: token ? "présent" : "absent", text });
      return;
    }
    
    // FI9_NAYEK: Log strict - Token utilisé depuis AuthContext uniquement
    console.log("[FI9] handleSend - Token depuis AuthContext:", token ? `${token.substring(0, 30)}...` : "NULL");
    
    // FI9_NAYEK: Ajouter le message utilisateur optimiste
    const userMessage = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, userMessage] }
          : c
      )
    );

    // FI9_NAYEK: Appel API réel avec token obligatoire depuis AuthContext uniquement
    try {
      const response = await sendMessage(text.trim(), token);
      const messages = Array.isArray(response) ? response : [response];
      const assistantMessages = messages.map((msg) => ({
        id: msg.id || crypto.randomUUID(),
        role: msg.role || "assistant",
        content: msg.content || msg.message || "Réponse reçue",
      }));
      
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, ...assistantMessages] }
            : c
        )
      );
    } catch (error) {
      console.error("[CHAT] Erreur:", error);
      const errorMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Erreur: ${error?.message || "Impossible d'envoyer le message"}`,
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, errorMessage] }
            : c
        )
      );
    }
  };

  const handleDeleteChat = (id) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (id === activeChatId && chats.length > 1) {
      const next = chats.find((c) => c.id !== id);
      if (next) setActiveChatId(next.id);
    }
  };

  return (
    <div 
      className="min-h-screen w-full flex theme-transition"
      style={{ 
        backgroundColor: theme.background,
        color: theme.text,
        transition: 'background-color 80ms ease, color 80ms ease'
      }}
    >
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex-1 h-screen overflow-hidden">
        <ChatArea
          title={activeChat?.title || "Chat"}
          messages={activeChat?.messages || []}
          onSend={handleSend}
          onRename={handleRenameChat}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />
      </main>
    </div>
  );
}