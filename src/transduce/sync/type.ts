interface Raise<T> {
  (x: T): boolean;
}

interface Squeeze {
  (): boolean;
}

export interface TransduceFunction<T, K> {
  (next: Raise<K>, squeeze?: Squeeze): [Raise<T>, Squeeze?];
}

export type TransduceFunctionIn<
  T extends TransduceFunction<any, any>
> = T extends TransduceFunction<infer K, any> ? K : never;

export type TransduceFunctionOut<
  T extends TransduceFunction<any, any>
> = T extends TransduceFunction<any, infer K> ? K : never;
