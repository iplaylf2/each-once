import { TransduceFunction } from "../transduce/type";

interface ReduceFunction<T, K> {
  (r: K, x: T): K;
}

export function reduce<T, K, R>(
  iter: Iterable<T>,
  tf: TransduceFunction<T, K>,
  rf: ReduceFunction<K, R>,
  v: R
): R {
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
}

interface Action<T> {
  (x: T): void;
}

export function foreach<T, K>(
  iter: Iterable<T>,
  tf: TransduceFunction<T, K>,
  f: Action<K>
): void {
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
}

export function* iterate<T, K>(
  iter: Iterable<T>,
  tf: TransduceFunction<T, K>
): Generator<K> {
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
}
