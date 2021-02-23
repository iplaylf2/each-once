import { TransduceFunction } from "../type";

interface Map<T, K> {
  (x: T): K;
}

interface Predicate<T> {
  (x: T): boolean;
}

export function map<T, K>(f: Map<T, K>): TransduceFunction<T, K> {
  return (next) => (x) => next(f(x));
}

export function filter<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => (x) => {
    if (f(x)) {
      next(x);
    }
  };
}

export function take<T>(n: number): TransduceFunction<T, T> {
  return (next, break_) => {
    if (0 < n) {
      let count = n;
      return (x) => {
        count--;
        next(x);
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
