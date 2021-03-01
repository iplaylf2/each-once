import { AsyncTransduceFunction } from "./type";

interface Map<T, K> {
  (x: T): K | Promise<K>;
}

interface Scan<T, K> {
  (r: K, x: T): K | Promise<K>;
}

interface Predicate<T> {
  (x: T): boolean | Promise<boolean>;
}

export function map<T, K>(f: Map<T, K>): AsyncTransduceFunction<T, K> {
  return (next) => [async (x) => next(await f(x))];
}

export function scan<T, K>(f: Scan<T, K>, v: K): AsyncTransduceFunction<T, K> {
  return (next) => {
    let r = v;
    return [async (x) => ((r = await f(r, x)), next(r))];
  };
}

export function filter<T>(f: Predicate<T>): AsyncTransduceFunction<T, T> {
  return (next) => [async (x) => ((await f(x)) ? next(x) : true)];
}

export function remove<T>(f: Predicate<T>): AsyncTransduceFunction<T, T> {
  return (next) => [async (x) => (await f(x)) || next(x)];
}

export function take<T>(n: number): AsyncTransduceFunction<T, T> {
  n = Math.ceil(n);
  if (0 < n) {
    return (next, squeeze) => {
      let count = n;
      return [
        async (x) => {
          count--;
          if (count === 0) {
            await next(x);
            await squeeze?.();
            return false;
          } else {
            return next(x);
          }
        },
      ];
    };
  } else {
    return () => [async () => false];
  }
}

export function takeWhile<T>(f: Predicate<T>): AsyncTransduceFunction<T, T> {
  return (next, squeeze) => [
    async (x) => ((await f(x)) ? next(x) : (await squeeze?.(), false)),
  ];
}

export function skip<T>(n: number): AsyncTransduceFunction<T, T> {
  n = Math.ceil(n);
  if (0 < n) {
    let count = n;
    let skip = true;
    return (next) => {
      return [
        async (x) => {
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

export function skipWhile<T>(f: Predicate<T>): AsyncTransduceFunction<T, T> {
  return (next) => {
    let skip = true;
    return [
      async (x) => {
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

export function partition<T>(n: number): AsyncTransduceFunction<T, T[]> {
  n = Math.ceil(n);
  if (n <= 0) {
    throw "n <= 0";
  }
  return (next) => {
    let cache: T[] = [];
    return [
      async (x) => {
        cache.push(x);
        if (cache.length === n) {
          const result = cache;
          cache = [];
          return next(result);
        } else {
          return true;
        }
      },
      async () => (0 < cache.length ? next(cache) : true),
    ];
  };
}

export function partitionBy<T>(f: Map<T, any>): AsyncTransduceFunction<T, T[]> {
  return (next) => {
    let cache: T[];
    let flag: any;
    return [
      async (x) => {
        const current = await f(x);
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
      async () => (cache ? next(cache) : true),
    ];
  };
}

export function flatten<T>(): AsyncTransduceFunction<T[], T> {
  return (next) => [
    async (xx) => {
      for (const x of xx) {
        const continue_ = await next(x);

        if (!continue_) {
          return false;
        }
      }
      return true;
    },
  ];
}

export { groupBy } from "./function/group-by";
