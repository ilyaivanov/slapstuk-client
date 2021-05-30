type Callback<T> = T extends void ? () => void : (param: T) => void;

class Events<T = Record<string, any>> {
  events: Record<keyof T, Action<any>[]> = {} as any;

  public trigger = <TKey extends keyof T>(
    eventName: TKey,
    payload: T[TKey]
  ) => {
    const callbacks = this.events[eventName];

    if (callbacks) callbacks.forEach((cb) => cb(payload));
  };

  public on<TKey extends keyof T>(eventName: TKey, cb: Callback<T[TKey]>) {
    if (!this.events[eventName]) this.events[eventName] = [];

    this.events[eventName].push(cb);
  }

  public off<TKey extends keyof T>(eventName: TKey, cb: Callback<T[TKey]>) {
    const callbacks = this.events[eventName];

    if (callbacks) this.events[eventName] = callbacks.filter((c) => c != cb);
  }

  public offAll<TKey extends keyof T>(eventName: TKey) {
    delete this.events[eventName];
  }
}

export default Events;
