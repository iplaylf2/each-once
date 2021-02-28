import {
  TransduceFunction,
  TransduceFunctionIn,
  TransduceFunctionOut,
} from "./type";

export function conj<T extends TransduceFunction<any, any>, K>(
  tf: T,
  tail: TransduceFunction<TransduceFunctionOut<T>, K>
): TransduceFunction<TransduceFunctionIn<T>, K> {
  return (yield_, squeeze_3) => {
    const [next2, squeeze2] = tail(yield_, squeeze_3);
    const _squeeze2 = squeeze_3
      ? squeeze2
        ? () => squeeze2() && squeeze_3()
        : squeeze_3
      : squeeze2;
    const [next1, squeeze1] = tf(next2, _squeeze2);
    const _squeeze1 = _squeeze2
      ? squeeze1
        ? () => squeeze1() && _squeeze2()
        : _squeeze2
      : squeeze1;
    return [next1, _squeeze1];
  };
}

export type Conj<
  T extends TransduceFunction<any, any>,
  K extends TransduceFunction<any, any>
> = TransduceFunctionOut<T> extends TransduceFunctionIn<K>
  ? TransduceFunction<TransduceFunctionIn<T>, TransduceFunctionOut<K>>
  : never;
