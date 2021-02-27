import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/sync/type";

export function toArray<T extends TransduceFunction<any, any>>(tf: T) {
  return function (
    iter: Iterable<TransduceFunctionIn<T>>
  ): TransduceFunctionOut<T>[] {
    let result: TransduceFunctionOut<T>[] = [];
    const [transduce, squeeze] = tf((x) => (result.push(x), true));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return result;
      }
    }

    squeeze?.();
    return result;
  };
}
