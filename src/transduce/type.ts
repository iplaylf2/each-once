interface Raise<T> {
  (x: T): void;
}

interface Break {
  (): void;
}

export interface TransduceFunction<T, K> {
  (next: Raise<K>, break_: Break): Raise<T>;
}
