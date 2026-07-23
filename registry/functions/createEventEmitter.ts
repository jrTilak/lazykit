type Listener<Value> = (value: Value) => void;

type EventEmitter<Events extends object> = {
  on: <Event extends keyof Events>(event: Event, listener: Listener<Events[Event]>) => () => void;
  once: <Event extends keyof Events>(event: Event, listener: Listener<Events[Event]>) => () => void;
  off: <Event extends keyof Events>(event: Event, listener: Listener<Events[Event]>) => void;
  emit: <Event extends keyof Events>(event: Event, value: Events[Event]) => void;
  clear: (event?: keyof Events) => void;
  listenerCount: (event: keyof Events) => number;
};

/** Creates a small synchronous, type-safe event emitter. */
export const createEventEmitter = <Events extends object>(): EventEmitter<Events> => {
  const listeners = new Map<keyof Events, Set<Listener<Events[keyof Events]>>>();
  const on: EventEmitter<Events>["on"] = (event, listener) => {
    let eventListeners = listeners.get(event);
    if (!eventListeners) {
      eventListeners = new Set();
      listeners.set(event, eventListeners);
    }
    eventListeners.add(listener as Listener<Events[keyof Events]>);
    return () => eventListeners?.delete(listener as Listener<Events[keyof Events]>);
  };
  const off: EventEmitter<Events>["off"] = (event, listener) => {
    listeners.get(event)?.delete(listener as Listener<Events[keyof Events]>);
  };
  const once: EventEmitter<Events>["once"] = (event, listener) => {
    const unsubscribe = on(event, ((value: Events[typeof event]) => {
      unsubscribe();
      listener(value);
    }) as Listener<Events[typeof event]>);
    return unsubscribe;
  };
  const emit: EventEmitter<Events>["emit"] = (event, value) => {
    for (const listener of [...(listeners.get(event) ?? [])]) listener(value);
  };
  return {
    on,
    once,
    off,
    emit,
    clear: (event) => event === undefined ? listeners.clear() : void listeners.delete(event),
    listenerCount: (event) => listeners.get(event)?.size ?? 0,
  };
};
