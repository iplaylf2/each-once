import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/type";

interface Action<T> {
  (x: T): any;
}

export function foreach<T extends TransduceFunction<any, any>>(
  tf: T,
  f: Action<TransduceFunctionOut<T>>
) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): void {
    const [transduce, dispose] = tf((x) => f(x) !== false);

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        break;
      }
    }

    dispose?.();
  };
}
