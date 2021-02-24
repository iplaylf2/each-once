import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/type";

interface Action<T> {
  (x: T): void;
}

export function foreach<T extends TransduceFunction<any, any>>(
  tf: T,
  f: Action<TransduceFunctionOut<T>>
) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): void {
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
