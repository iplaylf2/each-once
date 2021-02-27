import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/sync/type";

interface Predicate<T> {
  (x: T): boolean;
}

export function every<T extends TransduceFunction<any, any>>(
  tf: T,
  f: Predicate<TransduceFunctionOut<T>>
) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): boolean {
    let every = true;
    const [transduce, dispose] = tf((x) => f(x) || ((every = false), false));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return every;
      }
    }

    dispose?.();
    return every;
  };
}
