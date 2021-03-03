import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "./type";

export function conj<T extends TransduceFunction<any, any>, K>(
  tf: T,
  tail: TransduceFunction<TransduceFunctionOut<T>, K>
): TransduceFunction<TransduceFunctionIn<T>, K> {
  return (yield_) => {
    const [next2, squeeze2] = tail(yield_);
    const [next1, squeeze1] = tf(next2);
    return [
      next1,
      squeeze2
        ? squeeze1
          ? (continue_) => squeeze2(squeeze1(continue_))
          : squeeze2
        : squeeze1,
    ];
  };
}

export type Conj<
  T extends TransduceFunction<any, any>,
  K extends TransduceFunction<any, any>
> = TransduceFunctionOut<T> extends TransduceFunctionIn<K>
  ? TransduceFunction<TransduceFunctionIn<T>, TransduceFunctionOut<K>>
  : never;
