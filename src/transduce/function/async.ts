import { TransduceFunction } from "../type";

interface Map<T, K> {
  (x: T): K | Promise<K>;
}

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function map<T, K>(f: Map<T, K>): TransduceFunction<T, K> {
  return (next) => async (x) => {
    const r = await f(x);
    await next(r);
  };
}

export function filter<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => async (x) => {
    const ok = await f(x);
    if (ok) {
      await next(x);
    }
  };
}

export function take<T>(n: number): TransduceFunction<T, T> {
  return (next, break_) => {
    if (0 < n) {
      let count = n;
      return async (x) => {
        count--;
        await next(x);
        if (count === 0) {
          break_();
        }
      };
    } else {
      break_();
      return () => {};
    }
  };
}
