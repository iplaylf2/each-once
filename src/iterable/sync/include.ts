import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/sync/type";

export function include<T extends TransduceFunction<any, any>>(
  tf: T,
  v: TransduceFunctionOut<T>
) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): boolean {
    let include = false;
    const [transduce, dispose] = tf(
      (x) => x !== v || ((include = true), false)
    );

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return include;
      }
    }

    dispose?.();
    return include;
  };
}
