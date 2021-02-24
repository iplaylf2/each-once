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
    let is_break = false;
    const transduce = tf(
      (x) => {
        result.push(x);
      },
      () => {
        is_break = true;
      }
    );

    if (is_break) {
      return;
    }

    for (const x of iter) {
      transduce(x);

      for (const x of result) {
        yield x;
      }

      if (is_break) {
        break;
      } else {
        result = [];
      }
    }
  };
}
