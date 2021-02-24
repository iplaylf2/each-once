interface Raise<T> {
  (x: T): void;
}

interface Break {
  (): void;
}

export interface TransduceFunction<T, K> {
  (next: Raise<K>, break_: Break): Raise<T>;
}

export type TransduceFunctionIn<
  T extends TransduceFunction<any, any>
> = T extends TransduceFunction<infer K, any> ? K : never;

export type TransduceFunctionOut<
  T extends TransduceFunction<any, any>
> = T extends TransduceFunction<any, infer K> ? K : never;
