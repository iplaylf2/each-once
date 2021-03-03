import {
  AsyncTransduceFunction,
  AsyncTransduceFunctionIn,
  AsyncTransduceFunctionOut,
} from "./type";

export function conj<T extends AsyncTransduceFunction<any, any>, K>(
  tf: T,
  tail: AsyncTransduceFunction<AsyncTransduceFunctionOut<T>, K>
): AsyncTransduceFunction<AsyncTransduceFunctionIn<T>, K> {
  return (yield_) => {
    const [next2, dispose2] = tail(yield_);
    const [next1, dispose1] = tf(next2);
    return [
      next1,
      dispose2
        ? dispose1
          ? async (continue_) => dispose2(await dispose1(continue_))
          : dispose2
        : dispose1,
    ];
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
