import { TransduceFunction } from "../type";

interface Map<T, K> {
  (x: T): K;
}

interface Scan<T, K> {
  (r: K, x: T): K;
}

interface Predicate<T> {
  (x: T): boolean;
}

export function map<T, K>(f: Map<T, K>): TransduceFunction<T, K> {
  return (next) => (x) => next(f(x));
}

export function scan<T, K>(f: Scan<T, K>, v: K): TransduceFunction<T, K> {
  return (next) => {
    let r = v;
    return (x) => {
      r = f(r, x);
      next(r);
    };
  };
}

export function filter<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => (x) => {
    if (f(x)) {
      next(x);
    }
  };
}

export function remove<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => (x) => {
    if (!f(x)) {
      next(x);
    }
  };
}

export function take<T>(n: number): TransduceFunction<T, T> {
  n = Math.ceil(n);
  if (0 < n) {
    return (next, break_) => {
      let count = n;
      return (x) => {
        count--;
        next(x);
        if (count === 0) {
          break_();
        }
      };
    };
  } else {
    return (_, break_) => (break_(), () => {});
  }
}

export function takeWhile<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next, break_) => (x) => {
    if (f(x)) {
      next(x);
    } else {
      break_();
    }
  };
}

export function skip<T>(n: number): TransduceFunction<T, T> {
  n = Math.ceil(n);
  if (0 < n) {
    let count = n;
    let skip = true;
    return (next) => {
      return (x) => {
        if (skip) {
          count--;
          if (count === 0) {
            skip = false;
          }
        } else {
          next(x);
        }
      };
    };
  } else {
    return (next) => next;
  }
}

export function skipWhile<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => {
    let skip = true;
    return (x) => {
      if (skip) {
        if (f(x)) {
          return;
        } else {
          skip = false;
        }
      }
      next(x);
    };
  };
}

export function partition<T>(n: number): TransduceFunction<T, T[]> {
  n = Math.ceil(n);
  if (n <= 0) {
    throw "n <= 0";
  }
  return (next) => {
    let result: T[] = [];
    return (x) => {
      result.push(x);
      if (result.length === n) {
        next(result);
        result = [];
      }
    };
  };
}

export function partitionBy<T>(f: Map<T, any>): TransduceFunction<T, T[]> {
  return (next) => {
    let result: T[];
    let flag: any;
    return (x) => {
      const current = f(x);
      if (flag === current) {
        result.push(x);
      } else {
        if (0 < result.length) {
          next(result);
        }
        flag = current;
        result = [x];
      }
    };
  };
}

export function flatten<T>(): TransduceFunction<T[], T> {
  return (next) => (xx) => {
    for (const x of xx) {
      next(x);
    }
  };
}
