import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/type";

export function iterate<T extends TransduceFunction<any, any>>(tf: T) {
  return function* (
    iter: Iterable<TransduceFunctionIn<T>>
  ): Generator<TransduceFunctionOut<T>> {
    let result: TransduceFunctionOut<T>[] = [];
    const transduce = tf((x) => (result.push(x), true));

    for (const x of iter) {
      const continue_ = transduce(x);

      for (const x of result) {
        yield x;
      }

      if (continue_) {
        result = [];
      } else {
        break;
      }
    }
  };
}
