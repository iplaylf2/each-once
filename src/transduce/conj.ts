import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "./type";

export function conj<T extends TransduceFunction<any, any>, K>(
  tf: T,
  tail: TransduceFunction<TransduceFunctionOut<T>, K>
): TransduceFunction<TransduceFunctionIn<T>, K> {
  return (yield_) => tf(tail(yield_));
}

export type Conj<
  T extends TransduceFunction<any, any>,
  K extends TransduceFunction<any, any>
> = TransduceFunctionOut<T> extends TransduceFunctionIn<K>
  ? TransduceFunction<TransduceFunctionIn<T>, TransduceFunctionOut<K>>
  : never;
