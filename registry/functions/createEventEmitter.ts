export type EventListener<Value> = (this: void, value: Value) => void;

export type EventSubscriptionArguments<Events extends object> = {
  [Event in keyof Events]: [
    event: Event,
    listener: EventListener<Events[Event]>,
  ];
}[keyof Events];

export type EventEmissionArguments<Events extends object> = {
  [Event in keyof Events]: [event: Event, value: Events[Event]];
}[keyof Events];

export type EventEmitter<Events extends object> = {
  on: <Event extends keyof Events>(
    event: Event,
    listener: EventListener<Events[NoInfer<Event>]>
  ) => () => void;
  once: <Event extends keyof Events>(
    event: Event,
    listener: EventListener<Events[NoInfer<Event>]>
  ) => () => void;
  off: <Event extends keyof Events>(
    event: Event,
    listener: EventListener<Events[NoInfer<Event>]>
  ) => void;
  emit: (...args: EventEmissionArguments<Events>) => void;
  clear: (event?: keyof Events) => void;
  listenerCount: (event: keyof Events) => number;
};

/** Creates a small synchronous, type-safe event emitter. */
export const createEventEmitter = <Events extends object>(): EventEmitter<Events> => {
  const listeners = new Map<keyof Events, Set<EventListener<never>>>();

  const addListener = (
    event: keyof Events,
    listener: EventListener<never>
  ): (() => void) => {
    let eventListeners = listeners.get(event);
    if (!eventListeners) {
      eventListeners = new Set();
      listeners.set(event, eventListeners);
    }
    eventListeners.add(listener);
    return () => {
      eventListeners.delete(listener);
    };
  };

  const on: EventEmitter<Events>["on"] = (event, listener) => {
    return addListener(event, listener as EventListener<never>);
  };

  const off: EventEmitter<Events>["off"] = (event, listener) => {
    listeners.get(event)?.delete(listener as EventListener<never>);
  };

  const once: EventEmitter<Events>["once"] = (event, listener) => {
    const wrapped: EventListener<never> = (value) => {
      unsubscribe();
      listener(value);
    };
    const unsubscribe = addListener(event, wrapped);
    return unsubscribe;
  };

  const emit: EventEmitter<Events>["emit"] = (...[event, value]) => {
    for (const listener of [...(listeners.get(event) ?? [])]) {
      listener(value as never);
    }
  };

  return {
    on,
    once,
    off,
    emit,
    clear: (event) =>
      event === undefined ? listeners.clear() : void listeners.delete(event),
    listenerCount: (event) => listeners.get(event)?.size ?? 0,
  };
};
