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
    const [next2, squeeze2] = tail(yield_);
    const [next1, squeeze1] = tf(next2);
    return [
      next1,
      squeeze2
        ? squeeze1
          ? async (continue_) => squeeze2(await squeeze1(continue_))
          : squeeze2
        : squeeze1,
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
