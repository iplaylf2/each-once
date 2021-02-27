import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/sync/type";

interface Predicate<T> {
  (x: T): boolean;
}

export function some<T extends TransduceFunction<any, any>>(
  tf: T,
  f: Predicate<TransduceFunctionOut<T>>
) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): boolean {
    let some = false;
    const [transduce, dispose] = tf((x) =>
      f(x) ? ((some = true), false) : true
    );

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return some;
      }
    }

    dispose?.();
    return some;
  };
}
