import { TransduceFunction } from "../transduce/type";

interface ReduceFunction<T, K> {
  (r: K, x: T): K;
}

interface Action<T> {
  (x: T): void;
}

export function reduce<T, K>(rf: ReduceFunction<T, K>, v: K) {
  return <S>(tf: TransduceFunction<S, T>) => (iter: Iterable<S>): K => {
    let r = v;
    let is_break = false;
    const transduce = tf(
      (x) => {
        r = rf(r, x);
      },
      () => {
        is_break = true;
      }
    );

    if (is_break) {
      return r;
    }

    for (const x of iter) {
      transduce(x);

      if (is_break) {
        break;
      }
    }

    return r;
  };
}

export function foreach<T>(f: Action<T>) {
  return <S>(tf: TransduceFunction<S, T>) => (iter: Iterable<S>): void => {
    let is_break = false;
    const transduce = tf(f, () => {
      is_break = true;
    });

    if (is_break) {
      return;
    }

    for (const x of iter) {
      transduce(x);

      if (is_break) {
        break;
      }
    }
  };
}

export function iterate<T, K>(tf: TransduceFunction<T, K>) {
  return function* (iter: Iterable<T>): Generator<K> {
    let result: K[] = [];
    let is_break = false;
    const transduce = tf(
      (x) => {
        result.push(x);
      },
      () => {
        is_break = true;
      }
    );

    if (is_break) {
      return;
    }

    for (const x of iter) {
      transduce(x);

      for (const x of result) {
        yield x;
      }

      if (is_break) {
        break;
      } else {
        result = [];
      }
    }
  };
}
