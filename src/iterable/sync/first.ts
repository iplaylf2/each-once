import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/sync/type";

export function first<T extends TransduceFunction<any, any>>(tf: T) {
  return function (
    iter: Iterable<TransduceFunctionIn<T>>
  ): TransduceFunctionOut<T> | void {
    let first: TransduceFunctionOut<T>;
    const [transduce, dispose] = tf((x) => ((first = x), false));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return first!;
      }
    }

    dispose?.();
    return first!;
  };
}
