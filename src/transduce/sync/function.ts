import { TransduceFunction } from "./type";

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
  return (next) => [(x) => next(f(x))];
}

export function scan<T, K>(f: Scan<T, K>, v: K): TransduceFunction<T, K> {
  return (next) => {
    let r = v;
    return [(x) => ((r = f(r, x)), next(r))];
  };
}

export function filter<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => [(x) => (f(x) ? next(x) : true)];
}

export function remove<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => [(x) => f(x) || next(x)];
}

export function take<T>(n: number): TransduceFunction<T, T> {
  n = Math.ceil(n);
  if (0 < n) {
    return (next) => {
      let count = n;
      let dispose = false;
      let last: T;
      return [
        (x) => {
          count--;
          if (count === 0) {
            // raise 'break' as soon as possible
            dispose = true;
            last = x;
            return false;
          } else {
            return next(x);
          }
        },
        (continue_) => (dispose ? next(last) : continue_),
      ];
    };
  } else {
    return () => [() => false];
  }
}

export function takeWhile<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => {
    let dispose = false;
    return [
      (x) => {
        if (f(x)) {
          return next(x);
        } else {
          dispose = true;
          return false;
        }
      },
      (continue_) => dispose || continue_,
    ];
  };
}

export function skip<T>(n: number): TransduceFunction<T, T> {
  n = Math.ceil(n);
  if (0 < n) {
    let count = n;
    let skip = true;
    return (next) => {
      return [
        (x) => {
          if (skip) {
            count--;
            if (count === 0) {
              skip = false;
            }
            return true;
          } else {
            return next(x);
          }
        },
      ];
    };
  } else {
    return (next) => [next];
  }
}

export function skipWhile<T>(f: Predicate<T>): TransduceFunction<T, T> {
  return (next) => {
    let skip = true;
    return [
      (x) => {
        if (skip) {
          if (f(x)) {
            return true;
          } else {
            skip = false;
          }
        }
        return next(x);
      },
    ];
  };
}

export function partition<T>(n: number): TransduceFunction<T, T[]> {
  n = Math.ceil(n);
  if (n <= 0) {
    throw "n <= 0";
  }
  return (next) => {
    let cache: T[] = [];
    return [
      (x) => {
        cache.push(x);
        if (cache.length === n) {
          const result = cache;
          cache = [];
          return next(result);
        } else {
          return true;
        }
      },
      (continue_) => continue_ && (0 < cache.length ? next(cache) : true),
    ];
  };
}

export function partitionBy<T>(f: Map<T, any>): TransduceFunction<T, T[]> {
  return (next) => {
    let cache: T[];
    let flag: any;
    return [
      (x) => {
        const current = f(x);
        if (flag === current) {
          cache.push(x);
        } else {
          const result = cache;
          flag = current;
          cache = [x];
          if (result) {
            return next(result);
          }
        }
        return true;
      },
      (continue_) => continue_ && (cache ? next(cache) : true),
    ];
  };
}

export function flatten<T>(): TransduceFunction<T[], T> {
  return (next) => [
    (xx) => {
      for (const x of xx) {
        const continue_ = next(x);

        if (!continue_) {
          return false;
        }
      }
      return true;
    },
  ];
}

export { groupBy } from "./function/group-by";
