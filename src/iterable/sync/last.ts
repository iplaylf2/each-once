import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/sync/type";

export function last<T extends TransduceFunction<any, any>>(tf: T) {
  return function (
    iter: Iterable<TransduceFunctionIn<T>>
  ): TransduceFunctionOut<T> | void {
    let last: TransduceFunctionOut<T>;
    const [transduce, squeeze] = tf((x) => ((last = x), true));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return last!;
      }
    }

    squeeze?.();
    return last!;
  };
}
