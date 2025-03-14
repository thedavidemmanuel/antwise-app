// utils/refreshEvents.ts

export const refreshEvents = {
    listeners: new Set<() => void>(),
  
    addListener(callback: () => void) {
      this.listeners.add(callback);
      return () => this.listeners.delete(callback);
    },
  
    trigger() {
      this.listeners.forEach(callback => callback());
    },
  };
  