import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/type";

interface ReduceFunction<T, K> {
  (r: K, x: T): K;
}

export function reduce<T extends TransduceFunction<any, any>, K>(
  tf: T,
  rf: ReduceFunction<TransduceFunctionOut<T>, K>,
  v: K
) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): K {
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
