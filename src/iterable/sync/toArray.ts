import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "../../transduce/type";

export function toArray<T extends TransduceFunction<any, any>>(tf: T) {
  return function (
    iter: Iterable<TransduceFunctionIn<T>>
  ): TransduceFunctionOut<T>[] {
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
      return [];
    }

    for (const x of iter) {
      transduce(x);

      if (is_break) {
        break;
      }
    }

    return result;
  };
}
