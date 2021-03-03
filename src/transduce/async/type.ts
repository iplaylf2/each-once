interface Raise<T> {
  (x: T): Promise<boolean>;
}

interface Dispose {
  (continue_: boolean): Promise<boolean>;
}

export interface AsyncTransduceFunction<T, K> {
  (next: Raise<K>): [Raise<T>, Dispose?];
}

export type AsyncTransduceFunctionIn<
  T extends AsyncTransduceFunction<any, any>
> = T extends AsyncTransduceFunction<infer K, any> ? K : never;

export type AsyncTransduceFunctionOut<
  T extends AsyncTransduceFunction<any, any>
> = T extends AsyncTransduceFunction<any, infer K> ? K : never;

export interface AsyncTransduceHandler<T, K> {
  reduce(x: T): Promise<[true, K] | [false]>;
  done(): Promise<K>;
  isDone: boolean;
}
