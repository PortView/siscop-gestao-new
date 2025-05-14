import React, { createContext, useContext, useCallback, useRef } from "react";

// Tipo do handler de evento
export type EventHandler = (payload?: any) => void;

interface EventBusContextType {
  subscribe: (event: string, handler: EventHandler) => void;
  unsubscribe: (event: string, handler: EventHandler) => void;
  publish: (event: string, payload?: any) => void;
}

const EventBusContext = createContext<EventBusContextType | undefined>(undefined);

export const EventBusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Handlers organizados por nome de evento
  const handlers = useRef<{ [event: string]: Set<EventHandler> }>({});

  const subscribe = useCallback((event: string, handler: EventHandler) => {
    if (!handlers.current[event]) handlers.current[event] = new Set();
    handlers.current[event].add(handler);
  }, []);

  const unsubscribe = useCallback((event: string, handler: EventHandler) => {
    handlers.current[event]?.delete(handler);
  }, []);

  const publish = useCallback((event: string, payload?: any) => {
    handlers.current[event]?.forEach((handler) => handler(payload));
  }, []);

  return (
    <EventBusContext.Provider value={{ subscribe, unsubscribe, publish }}>
      {children}
    </EventBusContext.Provider>
  );
};

export function useEventBus() {
  const ctx = useContext(EventBusContext);
  if (!ctx) throw new Error("useEventBus deve ser usado dentro de EventBusProvider");
  return ctx;
}
