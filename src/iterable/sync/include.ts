import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/sync/type";

export function include<T extends TransduceFunction<any, any>>(
  v: TransduceFunctionOut<T>,
  tf: T
) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): boolean {
    let include = false;
    const [transduce, squeeze] = tf(
      (x) => x !== v || ((include = true), false)
    );

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return include;
      }
    }

    squeeze?.();
    return include;
  };
}
