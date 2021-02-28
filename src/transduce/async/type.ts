interface Raise<T> {
  (x: T): Promise<boolean>;
}

interface Squeeze {
  (): Promise<boolean>;
}

export interface AsyncTransduceFunction<T, K> {
  (next: Raise<K>, squeeze?: Squeeze): [Raise<T>, Squeeze?];
}

export type AsyncTransduceFunctionIn<
  T extends AsyncTransduceFunction<any, any>
> = T extends AsyncTransduceFunction<infer K, any> ? K : never;

export type AsyncTransduceFunctionOut<
  T extends AsyncTransduceFunction<any, any>
> = T extends AsyncTransduceFunction<any, infer K> ? K : never;
