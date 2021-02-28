import {
  AsyncTransduceFunction,
  AsyncTransduceFunctionIn,
  AsyncTransduceFunctionOut,
} from "./type";

export function conj<T extends AsyncTransduceFunction<any, any>, K>(
  tf: T,
  tail: AsyncTransduceFunction<AsyncTransduceFunctionOut<T>, K>
): AsyncTransduceFunction<AsyncTransduceFunctionIn<T>, K> {
  return (yield_, squeeze_3) => {
    const [next2, squeeze2] = tail(yield_, squeeze_3);
    const _squeeze2 = squeeze_3
      ? squeeze2
        ? async () => (await squeeze2()) && (await squeeze_3())
        : squeeze_3
      : squeeze2;
    const [next1, squeeze1] = tf(next2, _squeeze2);
    const _squeeze1 = _squeeze2
      ? squeeze1
        ? async () => (await squeeze1()) && (await _squeeze2())
        : _squeeze2
      : squeeze1;
    return [next1, _squeeze1];
  };
}

export type Conj<
  T extends AsyncTransduceFunction<any, any>,
  K extends AsyncTransduceFunction<any, any>
> = AsyncTransduceFunctionOut<T> extends AsyncTransduceFunctionIn<K>
  ? AsyncTransduceFunction<
      AsyncTransduceFunctionIn<T>,
      AsyncTransduceFunctionOut<K>
    >
  : never;
