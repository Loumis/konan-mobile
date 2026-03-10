/**
 * FI9_NAYEK: UI sync service for FI9 protocol events
 */

export interface UIEvent {
  type: 'message_sent' | 'message_received' | 'typing_start' | 'typing_stop' | 'scroll' | 'expand';
  payload?: any;
  timestamp: Date;
}

class UISyncService {
  private listeners: Map<string, Set<(event: UIEvent) => void>> = new Map();

  /**
   * Emit UI event
   */
  emit(event: UIEvent) {
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
  }

  /**
   * Subscribe to UI events
   */
  on(eventType: UIEvent['type'], callback: (event: UIEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  /**
   * Unsubscribe from UI events
   */
  off(eventType: UIEvent['type'], callback: (event: UIEvent) => void) {
    this.listeners.get(eventType)?.delete(callback);
  }

  /**
   * Clear all listeners
   */
  clear() {
    this.listeners.clear();
  }
}

export const uiSync = new UISyncService();

