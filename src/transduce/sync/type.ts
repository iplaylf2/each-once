interface Raise<T> {
  (x: T): boolean;
}

interface Dispose {
  (): boolean;
}

export interface TransduceFunction<T, K> {
  (next: Raise<K>): [Raise<T>, Dispose?];
}

export type TransduceFunctionIn<
  T extends TransduceFunction<any, any>
> = T extends TransduceFunction<infer K, any> ? K : never;

export type TransduceFunctionOut<
  T extends TransduceFunction<any, any>
> = T extends TransduceFunction<any, infer K> ? K : never;
