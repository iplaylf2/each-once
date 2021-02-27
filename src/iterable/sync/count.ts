import {
  TransduceFunction,
  TransduceFunctionIn,
} from "../../transduce/sync/type";

export function count<T extends TransduceFunction<any, any>>(tf: T) {
  return function (iter: Iterable<TransduceFunctionIn<T>>): number {
    let count = 0;
    const [transduce, dispose] = tf(() => (count++, true));

    for (const x of iter) {
      const continue_ = transduce(x);

      if (!continue_) {
        return count;
      }
    }

    dispose?.();
    return count;
  };
}
